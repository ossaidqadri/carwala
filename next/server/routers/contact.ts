import { z } from "zod";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import { publicProcedure, router } from "../trpc";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// Sanitize user input to prevent injection attacks
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
}

// Validate and sanitize all contact form fields
function sanitizeContactData(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
}): {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
} {
  return {
    name: sanitizeInput(data.name).slice(0, 100),
    email: sanitizeInput(data.email).slice(0, 254),
    phone: data.phone.replace(/[^0-9+\-\s()]/g, '').slice(0, 20),
    service: sanitizeInput(data.service).slice(0, 50),
    message: sanitizeInput(data.message || '').slice(0, 2000),
  };
}

function getGoogleAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: SCOPES,
  });
  return auth;
}

async function appendToSheet(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) {
  const auth = getGoogleAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const timestamp = new Date().toISOString();
  const values = [
    [
      timestamp,
      data.name,
      data.email,
      data.phone,
      data.service,
      data.message,
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A:F",
    valueInputOption: "RAW",
    requestBody: {
      values,
    },
  });
}

async function sendEmail(data: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const emailContent = `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Service: ${data.service}

Message:
${data.message}
  `.trim();

  const recipients = process.env.GMAIL_RECIPIENTS || process.env.GMAIL_USER;

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: recipients,
    subject: "New Contact Form Submission - Carwala",
    text: emailContent,
  });
}

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(1, {
    message: "Phone number is required.",
  }),
  service: z.string().min(1, {
    message: "Service selection is required.",
  }),
  message: z.string().optional(),
});

export const contactRouter = router({
  submit: publicProcedure
    .input(contactFormSchema)
    .mutation(async ({ input }) => {
      // Sanitize input before processing
      const sanitizedData = sanitizeContactData(input);
      await Promise.all([
        appendToSheet(sanitizedData),
        sendEmail(sanitizedData),
      ]);
      return { message: "Form submitted successfully" };
    }),
});

import { google } from "googleapis";
import nodemailer from "nodemailer";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

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

export async function appendToSheet(data: {
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

export async function sendEmail(data: {
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
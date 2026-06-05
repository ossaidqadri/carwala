import { NextRequest, NextResponse } from "next/server";
import { contactSchema, sanitizeContactInput } from "@car-wala/schemas";
import { appendToSheet, sendEmail } from "@/lib/contact-handlers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod schema from @car-wala/schemas
    const parseResult = contactSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    // Sanitize validated input (XSS prevention)
    const sanitizedData = sanitizeContactInput(parseResult.data);

    // Run Google Sheets + Gmail in parallel
    await Promise.all([
      appendToSheet(sanitizedData),
      sendEmail(sanitizedData),
    ]);

    return NextResponse.json(
      { message: "Form submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { validateAgentRequest } from "@/lib/agent/auth";
import { AGENT_DEFAULTS, generateEmailFromPhone } from "@/lib/agent/defaults";

export async function POST(request: NextRequest) {
  const auth = validateAgentRequest(request);
  if (!auth.valid) return auth.response!;

  try {
    const body = await request.json();

    const { eventTypeId, start, name, phone, email, notes } = body;

    if (!eventTypeId || !start || !name) {
      return NextResponse.json(
        { error: "Missing required fields: eventTypeId, start, name" },
        { status: 400 }
      );
    }

    // Voice callers won't provide email — generate traceable placeholder
    const attendeeEmail = email || (phone ? generateEmailFromPhone(phone) : null);

    if (!attendeeEmail) {
      return NextResponse.json(
        { error: "Either email or phone is required" },
        { status: 400 }
      );
    }

    const bookingPayload = {
      eventTypeId,
      start,
      attendee: {
        name,
        email: attendeeEmail,
        timeZone: AGENT_DEFAULTS.timezone,
        language: AGENT_DEFAULTS.language,
      },
      metadata: {
        notes: notes || "Booked via AI agent",
        referralSource: "ai-agent",
      },
      bookingFieldsResponses: {
        name,
        email: attendeeEmail,
        notes: notes || "Booked via AI agent",
      },
    };

    const bookUrl = new URL(
      "/api/booking-calendar/book",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    );

    const response = await fetch(bookUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error("Agent book error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

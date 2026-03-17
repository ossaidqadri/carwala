import { NextRequest, NextResponse } from "next/server";
import { validateAgentRequest } from "@/lib/agent/auth";

export async function POST(request: NextRequest) {
  const auth = validateAgentRequest(request);
  if (!auth.valid) return auth.response!;

  try {
    const { bookingUid, start, reason } = await request.json();

    if (!bookingUid || !start) {
      return NextResponse.json(
        { error: "Missing required fields: bookingUid, start" },
        { status: 400 }
      );
    }

    const rescheduleUrl = new URL(
      "/api/booking-calendar/reschedule",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    );

    const response = await fetch(rescheduleUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingUid,
        start,
        reschedulingReason: reason || "Rescheduled via AI agent",
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error("Agent reschedule error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

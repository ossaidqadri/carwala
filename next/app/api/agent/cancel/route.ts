import { NextRequest, NextResponse } from "next/server";
import { validateAgentRequest } from "@/lib/agent/auth";

export async function POST(request: NextRequest) {
  const auth = validateAgentRequest(request);
  if (!auth.valid) return auth.response!;

  try {
    const { bookingUid, reason } = await request.json();

    if (!bookingUid) {
      return NextResponse.json({ error: "Missing required field: bookingUid" }, { status: 400 });
    }

    const cancelUrl = new URL(
      "/api/booking-calendar/cancel",
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    );

    const response = await fetch(cancelUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingUid,
        cancellationReason: reason || "Cancelled via AI agent",
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error("Agent cancel error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

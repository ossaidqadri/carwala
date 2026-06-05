import { NextRequest, NextResponse } from "next/server";
import { validateAgentRequest } from "@/lib/agent/auth";

export async function GET(request: NextRequest) {
  const auth = validateAgentRequest(request);
  if (!auth.valid) return auth.response!;

  const { searchParams } = new URL(request.url);
  const eventTypeId = searchParams.get("eventTypeId");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  if (!eventTypeId || !dateFrom || !dateTo) {
    return NextResponse.json(
      { error: "Missing required parameters: eventTypeId, dateFrom, dateTo" },
      { status: 400 }
    );
  }

  // Proxy to existing slots route
  const slotsUrl = new URL(
    `/api/booking-calendar/slots?eventTypeId=${eventTypeId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  );

  const response = await fetch(slotsUrl.toString());
  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}

import type { APIRoute } from "astro";
import { applyRateLimit } from "@lib/booking-calendar/utils/rate-limiting";

export const prerender = false;

const CALCOM_API_VERSION = "2026-02-25";

export const POST: APIRoute = async ({ request }) => {
  try {
    await applyRateLimit(request);

    const body = await request.json();
    const { bookingUid, start, reschedulingReason } = body;

    if (!bookingUid || !start) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: bookingUid, start" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiUrl = import.meta.env.CALCOM_API_URL;
    const apiKey = import.meta.env.CALCOM_API_KEY;

    const calUrl = `${apiUrl}/v2/bookings/${bookingUid}/reschedule`;

    const reschedulePayload: Record<string, string> = { start };
    if (reschedulingReason) {
      reschedulePayload.reschedulingReason = reschedulingReason;
    }

    const response = await fetch(calUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Calcom-Api-Version": CALCOM_API_VERSION,
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(reschedulePayload),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
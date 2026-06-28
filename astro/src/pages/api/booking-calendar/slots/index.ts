import type { APIRoute } from "astro";

export const prerender = false;

const CALCOM_API_VERSION = "2024-09-04";
const JSON_HEADERS = { "Content-Type": "application/json" };
const SLOT_CACHE_HEADERS = {
  ...JSON_HEADERS,
  "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
};
const NO_STORE_JSON_HEADERS = {
  ...JSON_HEADERS,
  "Cache-Control": "no-store",
};

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const eventTypeId = url.searchParams.get("eventTypeId");
    const start = url.searchParams.get("dateFrom");
    const end = url.searchParams.get("dateTo");

    if (!eventTypeId || !start || !end) {
      return new Response(
        JSON.stringify({ error: "Missing required query params: eventTypeId, dateFrom, dateTo" }),
        { status: 400, headers: NO_STORE_JSON_HEADERS }
      );
    }

    const apiUrl = import.meta.env.CALCOM_API_URL;
    const apiKey = import.meta.env.CALCOM_API_KEY;

    const calUrl = `${apiUrl}/v2/slots?eventTypeId=${eventTypeId}&start=${start}&end=${end}`;

    const response = await fetch(calUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "cal-api-version": CALCOM_API_VERSION,
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: NO_STORE_JSON_HEADERS,
      });
    }

    const slots = data?.data ?? {};
    return new Response(JSON.stringify(slots), {
      status: 200,
      headers: SLOT_CACHE_HEADERS,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: NO_STORE_JSON_HEADERS,
    });
  }
};

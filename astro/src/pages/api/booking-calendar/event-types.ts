import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  if (!import.meta.env.CALCOM_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Cal.com API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const apiUrl = `${import.meta.env.CALCOM_API_URL}/event-types`;

    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.CALCOM_API_KEY}`,
        'cal-api-version': '2024-06-14',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cal.com Event Types API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
      });
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch event types from Cal.com',
          status: response.status,
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching Cal.com event types:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
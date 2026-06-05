import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const eventTypeId = url.searchParams.get('eventTypeId');
  const dateFrom = url.searchParams.get('dateFrom');
  const dateTo = url.searchParams.get('dateTo');

  if (!eventTypeId || !dateFrom || !dateTo) {
    return new Response(
      JSON.stringify({ error: 'Missing required parameters: eventTypeId, dateFrom, dateTo' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!import.meta.env.CALCOM_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Cal.com API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const startTime = new Date(dateFrom + 'T00:00:00.000Z').toISOString();
    const endTime = new Date(dateTo + 'T23:59:59.999Z').toISOString();

    const apiUrl = new URL(`${import.meta.env.CALCOM_API_URL}/slots`);
    apiUrl.searchParams.set('eventTypeId', eventTypeId);
    apiUrl.searchParams.set('start', startTime);
    apiUrl.searchParams.set('end', endTime);

    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.CALCOM_API_KEY}`,
        'cal-api-version': '2024-09-04',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cal.com v2 Slots API error:', {
        status: response.status,
        statusText: response.statusText,
        eventTypeId,
        errorData: errorData,
      });
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch available slots from Cal.com',
          status: response.status,
          details: errorData,
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const responseData = await response.json();

    if (responseData.status === 'success') {
      return new Response(JSON.stringify(responseData.data), {
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.error('Cal.com v2 API returned non-success status:', responseData);
      return new Response(
        JSON.stringify({ error: 'Cal.com API returned error status', details: responseData }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error fetching Cal.com slots:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
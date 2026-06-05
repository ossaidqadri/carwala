import type { APIRoute } from 'astro';
import { applyRateLimit } from '../../../lib/booking-calendar/utils/rate-limiting';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const rateLimitCheck = await applyRateLimit('cal-cancel');
  if (!rateLimitCheck.allowed) {
    return (
      rateLimitCheck.response ||
      new Response(
        JSON.stringify({ error: 'Too many cancellation requests. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    );
  }

  if (!import.meta.env.CALCOM_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Cal.com API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!import.meta.env.CALCOM_API_URL) {
    return new Response(
      JSON.stringify({ error: 'Cal.com API URL not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const cancelData = await request.json();

    if (!cancelData.bookingUid) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: bookingUid' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const calcomCancelData = {
      cancellationReason: cancelData.cancellationReason || 'User requested cancellation',
    };

    const apiUrl = `${import.meta.env.CALCOM_API_URL}/bookings/${cancelData.bookingUid}/cancel`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.CALCOM_API_KEY}`,
        'cal-api-version': '2024-08-13',
      },
      body: JSON.stringify(calcomCancelData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cal.com cancel error:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        requestData: calcomCancelData,
      });
      return new Response(
        JSON.stringify({
          error: 'Failed to cancel booking with Cal.com',
          details: errorData,
          status: response.status,
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error canceling Cal.com booking:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
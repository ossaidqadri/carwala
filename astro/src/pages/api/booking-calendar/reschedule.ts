import type { APIRoute } from 'astro';
import { applyRateLimit } from '../../../lib/booking-calendar/utils/rate-limiting';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const rateLimitCheck = await applyRateLimit('cal-reschedule');
  if (!rateLimitCheck.allowed) {
    return (
      rateLimitCheck.response ||
      new Response(
        JSON.stringify({ error: 'Too many reschedule requests. Please try again later.' }),
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
    const rescheduleData = await request.json();

    if (!rescheduleData.bookingUid || !rescheduleData.start) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: bookingUid and start time' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const calcomRescheduleData = {
      start: rescheduleData.start,
      rescheduledBy: rescheduleData.rescheduledBy || 'User',
      reschedulingReason: rescheduleData.reschedulingReason || 'User requested reschedule',
    };

    const apiUrl = `${import.meta.env.CALCOM_API_URL}/bookings/${rescheduleData.bookingUid}/reschedule`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.CALCOM_API_KEY}`,
        'cal-api-version': '2024-08-13',
      },
      body: JSON.stringify(calcomRescheduleData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cal.com reschedule error:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        requestData: calcomRescheduleData,
      });
      return new Response(
        JSON.stringify({
          error: 'Failed to reschedule booking with Cal.com',
          details: errorData,
          status: response.status,
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error rescheduling Cal.com booking:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
import type { APIRoute } from 'astro';
import { applyRateLimit } from '../../../lib/booking-calendar/utils/rate-limiting';

interface BookingRequestV2 {
  start: string;
  attendee: {
    name: string;
    email: string;
    timeZone: string;
    language?: string;
  };
  eventTypeId: number;
  metadata?: Record<string, string | number | boolean>;
  guests?: string[];
  bookingFieldsResponses?: Record<string, string | string[]>;
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const rateLimitCheck = await applyRateLimit('cal-booking');
  if (!rateLimitCheck.allowed) {
    return (
      rateLimitCheck.response ||
      new Response(
        JSON.stringify({ error: 'Too many booking requests. Please try again later.' }),
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
    const bookingData = await request.json();

    if (!bookingData.eventTypeId || !bookingData.start || !bookingData.attendee) {
      return new Response(
        JSON.stringify({ error: 'Missing required booking data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const eventTypeId = parseInt(bookingData.eventTypeId);
    if (isNaN(eventTypeId) || eventTypeId <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid eventTypeId: must be a valid positive number' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const notes = String(bookingData.metadata?.notes || 'No additional notes provided');

    const calcomBookingData: BookingRequestV2 = {
      start: bookingData.start,
      attendee: {
        name: bookingData.attendee.name,
        email: bookingData.attendee.email,
        timeZone: bookingData.attendee.timeZone,
        language: 'en',
      },
      eventTypeId,
      bookingFieldsResponses: {
        name: bookingData.attendee.name,
        email: bookingData.attendee.email,
        notes,
        'discovery-method': bookingData.metadata?.referralSource,
      },
      ...(bookingData.guests && bookingData.guests.length > 0 && { guests: bookingData.guests }),
    };

    const apiUrl = `${import.meta.env.CALCOM_API_URL}/bookings`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.CALCOM_API_KEY}`,
        'cal-api-version': '2024-08-13',
      },
      body: JSON.stringify(calcomBookingData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cal.com booking error:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData,
        requestData: calcomBookingData,
      });
      return new Response(
        JSON.stringify({
          error: 'Failed to create booking with Cal.com',
          details: errorData,
          status: response.status,
        }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error creating Cal.com booking:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
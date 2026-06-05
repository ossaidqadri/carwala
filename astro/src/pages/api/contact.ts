import type { APIRoute } from 'astro';
import { contactSchema, sanitizeContactInput } from '@car-wala/schemas';
import { appendToSheet, sendEmail } from '../../lib/contact-handlers';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);

  if (!body) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: 'Validation failed', details: parsed.error.flatten() }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const sanitized = sanitizeContactInput(parsed.data);

  try {
    await Promise.all([
      appendToSheet(sanitized),
      sendEmail(sanitized),
    ]);

    return new Response(
      JSON.stringify({ message: 'Form submitted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
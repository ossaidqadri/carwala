import { z } from 'zod';

/**
 * Contact form input schema (Zod 4 syntax).
 *
 * Top-level string-format validators (`z.email()`) replace the Zod 3
 * `z.string().email()` form. The `{ error: ... }` param also replaces
 * Zod 3's `{ message: ... }` for custom error messages.
 */
export const contactSchema = z.object({
  name: z.string().min(2, { error: 'Name must be at least 2 characters' }),
  email: z.email({ error: 'Please enter a valid email address' }),
  phone: z.string().min(1, { error: 'Phone number is required' }),
  service: z.string().min(1, { error: 'Service selection is required' }),
  message: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Sanitize a validated contact input. The schema's `safeParse` only
 * checks structure; this strips XSS-relevant characters and trims
 * values to fixed max-lengths before they reach the Sheets API and
 * the email body.
 */
export function sanitizeContactInput(input: ContactInput) {
  const sanitize = (s: string) =>
    s
      .replace(/[<>]/g, '') // strip angle brackets
      .replace(/javascript:/gi, '') // strip javascript: protocol
      .replace(/on\w+=/gi, '') // strip inline event handlers (onclick=, onerror=, ...)
      .trim();

  return {
    name: sanitize(input.name).slice(0, 100),
    email: sanitize(input.email).slice(0, 254),
    phone: input.phone.replace(/[^0-9+\-\s()]/g, '').slice(0, 20),
    service: sanitize(input.service).slice(0, 50),
    message: sanitize(input.message ?? '').slice(0, 2000),
  };
}
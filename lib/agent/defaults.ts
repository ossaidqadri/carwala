export const AGENT_DEFAULTS = {
  timezone: "Asia/Karachi",
  language: "en",
} as const;

/**
 * Voice callers don't provide emails. Cal.com requires one.
 * Generate a traceable placeholder from their phone number.
 */
export function generateEmailFromPhone(phone: string): string {
  const sanitized = phone.replace(/[^0-9]/g, "");
  return `wa-${sanitized}@carwala.booking`;
}

/**
 * Map service names (as spoken by customers) to eventTypeIds.
 * Handles Urdu/English/mixed variations.
 */
export function resolveEventTypeId(serviceName: string): string | null {
  const normalized = serviceName.toLowerCase().trim();

  const map: Record<string, string | undefined> = {
    silver: process.env.NEXT_PUBLIC_CALCOM_EVENT_TYPE_ID,
    gold: process.env.NEXT_PUBLIC_CALCOM_GOLD_EVENT_TYPE_ID,
    platinum: process.env.NEXT_PUBLIC_CALCOM_PLATINUM_EVENT_TYPE_ID,
    detailed: process.env.NEXT_PUBLIC_CALCOM_DETAILED_EVENT_TYPE_ID,
    "deep detail": process.env.NEXT_PUBLIC_CALCOM_DETAILED_EVENT_TYPE_ID,
    "deep detailing": process.env.NEXT_PUBLIC_CALCOM_DETAILED_EVENT_TYPE_ID,
  };

  return map[normalized] ?? null;
}

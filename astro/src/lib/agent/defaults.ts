export const AGENT_DEFAULTS = {
  timezone: "Asia/Karachi",
  language: "en",
} as const;

export function generateEmailFromPhone(phone: string): string {
  const sanitized = phone.replace(/[^0-9]/g, "");
  return `wa-${sanitized}@carwala.booking`;
}

export function resolveEventTypeId(serviceName: string): string | null {
  const normalized = serviceName.toLowerCase().trim();

  const map: Record<string, string | undefined> = {
    silver: import.meta.env.NEXT_PUBLIC_CALCOM_EVENT_TYPE_ID,
    gold: import.meta.env.NEXT_PUBLIC_CALCOM_GOLD_EVENT_TYPE_ID,
    platinum: import.meta.env.NEXT_PUBLIC_CALCOM_PLATINUM_EVENT_TYPE_ID,
    detailed: import.meta.env.NEXT_PUBLIC_CALCOM_DETAILED_EVENT_TYPE_ID,
    "deep detail": import.meta.env.NEXT_PUBLIC_CALCOM_DETAILED_EVENT_TYPE_ID,
    "deep detailing": import.meta.env.NEXT_PUBLIC_CALCOM_DETAILED_EVENT_TYPE_ID,
  };

  return map[normalized] ?? null;
}
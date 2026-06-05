// Simple validation schema without Zod to avoid Zod 4 / @hookform/resolvers conflict
export interface BookingFormData {
  name: string;
  email: string;
  notes: string;
  guests?: string[];
  referralSource?: "google" | "twitter" | "instagram" | "facebook";
}

export const referralOptions = [
  { value: "google", label: "Google" },
  { value: "twitter", label: "Twitter" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
] as const;

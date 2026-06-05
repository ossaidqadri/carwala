import { useMutation } from "@tanstack/react-query";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message?: string;
}

async function submitContact(data: ContactFormData) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export function useContactSubmit() {
  return useMutation({
    mutationFn: submitContact,
  });
}
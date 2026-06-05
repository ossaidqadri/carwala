import { useState, useCallback } from "react";
import type { CalcomSlot } from "@/types/booking";
import { getLocalDateString, getSlotLocalDate } from "@/lib/booking-calendar/utils/date-utils";

export interface MonthSlots {
  [date: string]: { start: string; attendees?: number; bookingUid?: string }[];
}

export interface UseCalendarSlotsResult {
  monthSlots: MonthSlots;
  availableSlots: CalcomSlot[];
  loading: boolean;
  fetchMonthSlots: (currentDate: Date) => Promise<void>;
  fetchSlots: (date: Date) => Promise<void>;
}

const convertCalcomSlot = (calcomSlot: {
  start: string;
  attendees?: number;
  bookingUid?: string;
}): CalcomSlot => {
  return {
    time: calcomSlot.start,
    attendees: calcomSlot.attendees || 0,
    bookingUid: calcomSlot.bookingUid,
  };
};

export const useCalendarSlots = (
  eventTypeId: string,
  enabled: boolean = true
): UseCalendarSlotsResult => {
  const [monthSlots, setMonthSlots] = useState<MonthSlots>({});
  const [availableSlots, setAvailableSlots] = useState<CalcomSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMonthSlots = useCallback(
    async (currentDate: Date) => {
      if (!eventTypeId || !enabled) return;

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const startDate = new Date(firstDay);
      startDate.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7));

      const endDate = new Date(lastDay);
      endDate.setDate(lastDay.getDate() + (6 - ((lastDay.getDay() + 6) % 7)));

      try {
        const dateFrom = startDate.toISOString().split("T")[0];
        const dateTo = endDate.toISOString().split("T")[0];

        const response = await fetch(
          `/api/booking-calendar/slots?eventTypeId=${eventTypeId}&dateFrom=${dateFrom}&dateTo=${dateTo}`
        );

        if (response.ok) {
          const data = await response.json();

          if (data && typeof data === "object") {
            setMonthSlots(data);
          }
        } else {
          console.error("Failed to fetch month slots:", response.status);
          setMonthSlots({});
        }
      } catch (error) {
        console.error("Error fetching month slots:", error);
        setMonthSlots({});
      }
    },
    [eventTypeId, enabled]
  );

  const fetchSlots = useCallback(
    async (date: Date) => {
      if (!eventTypeId || !enabled) return;

      setLoading(true);
      try {
        const selectedLocalDateStr = getLocalDateString(date);

        const slotsForDate: CalcomSlot[] = [];

        Object.entries(monthSlots).forEach(([slotDate, slots]) => {
          if (slots && slots.length > 0) {
            slots.forEach((slot) => {
              const slotLocalDate = getSlotLocalDate(slot.start);
              if (slotLocalDate === selectedLocalDateStr) {
                slotsForDate.push(convertCalcomSlot(slot));
              }
            });
          }
        });

        if (slotsForDate.length > 0) {
          slotsForDate.sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
          );
          setAvailableSlots(slotsForDate);
          setLoading(false);
          return;
        }

        const dayBefore = new Date(date);
        dayBefore.setDate(date.getDate() - 1);
        const dayAfter = new Date(date);
        dayAfter.setDate(date.getDate() + 1);

        const dateFrom = dayBefore.toISOString().split("T")[0];
        const dateTo = dayAfter.toISOString().split("T")[0];

        const response = await fetch(
          `/api/booking-calendar/slots?eventTypeId=${eventTypeId}&dateFrom=${dateFrom}&dateTo=${dateTo}`
        );

        if (response.ok) {
          const data = await response.json();

          const slotsArray: CalcomSlot[] = [];
          if (data && typeof data === "object") {
            Object.entries(data).forEach(([slotDate, slots]) => {
              if (Array.isArray(slots)) {
                slots.forEach(
                  (slot: {
                    start: string;
                    attendees?: number;
                    bookingUid?: string;
                  }) => {
                    const slotLocalDate = getSlotLocalDate(slot.start);
                    if (slotLocalDate === selectedLocalDateStr) {
                      slotsArray.push(convertCalcomSlot(slot));
                    }
                  }
                );
              }
            });
          }

          slotsArray.sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
          );
          setAvailableSlots(slotsArray);
        } else {
          setAvailableSlots([]);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    },
    [eventTypeId, enabled, monthSlots]
  );

  return {
    monthSlots,
    availableSlots,
    loading,
    fetchMonthSlots,
    fetchSlots,
  };
};

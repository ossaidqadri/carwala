"use client";

import { useState, useEffect } from "react";
import { CalendarGrid } from "./calendar-grid";
import { TimeSlotsPanel } from "./time-slots-panel";
import { useCalendarSlots } from "@/lib/booking-calendar/hooks/use-calendar-slots";
import { useIntersectionObserver } from "@/lib/booking-calendar/hooks/use-intersection-observer";
import type { ServiceOption } from "./booking-widget";

interface CalendarProps {
  eventTypeId: string;
  onSlotSelect: (slot: string) => void;
  title?: string;
  description?: string;
  showHeader?: boolean;
  userTimezone: string;
  onTimezoneChange: (timezone: string) => void;
  services?: ServiceOption[];
  onServiceChange?: (service: ServiceOption) => void;
  initialServiceId?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  eventTypeId,
  onSlotSelect,
  title = "Select a Date & Time",
  description = "Choose your preferred appointment time for car detailing",
  showHeader,
  userTimezone,
  onTimezoneChange,
  services,
  onServiceChange,
  initialServiceId,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("12h");
  const [activeServiceId, setActiveServiceId] = useState<string>(
    initialServiceId || services?.[0]?.id || ""
  );

  const activeEventTypeId =
    services?.find((s) => s.id === activeServiceId)?.eventTypeId || eventTypeId;

  const [calendarRef, isIntersecting, hasIntersected] = useIntersectionObserver(
    {
      rootMargin: "500px",
      triggerOnce: true,
    }
  );

  const { monthSlots, availableSlots, loading, fetchMonthSlots, fetchSlots } =
    useCalendarSlots(activeEventTypeId, hasIntersected);

  const autoSelectToday = () => {
    if (!selectedDate) {
      const today = new Date();
      setSelectedDate(today);
      fetchSlots(today);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    fetchSlots(date);
  };

  const handleServiceChange = (service: ServiceOption) => {
    setActiveServiceId(service.id);
    setSelectedDate(null);
    onServiceChange?.(service);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  useEffect(() => {
    if (hasIntersected) {
      fetchMonthSlots(currentDate);
    }
  }, [
    hasIntersected,
    currentDate.getFullYear(),
    currentDate.getMonth(),
    activeEventTypeId,
    fetchMonthSlots,
  ]);

  useEffect(() => {
    if (Object.keys(monthSlots).length > 0) {
      autoSelectToday();
    }
  }, [monthSlots]);

  useEffect(() => {
    if (userTimezone) {
      fetchMonthSlots(currentDate);
      if (selectedDate) {
        fetchSlots(selectedDate);
      }
    }
  }, [userTimezone]);

  return (
    <div
      ref={calendarRef}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow"
    >
      {(showHeader || (services && services.length > 0)) && (
        <div className="border-b border-border p-4 sm:p-6">
          {showHeader && (
            <div className="text-center">
              <h1 className="mb-1 text-lg font-bold text-foreground sm:text-2xl">
                {title}
              </h1>
              {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
              )}
            </div>
          )}

          {services && services.length > 0 && (
            <div className={`flex flex-wrap gap-1.5 justify-center sm:gap-2 ${showHeader ? "mt-3 sm:mt-4" : ""}`}>
              {services.map((service) => {
                const isActive = service.id === activeServiceId;
                return (
                  <button
                    key={service.id}
                    onClick={() => handleServiceChange(service)}
                    className={`
                      inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium
                      sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm
                      transition-all duration-200
                      ${isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}
                  >
                    {service.name}
                    {service.duration && (
                      <span
                        className={`text-xs ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                      >
                        · {service.duration}m
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        <CalendarGrid
          currentDate={currentDate}
          selectedDate={selectedDate}
          monthSlots={monthSlots}
          onDateSelect={handleDateSelect}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />

        <TimeSlotsPanel
          selectedDate={selectedDate}
          availableSlots={availableSlots}
          loading={loading}
          timeFormat={timeFormat}
          onTimeFormatChange={setTimeFormat}
          userTimezone={userTimezone}
          onTimezoneChange={onTimezoneChange}
          onSlotSelect={onSlotSelect}
        />
      </div>
    </div>
  );
};

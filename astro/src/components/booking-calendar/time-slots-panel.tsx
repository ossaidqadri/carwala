"use client";

import React from "react";
import type { CalcomSlot } from "@/types/booking";
import { TimezoneSelector } from "./timezone-selector";
import { TimeSlotButton } from "./time-slot-button";

interface TimeSlotsPanelProps {
  selectedDate: Date | null;
  availableSlots: CalcomSlot[];
  loading: boolean;
  timeFormat: "12h" | "24h";
  onTimeFormatChange: (format: "12h" | "24h") => void;
  userTimezone: string;
  onTimezoneChange: (timezone: string) => void;
  onSlotSelect: (slotTime: string) => void;
}

export const TimeSlotsPanel: React.FC<TimeSlotsPanelProps> = ({
  selectedDate,
  availableSlots,
  loading,
  timeFormat,
  onTimeFormatChange,
  userTimezone,
  onTimezoneChange,
  onSlotSelect,
}) => {
  const formatSelectedDate = (date: Date | null) => {
    if (!date) return "Select a date";

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;
    }

    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full border-t border-border lg:w-72 lg:border-t-0 lg:border-l">
      <div className="p-4 sm:p-6">
        {userTimezone && (
          <TimezoneSelector
            selectedTimezone={userTimezone}
            onTimezoneChange={onTimezoneChange}
          />
        )}

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            {formatSelectedDate(selectedDate)}
          </h3>
          <div className="flex overflow-hidden rounded-md border border-border bg-secondary">
            <button
              onClick={() => onTimeFormatChange("12h")}
              className={`px-2 py-1 text-xs font-medium transition-colors ${timeFormat === "12h"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}>
              12h
            </button>
            <button
              onClick={() => onTimeFormatChange("24h")}
              className={`px-2 py-1 text-xs font-medium transition-colors ${timeFormat === "24h"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}>
              24h
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="scrollbar-thin scrollbar-track-muted scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground max-h-64 overflow-y-auto px-4 pb-4 sm:max-h-96 sm:px-6">
          <div className="space-y-2">
            {!selectedDate ? (
              <p className="text-sm text-muted-foreground">
                Please select a date to see available times
              </p>
            ) : loading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-9 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            ) : availableSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No available times for this date
              </p>
            ) : (
              availableSlots.map((slot) => (
                <TimeSlotButton
                  key={slot.time}
                  slot={slot}
                  timeFormat={timeFormat}
                  timezone={userTimezone}
                  onSlotSelect={onSlotSelect}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

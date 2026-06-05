"use client";

import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Mail,
  ExternalLink,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CalcomBookingResponse } from "@/types/booking";

interface BookingSuccessProps {
  booking: CalcomBookingResponse;
  userTimezone: string;
  onReschedule: () => void;
  onCancel: () => void;
  onNewBooking: () => void;
  isRescheduled: boolean;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({
  booking,
  userTimezone,
  onReschedule,
  onCancel,
  onNewBooking,
  isRescheduled,
}) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString);
      return {
        dateStr: "Invalid Date",
        timeStr: "Invalid Time",
      };
    }

    const dateStr = date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: userTimezone,
    });
    const timeStr = date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: userTimezone,
    });
    return { dateStr, timeStr };
  };

  const { dateStr, timeStr } = formatDateTime(booking.start);
  const attendee = booking.attendees?.[0];

  const generateCalendarLinks = () => {
    const startDate = new Date(booking.start);
    const endDate = new Date(booking.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("Invalid date values:", {
        start: booking.start,
        end: booking.end,
      });
      return {
        google: "#",
        outlook: "#",
        apple: "#",
      };
    }

    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const title = encodeURIComponent(booking.title || "Meeting");
    const startFormatted = formatDateForCalendar(startDate);
    const endFormatted = formatDateForCalendar(endDate);

    const vcalendarContent = `BEGIN:VCALENDAR
      VERSION:2.0
      BEGIN:VEVENT
      DTSTART:${startFormatted}
      DTEND:${endFormatted}
      SUMMARY:${booking.title || "Meeting"}
      END:VEVENT
      END:VCALENDAR`;

    return {
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}`,
      outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}`,
      apple: `data:text/calendar;charset=utf8,${encodeURIComponent(
        vcalendarContent
      )}`,
    };
  };

  const calendarLinks = generateCalendarLinks();

  return (
    <div className="bg-card rounded-2xl border border-border shadow-xl">
      <div className="p-4 text-center sm:p-6">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-500/10 p-4">
            <CheckCircle className="h-10 w-10 text-green-400 sm:h-12 sm:w-12" />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
          {isRescheduled ? "Appointment Rescheduled!" : "Appointment Confirmed!"}
        </h2>
        <p className="mb-6 text-sm text-muted-foreground sm:mb-8">
          You&apos;ll receive a confirmation email with your appointment details shortly.
        </p>

        {/* Appointment Details Card */}
        <div className="mb-6 rounded-xl border border-border bg-muted/50 p-4 text-left sm:mb-8 sm:p-6">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            {booking.title || "Appointment Details"}
          </h3>

          <div className="space-y-3 text-sm">
            {/* Date & Time */}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-blue-400" />
              <div className="text-left">
                <p className="text-foreground">{dateStr}</p>
                <p className="text-muted-foreground">{timeStr}</p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-blue-400" />
              <p className="text-foreground">
                {booking.duration ||
                  Math.round(
                    (new Date(booking.end).getTime() -
                      new Date(booking.start).getTime()) /
                    (1000 * 60)
                  )}{" "}
                minutes
              </p>
            </div>

            {/* Attendee */}
            {attendee && (
              <>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-blue-400" />
                  <p className="text-foreground">{attendee.name}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <p className="text-foreground">{attendee.email}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Add to Calendar */}
        <div className="mb-6">
          <h4 className="mb-3 text-sm font-medium text-muted-foreground">
            Add to Calendar
          </h4>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={calendarLinks.google}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-muted px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent">
              Google
              <ExternalLink className="h-3 w-3" />
            </a>

            <a
              href={calendarLinks.outlook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border bg-muted px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent">
              Outlook
              <ExternalLink className="h-3 w-3" />
            </a>

            <a
              href={calendarLinks.apple}
              download={`${booking.title || "appointment"}.ics`}
              className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border bg-muted px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent">
              Apple
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* Primary Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onReschedule}
              variant='outline'
              className="flex flex-1 items-center justify-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reschedule
            </Button>
            <Button
              onClick={onCancel}
              variant='outline'
              className="flex flex-1 items-center justify-center gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>

          {/* Book Another Appointment */}
          <Button onClick={onNewBooking} className="w-full" size='lg'>
            Book Another Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

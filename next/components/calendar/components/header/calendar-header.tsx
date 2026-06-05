"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Columns, Grid3x3, List, Grid2x2, CalendarRange } from "lucide-react";

import { Button } from "@/components/ui/button";

import { UserSelect } from "@/components/calendar/components/header/user-select";
import { TodayButton } from "@/components/calendar/components/header/today-button";
import { DateNavigator } from "@/components/calendar/components/header/date-navigator";

import type { IEvent } from "@/components/calendar/interfaces";
import type { TCalendarView } from "@/components/calendar/types";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
}

export function CalendarHeader({ view, events }: IProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleViewChange = (newView: TCalendarView) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", newView);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 border-b p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between lg:p-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <TodayButton />
        <DateNavigator view={view} events={events} />
      </div>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center overflow-x-auto pb-2 sm:w-auto sm:overflow-x-visible sm:pb-0">
          <div className="flex flex-nowrap gap-1 sm:gap-0">
            <Button
              aria-label="View by day"
              size="sm"
              variant={view === "day" ? "default" : "outline"}
              className="h-9 w-9 flex-shrink-0 p-0 sm:h-10 sm:w-10"
              onClick={() => handleViewChange("day")}
            >
              <List className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
            </Button>

            <Button
              aria-label="View by week"
              size="sm"
              variant={view === "week" ? "default" : "outline"}
              className="h-9 w-9 flex-shrink-0 p-0 sm:h-10 sm:w-10"
              onClick={() => handleViewChange("week")}
            >
              <Columns className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
            </Button>

            <Button
              aria-label="View by month"
              size="sm"
              variant={view === "month" ? "default" : "outline"}
              className="h-9 w-9 flex-shrink-0 p-0 sm:h-10 sm:w-10"
              onClick={() => handleViewChange("month")}
            >
              <Grid2x2 className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
            </Button>

            <Button
              aria-label="View by year"
              size="sm"
              variant={view === "year" ? "default" : "outline"}
              className="h-9 w-9 flex-shrink-0 p-0 sm:h-10 sm:w-10"
              onClick={() => handleViewChange("year")}
            >
              <Grid3x3 className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
            </Button>

            <Button
              aria-label="View by agenda"
              size="sm"
              variant={view === "agenda" ? "default" : "outline"}
              className="h-9 w-9 flex-shrink-0 p-0 sm:h-10 sm:w-10"
              onClick={() => handleViewChange("agenda")}
            >
              <CalendarRange className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
            </Button>
          </div>
        </div>

        <div className="flex-shrink-0">
          <UserSelect />
        </div>
      </div>
    </div>
  );
}

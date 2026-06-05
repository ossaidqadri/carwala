interface TimezoneOption {
  value: string;
  label: string;
  region: string;
}

let hasLoggedManualOffsetWarning = false;

const calculateOffsetManually = (timezone: string, date: Date): string => {
  try {
    if (!hasLoggedManualOffsetWarning) {
      console.warn(
        'Timezone offset calculation: Falling back to manual calculation due to limited Intl.DateTimeFormat support'
      );
      hasLoggedManualOffsetWarning = true;
    }

    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const targetTime = new Date(
      date.toLocaleString('en-US', { timeZone: timezone })
    );
    const offsetMinutes = (utc - targetTime.getTime()) / 60000;

    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes <= 0 ? '+' : '-';

    return `GMT${sign}${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  } catch {
    return '';
  }
};

export const getTimezoneOffset = (timezone: string, date = new Date()) => {
  try {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find((part) => part.type === 'timeZoneName');

    if (offsetPart?.value) {
      return offsetPart.value;
    }
  } catch {
  }

  try {
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'longOffset',
    });
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find((part) => part.type === 'timeZoneName');

    if (offsetPart?.value) {
      return offsetPart.value;
    }
  } catch {
  }

  return calculateOffsetManually(timezone, date);
};

export const getRegionFromTimezone = (timezone: string): string => {
  if (timezone === 'UTC') return 'UTC';

  const parts = timezone.split('/');
  if (parts.length < 2) return 'Other';

  const continent = parts[0];
  const regionMap: Record<string, string> = {
    America: 'Americas',
    Europe: 'Europe',
    Asia: 'Asia',
    Africa: 'Africa',
    Australia: 'Oceania',
    Pacific: 'Oceania',
    Indian: 'Indian Ocean',
    Atlantic: 'Atlantic',
    Antarctica: 'Antarctica',
  };

  return regionMap[continent] || 'Other';
};

const getTimezoneOffsetMinutes = (timezone: string): number => {
  try {
    const date = new Date();
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const local = new Date(utc + 0);
    const target = new Date(
      local.toLocaleString('en-US', { timeZone: timezone })
    );
    return (utc - target.getTime()) / 60000;
  } catch {
    return 0;
  }
};

export const getTimezoneDisplayName = (timezone: string): string => {
  try {
    const city = timezone.split('/').pop()?.replace(/_/g, ' ') || timezone;
    const offset = getTimezoneOffset(timezone);
    return `${city} (${offset})`;
  } catch {
    return timezone;
  }
};

const sortTimezones = (timezones: TimezoneOption[]): TimezoneOption[] => {
  const timezonesWithOffsets = timezones.map((tz) => ({
    ...tz,
    offsetMinutes: getTimezoneOffsetMinutes(tz.value),
  }));

  return timezonesWithOffsets
    .sort((a, b) => {
      if (a.offsetMinutes !== b.offsetMinutes) {
        return a.offsetMinutes - b.offsetMinutes;
      }

      return a.label.localeCompare(b.label);
    })
    .map(({ offsetMinutes, ...tz }) => tz);
};

export const getAvailableTimezones = (): TimezoneOption[] => {
  try {
    if (
      'supportedValuesOf' in Intl &&
      typeof Intl.supportedValuesOf === 'function'
    ) {
      const timezones = Intl.supportedValuesOf('timeZone');
      const filteredTimezones = timezones
        .filter((tz) => {
          return (
            !tz.includes('SystemV') &&
            !tz.includes('Etc/GMT') &&
            (tz.includes('/') || tz === 'UTC') &&
            !tz.startsWith('US/') &&
            !tz.startsWith('Canada/')
          );
        })
        .map((timezone) => ({
          value: timezone,
          label: getTimezoneDisplayName(timezone),
          region: getRegionFromTimezone(timezone),
        }));

      return sortTimezones(filteredTimezones);
    }
  } catch (error) {
    console.warn('Failed to get supported timezones:', error);
  }

  const commonTimezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Toronto',
    'America/Vancouver',
    'America/Sao_Paulo',
    'America/Mexico_City',
    'Europe/London',
    'Europe/Berlin',
    'Europe/Paris',
    'Europe/Rome',
    'Europe/Madrid',
    'Europe/Amsterdam',
    'Europe/Stockholm',
    'Europe/Zurich',
    'Europe/Moscow',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Hong_Kong',
    'Asia/Singapore',
    'Asia/Seoul',
    'Asia/Mumbai',
    'Asia/Karachi',
    'Asia/Bangkok',
    'Asia/Jakarta',
    'Australia/Sydney',
    'Australia/Melbourne',
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Pacific/Auckland',
    'UTC',
  ];

  const mappedTimezones = commonTimezones.map((timezone) => ({
    value: timezone,
    label: getTimezoneDisplayName(timezone),
    region: getRegionFromTimezone(timezone),
  }));

  return sortTimezones(mappedTimezones);
};

export type { TimezoneOption };

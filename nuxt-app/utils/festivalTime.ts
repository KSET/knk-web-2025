// Festival dates are authored in local time but stored as UTC, and day grouping
// runs at prerender time in whatever zone the build container happens to use.
// These read the parts in festival time so the output does not depend on it.
export const FESTIVAL_TIME_ZONE = 'Europe/Zagreb'

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: FESTIVAL_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  weekday: 'short',
})

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

export interface FestivalDateParts {
  year: number
  month: number // 1-12, unlike Date#getMonth
  day: number
  weekday: number // 0-6, matching Date#getDay
}

export const festivalDateParts = (date: Date): FestivalDateParts => {
  const parts = partsFormatter.formatToParts(date)
  const value = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? ''

  return {
    year: Number(value('year')),
    month: Number(value('month')),
    day: Number(value('day')),
    weekday: WEEKDAY_INDEX[value('weekday')] ?? 0,
  }
}

// Stable per-calendar-day key in festival time.
export const festivalDateKey = (date: Date): string => {
  const { year, month, day } = festivalDateParts(date)
  return `${year}-${month}-${day}`
}

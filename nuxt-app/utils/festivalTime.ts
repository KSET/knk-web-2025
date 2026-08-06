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
  month: number
  day: number
  weekday: number
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

export const festivalDateKey = (date: Date): string => {
  const { year, month, day } = festivalDateParts(date)
  return `${year}-${month}-${day}`
}

export const festivalDateKeyToISO = (key: string): string | null => {
  const [year, month, day] = key.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day, 12))

  return isNaN(date.getTime()) ? null : date.toISOString()
}

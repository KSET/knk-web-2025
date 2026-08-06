import type { Workshop, WorkshopTimeslot } from '~/types/Workshop'
import { FESTIVAL_TIME_ZONE, festivalDateKey } from '~/utils/festivalTime'

export const NIGHT_CUTOFF_HOUR = 4

const DAY_MS = 24 * 60 * 60 * 1000

const hourFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: FESTIVAL_TIME_ZONE,
  hour: 'numeric',
  hour12: false,
})

const isValidDate = (iso?: string) => !!iso && !isNaN(new Date(iso).getTime())

const festivalHour = (date: Date) => Number(hourFormatter.format(date)) % 24

export function workshopTimeslots(workshop: Workshop): WorkshopTimeslot[] {
  const slots = (workshop.timeslots ?? []).filter((slot) =>
    isValidDate(slot?.start),
  )

  const raw: WorkshopTimeslot[] = slots.length
    ? slots
    : isValidDate(workshop.timeline?.start)
      ? [workshop.timeline!]
      : []

  return raw
    .map((slot) => ({
      start: slot.start,
      end:
        isValidDate(slot.end) && new Date(slot.end!) > new Date(slot.start)
          ? slot.end
          : undefined,
    }))
    .sort((a, b) => timeslotSortKey(a.start) - timeslotSortKey(b.start))
}

export function isLateNight(start: string): boolean {
  return festivalHour(new Date(start)) < NIGHT_CUTOFF_HOUR
}

export function timeslotDayKey(start: string): string {
  const d = new Date(start)
  return festivalDateKey(
    isLateNight(start) ? new Date(d.getTime() - DAY_MS) : d,
  )
}

export function timeslotSortKey(start: string): number {
  const t = new Date(start).getTime()
  return isLateNight(start) ? t + DAY_MS : t
}

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Workshop, type WorkshopTimeslot } from '~/types/Workshop'
import { useSanity, useState } from '#imports'
import { festivalDateKeyToISO } from '~/utils/festivalTime'
import {
  timeslotDayKey,
  timeslotSortKey,
  workshopTimeslots,
} from '~/composables/useWorkshopTimeslots'
import groq from 'groq'

export interface WorkshopOccurrence {
  workshop: Workshop
  slot: WorkshopTimeslot
}

export interface WorkshopDayGroup {
  date: string
  occurrences: WorkshopOccurrence[]
}

export const useWorkshopsStore = defineStore('workshops', () => {
  const all = ref<Workshop[]>([])
  const days = ref<WorkshopDayGroup[]>([])

  const loading = ref(false)
  const error = ref<Error | null>(null)

  let inFlight: Promise<void> | null = null

  const fetchWorkshops = async () => {
    const cached = useState<Workshop[] | null>('workshops-payload', () => null)

    if (cached.value) {
      applyWorkshops(cached.value)
      return
    }

    if (inFlight) return inFlight

    loading.value = true
    error.value = null

    const query = groq`*[_type == "workshop"] | order(orderRank asc){
      ...,
      "okvirUrl": okvir.asset->url
    }`

    inFlight = (async () => {
      try {
        const workshops = await fetchWithRetry(query)

        cached.value = workshops
        applyWorkshops(workshops)
      } catch (err: any) {
        error.value = err
        if (import.meta.server) throw err
      } finally {
        loading.value = false
        inFlight = null
      }
    })()

    return inFlight
  }

  const fetchWithRetry = async (query: string) => {
    const sanity = useSanity()
    const attempts = import.meta.server ? 3 : 1
    let lastErr: unknown

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        return await sanity.fetch<Workshop[]>(query)
      } catch (err) {
        lastErr = err
        if (attempt < attempts) {
          await new Promise((r) => setTimeout(r, attempt * 500))
        }
      }
    }

    throw lastErr
  }

  const applyWorkshops = (workshops: Workshop[]) => {
    all.value = workshops ?? []

    const grouped = new Map<string, WorkshopOccurrence[]>()

    for (const workshop of workshops ?? []) {
      const slots = workshopTimeslots(workshop)

      if (!slots.length && (workshop.timeslots?.length || workshop.timeline)) {
        console.warn('Workshop has no usable date:', workshop.name)
      }

      for (const slot of slots) {
        const dateKey = timeslotDayKey(slot.start)

        if (!grouped.has(dateKey)) grouped.set(dateKey, [])
        grouped.get(dateKey)!.push({ workshop, slot })
      }
    }

    days.value = [...grouped.entries()]
      .flatMap(([dateKey, occurrences]) => {
        const date = festivalDateKeyToISO(dateKey)

        if (!date) {
          console.warn('Invalid date key:', dateKey)
          return []
        }

        return [
          {
            date,
            occurrences: [...occurrences].sort(
              (a, b) =>
                timeslotSortKey(a.slot.start) - timeslotSortKey(b.slot.start),
            ),
          },
        ]
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  return {
    all,
    days,
    loading,
    error,
    fetchWorkshops,
  }
})

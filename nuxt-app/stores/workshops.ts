import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Workshop } from '~/types/Workshop'
import { useSanity, useState } from '#imports'
import { festivalDateKey } from '~/utils/festivalTime'
import groq from 'groq'

export interface WorkshopDayGroup {
  date: string
  workshops: Workshop[]
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
        // Prerender must fail loudly rather than ship an empty schedule.
        if (import.meta.server) throw err
      } finally {
        loading.value = false
        inFlight = null
      }
    })()

    return inFlight
  }

  // A transient Sanity blip would otherwise fail `nuxt generate` (failOnError)
  // and block the whole deploy, so give the CDN a couple of chances at build time.
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

    const grouped = new Map<string, WorkshopDayGroup>()

    for (const workshop of workshops ?? []) {
      if (!workshop.timeline?.start) continue

      const start = new Date(workshop.timeline.start)

      if (isNaN(start.getTime())) {
        console.warn('Invalid date:', workshop.timeline.start)
        continue
      }

      const dateKey = festivalDateKey(start)

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, { date: workshop.timeline.start, workshops: [] })
      }
      grouped.get(dateKey)!.workshops.push(workshop)
    }

    days.value = [...grouped.values()]
      .map((day) => ({
        // The day label only needs a date, but sorting needs the earliest start.
        date: day.workshops.reduce(
          (earliest, w) =>
            new Date(w.timeline!.start) < new Date(earliest)
              ? w.timeline!.start
              : earliest,
          day.date,
        ),
        // orderRank is authoring order; a timetable has to read chronologically.
        workshops: [...day.workshops].sort(
          (a, b) =>
            new Date(a.timeline!.start).getTime() -
            new Date(b.timeline!.start).getTime(),
        ),
      }))
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

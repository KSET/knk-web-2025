import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Artist } from '~/types/Artist'
import { useSanityQuery } from '#imports'
import groq from 'groq'

interface DayGroup {
  date: string
  artists: Artist[]
}

export const useArtistsStore = defineStore('artists', () => {
  const all = ref<Artist[]>([])

  const day1 = ref<DayGroup>({ date: '', artists: [] })
  const day2 = ref<DayGroup>({ date: '', artists: [] })
  const day3 = ref<DayGroup>({ date: '', artists: [] })

  const loading = ref(false)
  const error = ref<Error | null>(null)

  const fetchArtists = async () => {
    loading.value = true
    error.value = null

    const query = groq`*[_type == "artist"] | order(orderRank asc)`

    try {
      const { data } = await useSanityQuery<Artist[]>(query)

      all.value = data.value ?? []

      const grouped = new Map<string, { start: string; artists: Artist[] }>()

      for (const artist of data.value ?? []) {
        if (!artist.timeline?.start) continue

        const start = new Date(artist.timeline.start)

        if (isNaN(start.getTime())) {
          console.warn('Invalid date:', artist.timeline.start)
          continue
        }

        // Group by local calendar day (matches the Schedule view, which
        // also reads local date parts). Sanity stores starts in UTC, so a
        // 22:00Z slot is actually past midnight local in summer (UTC+2).
        const dateKey = `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}`

        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, { start: artist.timeline.start, artists: [] })
        }
        grouped.get(dateKey)!.artists.push(artist)
      }

      const sorted = [...grouped.values()].sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      )

      day1.value = sorted[0]
        ? { date: sorted[0].start, artists: sorted[0].artists }
        : { date: '', artists: [] }

      day2.value = sorted[1]
        ? { date: sorted[1].start, artists: sorted[1].artists }
        : { date: '', artists: [] }

      day3.value = sorted[2]
        ? { date: sorted[2].start, artists: sorted[2].artists }
        : { date: '', artists: [] }
    } catch (err: any) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    all,
    day1,
    day2,
    day3,
    loading,
    error,
    fetchArtists,
  }
})

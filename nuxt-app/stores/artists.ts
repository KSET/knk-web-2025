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

      const grouped = new Map<string, Artist[]>()

      for (const artist of data.value ?? []) {
        const start = new Date(artist.timeline!.start)

        if (isNaN(start.getTime())) {
          console.warn('Invalid date:', artist.timeline!.start)
          continue
        }

        const dateKey = start.toISOString().split('T')[0]

        if (!grouped.has(dateKey)) grouped.set(dateKey, [])
        grouped.get(dateKey)!.push(artist)
      }

      console.log('Grouped map:', [...grouped.entries()])

      const sorted = [...grouped.entries()].sort(([a], [b]) =>
        a.localeCompare(b),
      )

      day1.value = sorted[0]
        ? { date: sorted[0][0], artists: sorted[0][1] }
        : { date: '', artists: [] }

      day2.value = sorted[1]
        ? { date: sorted[1][0], artists: sorted[1][1] }
        : { date: '', artists: [] }

      day3.value = sorted[2]
        ? { date: sorted[2][0], artists: sorted[2][1] }
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

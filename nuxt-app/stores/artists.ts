import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Artist } from '~/types/Artist'
import { useSanity, useState } from '#imports'
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

  let inFlight: Promise<void> | null = null

  const fetchArtists = async () => {
    const cached = useState<Artist[] | null>('artists-payload', () => null)

    if (cached.value) {
      applyArtists(cached.value)
      return
    }

    if (inFlight) return inFlight

    loading.value = true
    error.value = null

    const query = groq`*[_type == "artist"] | order(orderRank asc)`

    inFlight = (async () => {
      try {
        const artists = await fetchWithRetry(query)

        cached.value = artists
        applyArtists(artists)
      } catch (err: any) {
        error.value = err
        // Prerender must fail loudly rather than ship an empty lineup.
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
        return await sanity.fetch<Artist[]>(query)
      } catch (err) {
        lastErr = err
        if (attempt < attempts) {
          await new Promise((r) => setTimeout(r, attempt * 500))
        }
      }
    }

    throw lastErr
  }

  const applyArtists = (artists: Artist[]) => {
    all.value = artists ?? []

    const grouped = new Map<string, { start: string; artists: Artist[] }>()

    for (const artist of artists ?? []) {
      if (!artist.timeline?.start) continue

      const start = new Date(artist.timeline.start)

      if (isNaN(start.getTime())) {
        console.warn('Invalid date:', artist.timeline.start)
        continue
      }

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

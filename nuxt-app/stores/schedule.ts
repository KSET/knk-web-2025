import { defineStore } from 'pinia'
import groq from 'groq'
import { useSanityQuery } from '#imports'
import type { Workshop } from '~/types/Workshop'
import type { Artist } from '~/types/Artist'

type EventSource = 'workshop' | 'artist'

interface ScheduleEvent {
  title: string
  start: string
  end: string
  backgroundColor?: string
  borderColor?: string
  textColor?: string
  classNames?: string[]
  source: EventSource
}

export const useScheduleStore = defineStore('schedule', () => {
  const workshops = ref<Workshop[]>([])
  const artists = ref<Artist[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const eventsWorkshops = computed<ScheduleEvent[]>(() =>
    (workshops.value ?? [])
      .filter((w) => w.timeline?.start && w.timeline?.end)
      .map((w) => {
        const color =
          w.location === 'vanjska'
            ? '#A565BD'
            : w.location === 'škola'
              ? '#F3BB64'
              : '#76C6D2'
        return {
          title: w.name + (w.location ? ` (${w.location})` : ''),
          start: w.timeline!.start,
          end: w.timeline!.end,
          backgroundColor: color,
          borderColor: color,
          textColor: '#fff',
          classNames:
            w.location === 'vanjska' ? ['event-vanjska'] : ['event-skola'],
          source: 'workshop',
        }
      }),
  )

  const eventsArtists = computed<ScheduleEvent[]>(() =>
    (artists.value ?? [])
      .filter((a) => a.timeline?.start && a.timeline?.end)
      .map((a) => {
        const name = (a as any).name ?? (a as any).title ?? 'Artist'
        const color = '#D46558'
        return {
          title: name,
          start: a.timeline!.start,
          end: a.timeline!.end,
          backgroundColor: color,
          borderColor: color,
          textColor: '#fff',
          classNames: ['event-artist'],
          source: 'artist',
        }
      }),
  )

  const eventsAll = computed<ScheduleEvent[]>(() => [
    ...eventsWorkshops.value,
    ...eventsArtists.value,
  ])

  const fetchAll = async () => {
    loading.value = true
    error.value = null

    const workshopQuery = groq`*[_type == "workshop"] | order(location asc, orderRank asc)`
    const artistQuery = groq`*[_type == "artist" && defined(timeline.start) && defined(timeline.end)] | order(timeline.start asc)`

    try {
      const [wRes, aRes] = await Promise.all([
        useSanityQuery<Workshop[]>(workshopQuery),
        useSanityQuery<Artist[]>(artistQuery),
      ])
      workshops.value = wRes.data.value ?? []
      artists.value = aRes.data.value ?? []
    } catch (err: any) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  return {
    workshops,
    artists,
    eventsWorkshops,
    eventsArtists,
    eventsAll,
    loading,
    error,
    fetchAll,
  }
})

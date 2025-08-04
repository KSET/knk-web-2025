import { defineStore } from 'pinia'
import groq from 'groq'
import { useSanityQuery } from '#imports'
import type { Workshop } from '~/types/Workshop'
import type { Artist } from '~/types/Artist'

interface ScheduleEvent {
    title: string
    start: string
    end: string
    backgroundColor?: string
    borderColor?: string
    textColor?: string
    classNames?: string[]
}

export const useScheduleStore = defineStore('schedule', () => {
    const workshops = ref<Workshop[]>([])
    const events = ref<ScheduleEvent[]>([])
    const loading = ref(false)
    const error = ref<Error | null>(null)


    const artists = ref<Artist[]>([])

    const fetchSchedule = async () => {
        loading.value = true
        error.value = null

        const workshopQuery = groq`*[_type == "workshop"] | order(location asc, orderRank asc)`
        const artistQuery = groq`*[_type == "artist" && defined(timeline.start) && defined(timeline.end)]`

        try {
            const [workshopRes, artistRes] = await Promise.all([
                useSanityQuery<Workshop[]>(workshopQuery),
                useSanityQuery<Artist[]>(artistQuery),
            ])

            workshops.value = workshopRes.data.value ?? []
            artists.value = artistRes.data.value ?? []

            const workshopEvents: ScheduleEvent[] = workshops.value
                .filter((w) => w.timeline?.start && w.timeline?.end)
                .map((w) => {
                    const isVanjska = w.location === 'vanjska'
                    const color = isVanjska ? '#dd7d91'
                        : w.location === 'škola' ? '#5c9c9c'
                            : '#999'

                    return {
                        title: w.name + (w.location ? ` (${w.location})` : ''),
                        start: w.timeline!.start,
                        end: w.timeline!.end,
                        backgroundColor: color,
                        borderColor: color,
                        textColor: '#fff',
                        classNames: isVanjska ? ['event-vanjska'] : ['event-skola'],
                        source: 'workshop',
                    }
                })

            const artistEvents: ScheduleEvent[] = artists.value
                .map((a) => ({
                    title: a.name,
                    start: a.timeline!.start,
                    end: a.timeline!.end,
                    backgroundColor: '#D46558',
                    borderColor: '#D46558',
                    textColor: '#fff',
                    classNames: ['event-artist'],
                    source: 'artist',
                }))

            events.value = [...workshopEvents, ...artistEvents]
        } catch (err: any) {
            error.value = err
        } finally {
            loading.value = false
        }
    }


    return {
        workshops,
        events,
        loading,
        error,
        fetchSchedule,
    }
})

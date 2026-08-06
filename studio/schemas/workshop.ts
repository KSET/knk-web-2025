import {defineType, defineField} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default defineType({
  name: 'workshop',
  title: 'Workshop',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'name',
      title: 'Name (HR)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameEn',
      title: 'Name (EN)',
      type: 'string',
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline (single time slot)',
      description:
        'For a workshop that happens once. If it repeats on several days, leave this empty and use Time slots below instead.',
      type: 'object',
      fields: [
        {
          name: 'start',
          title: 'Start Time',
          type: 'datetime',
        },
        {
          name: 'end',
          title: 'End Time',
          type: 'datetime',
          validation: (Rule) =>
            Rule.min(Rule.valueOfField('start')).error('End must be after start'),
        },
      ],
    }),
    defineField({
      name: 'timeslots',
      title: 'Time slots (repeats on multiple days)',
      description:
        'For events like Kvizovi or Kino u kampu that happen more than once. Add one entry per day, with that day’s real times. When this list is not empty it replaces Timeline above. A slot starting after midnight (before 04:00) is listed under the previous evening.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'timeslot',
          title: 'Time slot',
          fields: [
            {
              name: 'start',
              title: 'Start Time',
              type: 'datetime',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'end',
              title: 'End Time',
              type: 'datetime',
              validation: (Rule) =>
                Rule.min(Rule.valueOfField('start')).error(
                  'End must be after start',
                ),
            },
          ],
          preview: {
            select: {start: 'start', end: 'end'},
            prepare({start, end}: {start?: string; end?: string}) {
              const startDate = start ? new Date(start) : null

              if (!startDate) return {title: 'No start time'}

              const day = startDate.toLocaleDateString('hr-HR', {
                weekday: 'short',
                day: 'numeric',
                month: 'numeric',
              })
              const startTime = startDate.toLocaleTimeString('hr-HR', {
                hour: '2-digit',
                minute: '2-digit',
              })
              const endTime = end
                ? new Date(end).toLocaleTimeString('hr-HR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '?'

              return {title: `${day} ${startTime} – ${endTime}`}
            },
          },
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      options: {
        list: [
          {title: 'Škola', value: 'škola'},
          {title: 'Kamp', value: 'kamp'},
          {title: 'Vanjska', value: 'vanjska'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'popupColor',
      title: 'Popup Color',
      description: 'Background color of the workshop popup.',
      type: 'string',
      options: {
        list: [
          {title: 'Orange', value: 'var(--knk-orange)'},
          {title: 'Blue', value: 'var(--knk-blue)'},
          {title: 'Light Blue', value: 'var(--knk-lightblue)'},
          {title: 'Yellow', value: 'var(--knk-yellow)'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'var(--knk-orange)',
    }),
    defineField({
      name: 'imageLarge',
      title: 'Header Image (Large) (11-4)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imageSmall',
      title: 'Header Image (Small) (7-5)',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'okvir',
      title: 'Okvir (Frame SVG)',
      description: 'Custom SVG frame overlaid on the card image for this workshop.',
      type: 'file',
      options: {accept: 'image/svg+xml'},
    }),
    defineField({name: 'descriptionShort', title: 'Short Description (HR)', type: 'text', rows: 3}),
    defineField({name: 'descriptionShortEn', title: 'Short Description (EN)', type: 'text', rows: 3}),
    defineField({name: 'descriptionLong', title: 'Long Description (HR)', type: 'text', rows: 8}),
    defineField({name: 'descriptionLongEn', title: 'Long Description (EN)', type: 'text', rows: 8}),

    orderRankField({type: 'workshop'}),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'imageLarge',
      start: 'timeline.start',
      end: 'timeline.end',
      timeslots: 'timeslots',
      location: 'location',
    },
    prepare({title, media, start, end, timeslots, location}) {
      const withLocation = (text: string) =>
        location ? `${location} – ${text}` : text

      const dayOnly = (date: Date) =>
        date.toLocaleDateString('hr-HR', {day: 'numeric', month: 'numeric'})

      const slots: {start?: string}[] = Array.isArray(timeslots) ? timeslots : []
      const slotDates = slots
        .map((slot) => (slot?.start ? new Date(slot.start) : null))
        .filter((date): date is Date => !!date && !isNaN(date.getTime()))
        .sort((a, b) => a.getTime() - b.getTime())

      if (slotDates.length) {
        const span =
          slotDates.length > 1
            ? `${dayOnly(slotDates[0])} – ${dayOnly(slotDates[slotDates.length - 1])}`
            : dayOnly(slotDates[0])

        return {
          title,
          media,
          subtitle: withLocation(`${slotDates.length}× · ${span}`),
        }
      }

      const startDate = start ? new Date(start) : null
      const endDate = end ? new Date(end) : null

      const startStr = startDate
        ? startDate.toLocaleString('hr-HR', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'No start time'

      const endsAnotherDay =
        !!startDate &&
        !!endDate &&
        startDate.toDateString() !== endDate.toDateString()

      const endStr = endDate
        ? endDate.toLocaleString(
            'hr-HR',
            endsAnotherDay
              ? {
                  day: 'numeric',
                  month: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }
              : {hour: '2-digit', minute: '2-digit'},
          )
        : '?'

      return {
        title,
        media,
        subtitle: withLocation(`${startStr} – ${endStr}`),
      }
    },
  },
})

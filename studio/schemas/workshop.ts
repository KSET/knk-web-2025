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
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'timeline',
      title: 'Timeline',
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
    defineField({name: 'descriptionShort', title: 'Short Description', type: 'text', rows: 3}),
    defineField({name: 'descriptionLong', title: 'Long Description', type: 'text', rows: 8}),

    orderRankField({type: 'workshop'}),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'imageLarge',
      start: 'timeline.start',
      end: 'timeline.end',
      location: 'location',
    },
    prepare({title, media, start, end, location}) {
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

      const endStr = endDate
        ? endDate.toLocaleTimeString('hr-HR', {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '?'

      const subtitleText = location
        ? `${location} – ${startStr} – ${endStr}`
        : `${startStr} – ${endStr}`

      return {
        title,
        media,
        subtitle: subtitleText,
      }
    },
  },
})

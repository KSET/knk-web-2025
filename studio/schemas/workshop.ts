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
      name: 'datetime',
      title: 'Date and Time',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      options: {
        list: [
          {title: 'Škola', value: 'škola'},
          {title: 'Kamp', value: 'kamp'},
          {title: 'Vanjske', value: 'vanjska'},
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
      subtitle: 'datetime',
      location: 'location',
    },
    prepare({title, media, subtitle, location}) {
      const date = subtitle ? new Date(subtitle).toLocaleString() : 'No date'
      return {
        title,
        media,
        subtitle: location ? `${location} – ${date}` : date,
      }
    },
  },
})

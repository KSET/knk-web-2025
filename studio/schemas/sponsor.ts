import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default defineType({
  name: 'sponsor',
  title: 'Sponsor',
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
      name: 'link',
      title: 'link',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'barIndex',
      title: 'Bar Index',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    orderRankField({type: 'sponsor'}),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      barIndex: 'barIndex',
      link: 'link',
    },
    prepare(selection) {
      const {title, media, barIndex, link} = selection
      return {
        title,
        media,
        subtitle: `${barIndex != null ? barIndex : ''}${barIndex != null && link ? ' - ' : ''}${link || ''}`,
      }
    },
  },
})

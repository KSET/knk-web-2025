import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

const locationOptions = [
  {title: 'Top Bar', value: 'top-bar'},
  {title: 'Bottom Bar', value: 'bottom-bar'},
]

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
      name: 'location',
      title: 'Location',
      type: 'string',
      options: {
        list: locationOptions,
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    orderRankField({type: 'sponsor'}),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      location: 'location',
      link: 'link',
    },
    prepare(selection) {
      const {title, media, location, link} = selection
      const locationTitle =
        locationOptions.find((opt) => opt.value === location)?.title || location || ''
      return {
        title,
        media,
        subtitle: `${locationTitle}${locationTitle && link ? ' - ' : ''}${link || ''}`,
      }
    },
  },
})

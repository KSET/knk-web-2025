import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      name: 'description',
      title: 'Description-short',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'bio',
      title: 'Bio-long',
      type: 'text',
      rows: 8,
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
      name: 'linkSocial',
      title: 'Link Social',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'linkMusic',
      title: 'Link Music',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'orderRank',
      title: 'orderRank',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
})

import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default defineType({
  name: 'ticket',
  title: 'Ticket',
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
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaColor',
      title: 'CTA Color',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    orderRankField({type: 'ticket'}),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
    },
  },
})

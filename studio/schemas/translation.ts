import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'translation',
  title: 'Translation',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Text (HR)',
      type: 'blockContent',
    }),
    defineField({
      name: 'textEn',
      title: 'Text (EN)',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'key',
    },
  },
})

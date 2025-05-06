import type { PortableTextBlock } from '@sanity/types'

export interface Translation {
  _id: string
  _type: 'translation'
  _createdAt: string
  key: string
  text: PortableTextBlock[]
}

import type { ImageAsset } from '@sanity/types'

export interface Workshop {
  _id: string
  _type: 'workshop'
  _createdAt: string
  name: string
  datetime: Date
  location: 'škola' | 'kamp' | 'višednevne' | 'cjelodnevne'
  imageLarge?: ImageAsset
  imageSmall?: ImageAsset
  descriptionShort?: string
  descriptionLong?: string
}

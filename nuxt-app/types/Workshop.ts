import type { ImageAsset } from '@sanity/types'

export interface Workshop {
  _id: string
  _type: 'workshop'
  _createdAt: string
  name: string
  nameEn?: string
  timeline?: {
    start: string
    end: string
  }
  location: 'škola' | 'kamp' | 'vanjska'
  imageLarge?: ImageAsset
  imageSmall?: ImageAsset
  descriptionShort?: string
  descriptionShortEn?: string
  descriptionLong?: string
  descriptionLongEn?: string
}

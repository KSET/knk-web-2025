import type { ImageAsset } from '@sanity/types'

export interface GallerySection {
  _id: string
  _type: 'gallerySection'
  _createdAt: string
  name: string
  year: Number
  description?: string
  type: 'Koncerti' | 'Radionice' | 'Kamp'
  images?: ImageAsset[]
}

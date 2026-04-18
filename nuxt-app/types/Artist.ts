import type { ImageAsset } from '@sanity/types'
import type { Url } from 'url'

export interface Artist {
  _id: string
  _type: 'artist'
  _createdAt: string
  name: string
  description?: string
  descriptionEn?: string
  bio?: string
  bioEn?: string
  image?: ImageAsset
  linkSocial?: Url
  linkMusic?: Url
  timeline?: {
    start: string
    end: string
  }
}

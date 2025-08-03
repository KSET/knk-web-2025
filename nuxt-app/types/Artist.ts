import type { ImageAsset } from '@sanity/types'
import type { Url } from 'url'

export interface Artist {
  _id: string
  _type: 'artist'
  _createdAt: string
  name: string
  description?: string
  bio?: string
  image?: ImageAsset
  linkSocial?: Url
  linkMusic?: Url
  timeline?: {
    start: string
    end: string
  }
}

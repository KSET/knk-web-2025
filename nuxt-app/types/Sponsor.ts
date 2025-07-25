import type { ImageAsset } from '@sanity/types'
import type { Url } from 'url'

export interface Sponsor {
  _id: string
  _type: 'sponsor'
  _createdAt: string
  name: string
  image?: ImageAsset
  link?: Url
}

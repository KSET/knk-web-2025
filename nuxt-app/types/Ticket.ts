import type { ImageAsset } from '@sanity/types'
import type { Url } from 'url'

export interface Ticket {
  _id: string
  _type: 'ticket'
  _createdAt: string
  name: string
  price: number
  backgroundColor: string
  ctaColor: string
}

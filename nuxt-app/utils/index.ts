import imageUrlBuilder from '@sanity/image-url'
import type { Image } from '@sanity/types'

export function formatDate(date: string): string {
  const d = new Date(date)

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0') // months are 0-indexed
  const year = d.getFullYear()

  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')

  return `${day}.${month}.${year}. ${hours}:${minutes}h`
}

export function urlFor(source: Image) {
  const sanity = useSanity()
  const builder = imageUrlBuilder(sanity.client)
  return builder.image(source)
}

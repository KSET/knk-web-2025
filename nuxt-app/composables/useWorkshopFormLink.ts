import type { Translation } from '~/types/Translation'

const getPlainTextLink = (blocks: unknown): string | undefined => {
  if (!Array.isArray(blocks)) return undefined
  const text: string = blocks[0]?.children?.[0]?.text ?? ''
  return text.startsWith('http://') || text.startsWith('https://') ? text : undefined
}

export const useWorkshopFormLink = async () => {
  const query = groq`*[ _type == "translation" && key == "workshopsFormLink"][0]`
  const { data } = await useSanityQuery<Translation | null>(query)
  return computed(() => getPlainTextLink(data.value?.text))
}

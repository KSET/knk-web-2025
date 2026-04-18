export function useLocalizedField() {
  const { locale } = useI18n()

  function lf<T>(hr: T, en: T | undefined): T {
    return locale.value === 'en' && en ? en : hr
  }

  return { lf }
}

export const WORKSHOP_LOCATIONS = ['škola', 'vanjska', 'kamp'] as const

export function useLocationLabel() {
  const { t } = useI18n()

  function locationLabel(location: string): string {
    if (location === 'škola') return t('workshops.school')
    if (location === 'vanjska') return t('workshops.outdoor')
    if (location === 'kamp') return t('workshops.camp')
    return location
  }

  return { locationLabel }
}

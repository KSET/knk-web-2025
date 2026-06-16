const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
const EN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

export function useDayLabel() {
  const { t, locale } = useI18n()

  function formatDayLabel(dateStr: string, dayNumber: number): string {
    if (!dateStr) return ''

    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''

    const weekday = t(`days.${WEEKDAY_KEYS[d.getDay()]}`)

    if (locale.value === 'en') {
      return `${t('schedule.day')} ${dayNumber} - ${EN_MONTHS[d.getMonth()]} ${d.getDate()}`
    }

    return `${t('schedule.day')} ${dayNumber} - ${weekday} ${d.getDate()}.${d.getMonth() + 1}.`
  }

  return { formatDayLabel }
}

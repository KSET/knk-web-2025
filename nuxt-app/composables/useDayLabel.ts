const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
const EN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

export function useDayLabel() {
  const { t, locale } = useI18n()

  function formatDayLabel(dateStr: string): string {
    if (!dateStr) return ''

    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''

    const { month, day, weekday: weekdayIndex } = festivalDateParts(d)
    const weekday = t(`days.${WEEKDAY_KEYS[weekdayIndex]}`)

    if (locale.value === 'en') {
      return `${weekday} ${EN_MONTHS[month - 1]} ${day}`
    }

    return `${weekday} ${day}. ${month}.`
  }

  return { formatDayLabel }
}

const FLAG = 'knk.schedule-301-repaired'
const PATHS = ['/schedule', '/en/schedule']

export default defineNuxtPlugin(() => {
  const repair = () => {
    Promise.allSettled(
      PATHS.map((path) => fetch(path, { cache: 'reload', redirect: 'manual' })),
    ).then((results) => {
      const repaired = results.every(
        (r) => r.status === 'fulfilled' && r.value.ok,
      )
      if (!repaired) return
      try {
        localStorage.setItem(FLAG, '1')
      } catch {
      }
    })
  }

  try {
    if (localStorage.getItem(FLAG)) return
    if ('requestIdleCallback' in window) requestIdleCallback(repair)
    else setTimeout(repair, 2000)
  } catch {
  }
})

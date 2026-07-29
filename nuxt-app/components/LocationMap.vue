<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

interface MapMarker {
  label: string
  lat: number
  lng: number
  // Optional explicit Google Maps URL; falls back to a lat/lng search.
  url?: string
}

const props = defineProps<{
  markers: MapMarker[]
}>()

const mapEl = ref<HTMLElement | null>(null)
let map: any = null

declare global {
  interface Window {
    L?: any
  }
}

const initMap = (): void => {
  const L = window.L
  if (!L || !mapEl.value || map) return

  map = L.map(mapEl.value, { scrollWheelZoom: false })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  const latLngs: [number, number][] = []
  for (const m of props.markers) {
    const marker = L.marker([m.lat, m.lng]).addTo(map)
    marker.bindTooltip(m.label, {
      permanent: true,
      direction: 'top',
      offset: [0, -10],
      className: 'location-map-label',
      interactive: true,
    })

    const gmapsUrl = m.url ?? `https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lng}`
    const openInGmaps = (): void => {
      window.open(gmapsUrl, '_blank', 'noopener,noreferrer')
    }
    marker.on('click', openInGmaps)
    marker.getTooltip()?.on('click', openInGmaps)

    latLngs.push([m.lat, m.lng])
  }

  if (latLngs.length === 1) {
    map.setView(latLngs[0], 15)
  } else if (latLngs.length > 1) {
    map.fitBounds(latLngs, { padding: [60, 60] })
  }
}

// Leaflet is loaded async via CDN - poll briefly until window.L is ready.
const waitForLeaflet = (attempts = 0): void => {
  if (window.L) {
    initMap()
  } else if (attempts < 50) {
    setTimeout(() => waitForLeaflet(attempts + 1), 100)
  }
}

onMounted(() => {
  waitForLeaflet()
})

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div ref="mapEl" class="location-map"></div>
</template>

<style scoped>
.location-map {
  width: 100%;
  height: 450px;
}
</style>

<style>
.location-map-label {
  background: var(--knk-orange, #e8662a);
  color: #fff;
  border: 2px solid #fff;
  border-radius: 0;
  font-family: 'Rokkitt', serif;
  font-weight: 700;
  font-size: var(--text-body);
  padding: 0.15rem 0.6rem;
  box-shadow: 2px 3px 0 rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.location-map-label::before {
  border-top-color: #fff !important;
}
</style>

// plugins/mapbox.client.ts
import mapboxgl from 'mapbox-gl'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  mapboxgl.accessToken = config.public.MAPBOX_ACCESS_TOKEN
  return {
    provide: {
      mapbox: mapboxgl
    }
  }
})
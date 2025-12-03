// composables/useGeojsonSource.ts
import { onMounted, watch } from 'vue'

export function useGeojsonSource(mapRef, sourceId: string, geojsonData) {
  onMounted(() => {
    const map = mapRef.value

    if (!map) return

    map.on('load', () => {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: geojsonData.value || {
            type: 'FeatureCollection',
            features: []
          }
        })
      }

      // Atualiza camada
      map.addLayer({
        id: sourceId,
        type: 'circle',
        source: sourceId,
        paint: {
          'circle-radius': 5,
          'circle-color': '#FF3B30'
        }
      })
    })

    watch(geojsonData, (newData) => {
      if (map.getSource(sourceId)) {
        map.getSource(sourceId).setData(newData)
      }
    })
  })
}
import { useState, useFetch } from '#app'

export function useFcOcc(stateId: string, year: string = '2024', geojson: boolean = false) {
  const key = `fc:occ:${stateId}:${year}:${geojson ? 'geojson' : 'raw'}`
  const data = useState(key, () => null)

  if (!data.value) {
    const { data: fetched, pending, error } = useFetch(`/api/fc-occ`, {
      query: {
        idState: stateId,
        year,
        geojson: geojson ? 'true' : undefined
      }
    })

    watch(fetched, (val) => {
      if (val) data.value = val
    })
  }

  return data
}
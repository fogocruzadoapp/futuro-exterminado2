<script setup>
// Importações e configurações
import 'mapbox-gl/dist/mapbox-gl.css';
const { $mapbox } = useNuxtApp();
const slugify = useSlugify();

// Data e Refs
const mapContainer = ref(null);
const mapInstance = ref(null);

// Props
const props = defineProps({
  estado: {
    type: String,
    required: true,
  },
  cidade: {
    type: String,
  },
  vitimas: {
    type: Array,
    required: true,
  },
  regiao: {
    type: String,
  },
  inicio: {
    type: String,
  },
  imagem: {
    type: String,
    default: '/images/cards/map1.png',
  },
  index: {
    type: Number,
  },
  botaoTexto: {
    type: String,
    default: 'Ver mapa da região',
  },
});

// On Mounted
onMounted(() => {
  const map = new $mapbox.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/hilidio/cm6kxt7oz00fq01rydtkw378h',
    interactive: false,
    attributionControl: false,
  });

  mapInstance.value = map;

  map.on('load', () => {
    // fonte com cluster
    map.addSource('vitimas', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
      cluster: true,
      clusterMaxZoom: 16,
      clusterRadius: 0.5,
      clusterProperties: {
        Dead: ['+', ['case', ['==', ['get', 'situation'], 'Dead'], 1, 0]],
        Wounded: ['+', ['case', ['==', ['get', 'situation'], 'Wounded'], 1, 0]],
      },
    });

    // clusters
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'vitimas',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'case',
          ['all', ['>', ['get', 'Dead'], 0], ['==', ['get', 'Wounded'], 0]],
          '#EC6775',
          ['all', ['>', ['get', 'Wounded'], 0], ['==', ['get', 'Dead'], 0]],
          '#A64DFF',
          '#AAAAAA',
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          7,   10, 9,
          30, 12,
          60, 16
        ],
      },
    });

    // pontos individuais
    map.addLayer({
      id: 'vitimas-points',
      type: 'circle',
      source: 'vitimas',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-radius': 6,
        'circle-color': [
          'case',
          ['==', ['get', 'situation'], 'Dead'],
          '#EC6775',
          ['==', ['get', 'situation'], 'Wounded'],
          '#A64DFF',
          '#AAAAAA',
        ],
      },
    });

    // aplica dados uma única vez
    const features = montarFeatures(props.vitimas || []);
    map.getSource('vitimas')?.setData({
      type: 'FeatureCollection',
      features,
    });
    fitToFeatures(map, features);
  });
});

// Before unmount
onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.remove();
  }
});

// Funções
function montarFeatures(lista) {
  const coordMap = new Map();

  const features = (lista || [])
    .filter((o) => o.latitude && o.longitude)
    .map((o) => {
      const lng = parseFloat(o.longitude);
      const lat = parseFloat(o.latitude);
      const key = `${lng},${lat}`;
      if (!coordMap.has(key)) coordMap.set(key, []);
      coordMap.get(key).push([lng, lat]);

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {
          name: o.name,
          date: o.date,
          situation: o.situation,
          acaoPolicial: o.policeAction,
          balaPerdida: (o.circumstances || '').includes('Bala perdida'),
          age: o.age,
          ageGroup: o.ageGroup,
          genre: o.genre,
          race: o.race,
          place: o.place,
          state: o.state,
          city: o.city,
          neighborhood: o.neighborhood,
          subNeighborhood: o.subNeighborhood,
          locality: o.locality,
        },
      };
    });

  // jitter leve para separar pontos na mesma coordenada
  const magnitude = 0.0002;
  const seenCount = new Map();
  for (const f of features) {
    const [lng, lat] = f.geometry.coordinates;
    const key = `${lng},${lat}`;
    const count = coordMap.get(key)?.length || 0;
    if (count > 1) {
      const i = seenCount.get(key) || 0;
      seenCount.set(key, i + 1);
      const rand = () => (Math.random() - 0.5) * magnitude;
      f.geometry.coordinates = [lng + rand(), lat + rand()];
    }
  }

  return features;
}

function fitToFeatures(m, features) {
  if (!m || !features.length) return;
  const bounds = new $mapbox.LngLatBounds();
  for (const f of features) bounds.extend(f.geometry.coordinates);
  m.fitBounds(bounds, { padding: 10, duration: 0 });
  m.setMinZoom(Math.min(m.getZoom(), 6));
  requestAnimationFrame(() => m.resize())
}
</script>

<template>
  <div
    class="w-full z-10 mb-8 md:mb-0 text-white flex flex-col gap-12 justify-between min-h-[460px]"
  >
    <div>
      <div class="font-bigShoulders font-extrabold text-5xl uppercase">
        {{ cidade }}
      </div>
      <div class="font-bigShouldersRegular text-3xl uppercase mb-2">
        {{ regiao }}
      </div>

      <div class="font-bigShouldersRegular text-3xl uppercase mb-2">
        e Região metropolitana
      </div>
    </div>

    <figure class="w-full h-full relative">
      <div class="-translate-y-1/2 absolute top-0 left-0 w-full h-fit z-20">
        <div class="font-bigShoulders leading-none font-extrabold text-7xl">
          {{ vitimas.length }}
        </div>
        <div>vítimas desde {{ new Date(inicio).getFullYear() }}</div>
      </div>
      <!-- Filter -->
      <div
        class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-900/75 to-slate-900/0 z-10"
      ></div>

      <!-- Image -->
      <div class="w-full h-[304px] overflow-hidden pointer-events-none flex bg-yellow-200 justify-center items-center" ref="mapContainer"></div>

      <!-- SVG Mask Overlay -->
      <div class="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        <!-- Mascara 1-->
        <svg v-if="index==0"
          class="w-full h-full"
          viewBox="0 0 304 270"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M303.992 0V34.999H243.992L303.99 0H164L304 82V0H303.992Z"
            fill="#160f38"
          />
          <path
            d="M304.001 191L222.801 240L304.001 240L304.001 191Z"
            fill="#160f38"
          />
          <path
            d="M152.899 151L21.4072 228H74.0107L0.0107422 270V240.529L0 240.535V151H152.899ZM73 85.9482L0 130V85.9482H73Z"
            fill="#160f38"
          />
        </svg>

        <!-- Mascara 2-->
        <svg v-if="index==1"
          class="w-full h-full"
          viewBox="0 0 304 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none">
          <path d="M0.371429 166L123 240L0.371426 240L0.371429 166Z" fill="#160f38"/>
          <path d="M303.992 0V41.209L234.587 0H136.993L289.154 88.9258H199.892L304 147.486V0H303.992Z" fill="#160f38"/>
        </svg>

        <!-- Mascara 3-->
         <svg v-if="index==2"
            class="w-full h-full"
            viewBox="0 0 304 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none">
            <path d="M0.198776 -6.31979e-06L146.027 88L0.198772 88L0.198776 -6.31979e-06Z" fill="#160f38"/>
            <path d="M145.065 240L263.005 171.074H200.089L304.197 112.514V147.001L304.199 147V240H145.065ZM304.198 196.209H231.198L304.198 238.209V196.209Z" fill="#160f38"/>
        </svg>

        <!-- Mascara 4-->
         <svg v-else
            class="w-full h-full"
            viewBox="0 0 304 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none">
            <path d="M0.000167847 72L119.314 -7.62939e-06L0.000164687 -2.43504e-06L0.000167847 72Z" fill="#160f38"/>
            <path d="M304.313 239.791V198.791L235.26 239.791H151.314L295.814 154.791H234.314L304.314 114.791V239.791H304.313ZM234.908 240L235.26 239.791H304.313V240H234.908Z" fill="#160f38"/>
        </svg>
        
      </div>
      <!-- Button -->
      <div
        class="absolute translate-y-1/2 z-20 bottom-0 left-0 w-full flex justify-center items-center h-fit"
      >
        <NuxtLink :to="{ path: '/mapa', query: { estado: slugify(estado) } }">
          <UiButton>{{ botaoTexto }}</UiButton>
        </NuxtLink>
      </div>
    </figure>
  </div>
</template>

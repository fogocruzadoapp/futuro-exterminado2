<template>
  <section id="map-wrapper" class="relative flex flex-col-reverse md:flex-col w-full md:h-[100dvh] md:overflow-hidden">
    <client-only>
      <!-- Desktop Layout -->
      <div
        class="absolute hidden md:flex top-16 left-8 gap-1 flex-row items-start"
      >
        <!-- Sidebar -->
        <MapSidebar v-if="!isFullscreen" />

        <Filter
          v-if="!isFullscreen"
          :showAside="showAside"
          @close="showAside = false"
        />

        <!-- Btn Filtro Desktop -->
        <ButtonFilter
          v-if="!isFullscreen"
          :showAside="showAside"
          :filtrosAtivos="filtrosAtivos"
          @toggle="showAside = !showAside"
        />
      </div>

      <!-- Filter ( mobile) -->
      <div class="absolute top-16 right-14 z-50 flex md:hidden">
        <Filter :showAside="showAside" @close="showAside = false" />
      </div>

      <!-- Mobile Sidebar with Drag and Drop -->
      <div
        ref="sidebarRef"
        class="md:hidden z-40"
        @click="sidebarOpen = !sidebarOpen"
        @touchstart="handleTouchStart"
        @mousedown="handleMouseDown"
      >
        <!-- Handle/Indicator -->
        <div class="flex justify-center py-2 bg-indigo/60 backdrop-blur-md">
          <div class="w-12 h-1 bg-white/30 rounded-full"></div>
        </div>
        <!-- Sidebar Content -->
        <MapSidebar />
      </div>
      
    </client-only>
    <!-- Map -->
    <client-only>
      <div class="sticky top-0 md:relative flex flex-col w-full h-[75vh] md:h-[100dvh]">
        <div ref="mapContainer" id="map" class="w-full h-full"></div>
      </div>
    </client-only>

    <!-- MapSearch  -->
    <client-only>
      <div
        class="absolute top-16 md:right-8 z-10 px-4 md:px-0 gap-2 md:gap-0 flex justify-between md:justify-end w-full md:w-60 lg:w-80"
      >
        <div class="flex-1 md:w-80">
          <MapSearch :map="mapInstance" :vitimas="vitimasFiltradas" />
        </div>
        <!-- Btn Filtro Mobile -->
        <ButtonFilter
          class="md:hidden flex flex-shrink-0"
          :showAside="showAside"
          :filtrosAtivos="filtrosAtivos"
          @toggle="showAside = !showAside"
        />
      </div>
    </client-only>

    <!-- Map Controller -->
    <client-only>
      <div class="md:flex hidden">
        <MapController
          @zoom-in="handleZoomIn"
          @zoom-out="handleZoomOut"
          @fullscreen="toggleFullscreen"
          :isFullscreen="isFullscreen"
          :disabled="!isMapReady"
        />
      </div>
    </client-only>
  </section>
</template>

<script setup>
// Importações e configurações
import debounce from 'lodash/debounce';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createVNode, render, computed } from 'vue';
import MapTooltip from './Tooltip.vue';
import ButtonFilter from './Filter/Button.vue';
import Filter from './Filter/index.vue';

const route = useRoute();
const router = useRouter();
const slugify = useSlugify();
const { $mapbox } = useNuxtApp();

// Data e Refs
const vitimas = inject('vitimas');
const estadoSelecionado = inject('estadoSelecionado');
const mapContainer = ref(null);
const mapInstance = ref(null);
const mapSourceReady = ref(false);
const showAside = ref(false);
const isFullscreen = ref(false);

// Sidebar mobile drag and drop
const sidebarOpen = ref(false);
const filtros = reactive({
  acaoPolicial: false,
  balaPerdida: false,
  dentroDeCasa: false,
  ano: '',
  situacao: [],
  faixaEtaria: [],
  raca: [],
  genero: [],
});
provide('filtros', filtros);

// Computed

// Total de ocorrências apenas por estado
const vitimasDoEstado = computed(() => {
  if (!estadoSelecionado.value) return [];
  return vitimas.value.filter(
    (o) => slugify(o.state) === estadoSelecionado.value,
  );
});
provide('vitimasDoEstado', vitimasDoEstado);

// Total de ocorrências no ano ativo
const vitimasDoAno = computed(() => {
  return vitimasDoEstado.value.filter((o) => {
    const filtroAno = filtros.ano
      ? new Date(o.date).getFullYear() === Number(filtros.ano)
      : true;
    return filtroAno;
  });
});
provide('vitimasDoAno', vitimasDoAno);

// Total de ocorrências com filtros aplicados
const vitimasFiltradas = computed(() => {
  return vitimasDoEstado.value.filter((o) => {
    const isAcaoPolicial = filtros.acaoPolicial ? o?.policeAction : true;

    const isBalaPerdida = filtros.balaPerdida
      ? o.circumstances.includes('Bala perdida')
      : true;

    const isDentroDeCasa = filtros.dentroDeCasa
      ? o.place.includes('Residência')
      : true;

    const filtroAno = filtros.ano
      ? new Date(o.date).getFullYear() === Number(filtros.ano)
      : true;

    const filtroSituacao =
      filtros.situacao.length === 0 || filtros.situacao.includes(o.situation);

    const filtroEtaria =
      filtros.faixaEtaria.length === 0 ||
      filtros.faixaEtaria.includes(o.ageGroup);

    const filtroRaca =
      filtros.raca.length === 0 || filtros.raca.includes(o.race);

    const mapaGenero = {
      Meninos: ['Homem cis', 'Homem trans'],
      Meninas: ['Mulher cis', 'Mulher trans e travesti'],
      'Não identificado': ['Não identificado'],
    };

    const generosSelecionados = filtros.genero.flatMap(
      (key) => mapaGenero[key] || [],
    );

    const filtroGenero =
      generosSelecionados.length === 0 || generosSelecionados.includes(o.genre);

    return (
      isAcaoPolicial &&
      isBalaPerdida &&
      isDentroDeCasa &&
      filtroAno &&
      filtroSituacao &&
      filtroEtaria &&
      filtroRaca &&
      filtroGenero
    );
  });
});
provide('vitimasFiltradas', vitimasFiltradas);

// Anos disponíveis
const anosDisponiveis = computed(() => {
  const anos = vitimasDoEstado.value
    .map((o) => new Date(o.date).getFullYear())
    .filter(Boolean);
  return [...new Set(anos)].sort((a, b) => b - a);
});
provide('anosDisponiveis', anosDisponiveis);

const isMapReady = ref(false);

// OnMounted
onMounted(async () => {

  await nextTick(() => {
  });

  // Trocar aqui o estilo do mapa
  const map = new $mapbox.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/fogocruzado/cmihu61oy000w01s6gu0ifv9r',
    bounds: [
      [-73.99, -33.75],
      [-32.39, 5.27],
    ],
    minZoom: 2,
    maxZoom: 19,
    projection: 'mercator',
    attributionControl: false,
  });

  mapInstance.value = map;
  isMapReady.value = true;

  map.addControl(
    new $mapbox.NavigationControl({
      showCompass: false,
      showZoom: false,
    }),
  );
  
  map.addControl(
  new $mapbox.AttributionControl({
    compact: true,
    customAttribution: '© Fogo Cruzado',
  }),
  'bottom-left'
)

  map.on('load', () => {
    // Define o estilo do céu
    /* map.setFog({});

      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15
        }
      }); */

    // Adiciona a fonte vazia
    map.addSource('vitimas', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
      cluster: true,
      clusterMaxZoom: 16,
      clusterRadius: 2,
      clusterProperties: {
        Dead: ['+', ['case', ['==', ['get', 'situation'], 'Dead'], 1, 0]],
        Wounded: ['+', ['case', ['==', ['get', 'situation'], 'Wounded'], 1, 0]],
      },
    });

    // Camada dos clusters
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'vitimas',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'case',
          ['all', ['>', ['get', 'Dead'], 0], ['==', ['get', 'Wounded'], 0]],
          '#EC6775', // só mortos

          ['all', ['>', ['get', 'Wounded'], 0], ['==', ['get', 'Dead'], 0]],
          '#A64DFF', // só feridos

          '#AAAAAA', // mistura dos dois
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          10,
          10,
          15,
          30,
          20,
          60,
          30,
        ],
      },
    });

    // Número dentro do cluster
    /* map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'vitimas',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-size': 12
        },
        paint: {
          'text-color': '#fff'
        }
      }) */

    // Adiciona camada de pontos
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

    mapSourceReady.value = true;

    // Carrega os dados iniciais
    atualizarVitimas(estadoSelecionado.value);

    // Expandir cluster ao clicar
    map.on('click', 'clusters', (e) => {
      const clusteredFeatures = map.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      });
      const clusterId = clusteredFeatures[0].properties.cluster_id;
      map
        .getSource('vitimas')
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          map.easeTo({
            center: clusteredFeatures[0].geometry.coordinates,
            zoom,
          });
        });
    });

    // Tooltip
    const tooltip = new $mapbox.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'meu-popup-personalizado',
    });
    // Tooltip para clusters
    map.on('mouseenter', 'clusters', (e) => {
      const feature = e.features[0];
      const clusterId = feature.properties.cluster_id;
      const count = feature.properties.point_count;

      // Pegue até 20 leaves do cluster
      map
        .getSource('vitimas')
        .getClusterLeaves(clusterId, 20, 0, (err, leaves) => {
          if (err) {
            console.error('Erro ao obter leaves do cluster:', err);
            return;
          }

          // Extrair situações
          const situacoes = leaves.map((leaf) => leaf.properties.situation);
          const unicas = [...new Set(situacoes)];

          // Definir cor baseada na situação predominante
          let backgroundColor = '#000000'; // padrão
          if (unicas.length === 1) {
            backgroundColor = unicas[0] === 'Dead' ? '#EC6775' : '#A64DFF';
          } else {
            backgroundColor = '#AAAAAA'; // mistura
          }

          // Renderizar componente Vue
          const container = document.createElement('div');
          const vnode = createVNode(MapTooltip, {
            isCluster: true,
            count,
            situacoes: unicas,
            backgroundColor,
          });
          render(vnode, container);

          tooltip.setLngLat(e.lngLat).setHTML(container.innerHTML).addTo(map);
        });
    });

    map.on('mousemove', 'clusters', (e) => {
      tooltip.setLngLat(e.lngLat);
    });

    map.on('mouseleave', 'clusters', () => {
      tooltip.remove();
    });

    // Tooltip para pontos individuais
    map.on('mouseenter', 'vitimas-points', (e) => {
      const feature = e.features[0];

      // Definir cor baseada na situação
      let backgroundColor = '#000000'; // padrão
      if (feature.properties.situation === 'Dead') {
        backgroundColor = '#EC6775';
      } else if (feature.properties.situation === 'Wounded') {
        backgroundColor = '#A64DFF';
      }

      const container = document.createElement('div');
      const vnode = createVNode(MapTooltip, {
        isCluster: false,
        name: feature.properties.name,
        genre: feature.properties.genre,
        race: feature.properties.race,
        age: feature.properties.age,
        ageGroup: feature.properties.ageGroup,
        situation: feature.properties.situation,
        balaPerdida: feature.properties.balaPerdida,
        dentroDeCasa:
          feature.properties.place &&
          feature.properties.place.includes('Residência'),
        acaoPolicial: feature.properties.acaoPolicial,
        date: feature.properties.date,
        locality: feature.properties.locality,
        subNeighborhood: feature.properties.subNeighborhood,
        neighborhood: feature.properties.neighborhood,
        city: feature.properties.city,
        state: feature.properties.state,
        backgroundColor,
      });
      render(vnode, container);
      tooltip.setLngLat(e.lngLat).setHTML(container.innerHTML).addTo(map);
    });
    map.on('mousemove', 'vitimas-points', (e) => {
      tooltip.setLngLat(e.lngLat);
    });

    map.on('mouseleave', 'vitimas-points', () => {
      tooltip.remove();
    });

    // Estilização de cursor
    ['clusters', 'vitimas-points'].forEach((layer) => {
      map.on(
        'mouseenter',
        layer,
        () => (map.getCanvas().style.cursor = 'pointer'),
      );
      map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''));
    });

    if (route.query.id) {
      centralizarVitima(route.query.id);
    }
  });
});

// onBeforeUnmount
onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.remove();
  }
});

// Watches
watch(
  () => route.query.id,
  (newId) => {
    if (newId) centralizarVitima(newId);
  },
);

watch(
  () => JSON.stringify(filtros),
  () => {
    atualizarVitimasDebounced();
  },
);

watch(estadoSelecionado, () => {
  resetAno();
  resetFilters();
  atualizarVitimasDebounced();
});

// Funções
function atualizarVitimas(estado) {
  estadoSelecionado.value = estado;
  atualizaEstado(estado);
  if (!mapInstance.value || !mapSourceReady.value) return;

  const features = montarFeatures(vitimasFiltradas.value);

  // Atualiza dados no mapa
  mapInstance.value.getSource('vitimas')?.setData({
    type: 'FeatureCollection',
    features,
  });

  // Centraliza no conjunto de pontos visíveis
  if (features.length > 0) {
    const bounds = new $mapbox.LngLatBounds();

    features.forEach((f) => {
      bounds.extend(f.geometry.coordinates);
    });

    mapInstance.value.fitBounds(bounds, {
      padding: 40,
      duration: 1000,
    });
  }
  setTimeout(() => {
    mapInstance.value.setMinZoom(6);
  }, 1000);
}
const atualizarVitimasDebounced = debounce(() => {
  atualizarVitimas(estadoSelecionado.value);
}, 300);

function montarFeatures(lista) {
  const coordMap = new Map();

  // 1. Monta as features
  const features = lista
    .filter((o) => o.latitude && o.longitude)
    .map((o) => {
      const lng = parseFloat(o.longitude);
      const lat = parseFloat(o.latitude);
      const key = `${lng},${lat}`;

      // Adiciona ao map de coordenadas para rastrear duplicadas
      if (!coordMap.has(key)) {
        coordMap.set(key, []);
      }
      coordMap.get(key).push([lng, lat]); // apenas para contar

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: {
          name: o.name,
          date: o.date,
          situation: o.situation,
          acaoPolicial: o.policeAction,
          balaPerdida: o.circumstances.includes('Bala perdida'),
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

  // 2. Aplica jitter leve nos pontos duplicados
  const magnitude = 0.0002;
  const seenCount = new Map();

  for (const feature of features) {
    const [lng, lat] = feature.geometry.coordinates;
    const key = `${lng},${lat}`;
    const count = coordMap.get(key)?.length || 0;

    if (count > 1) {
      // Inicializa contador
      const i = seenCount.get(key) || 0;
      seenCount.set(key, i + 1);

      // Aplica jitter diferente para cada ponto duplicado
      const rand = () => (Math.random() - 0.5) * magnitude;
      feature.geometry.coordinates = [lng + rand(), lat + rand()];
    }
  }

  return features;
}

// Atualiza o estado na URL
function atualizaEstado(e) {
  estadoSelecionado.value = slugify(e);
}

function centralizarVitima(id) {
  const o = vitimas.value.find((o) => o.occurrenceId === id);
  if (!o || !mapInstance.value) return;
  // Fly to com delay
  setTimeout(() => {
    mapInstance.value.flyTo({
      center: [o.longitude, o.latitude],
      zoom: 15,
    });
  }, 1000);
}

function resetFilters() {
  filtros.acaoPolicial = false;
  filtros.balaPerdida = false;
  filtros.dentroDeCasa = false;
  filtros.situacao = [];
  filtros.faixaEtaria = [];
  filtros.raca = [];
  filtros.genero = [];
}

function resetAno() {
  if (
    filtros.ano !== '' &&
    !anosDisponiveis.value.includes(Number(filtros.ano))
  ) {
    filtros.ano = '';
  }
}

// Função para fullscreen customizado
function toggleFullscreen() {
  const el = document.getElementById('map-wrapper');
  if (!el) return;
  if (!document.fullscreenElement) {
    el.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
}

function handleZoomIn() {
  if (mapInstance.value) mapInstance.value.zoomIn();
}
function handleZoomOut() {
  if (mapInstance.value) mapInstance.value.zoomOut();
}

// Computed para contar filtros ativos
const filtrosAtivos = computed(() => {
  let count = 0;
  if (filtros.acaoPolicial) count++;
  if (filtros.balaPerdida) count++;
  if (filtros.dentroDeCasa) count++;
  if (filtros.ano && filtros.ano !== '') count++;
  if (Array.isArray(filtros.situacao) && filtros.situacao.length > 0) count++;
  if (Array.isArray(filtros.faixaEtaria) && filtros.faixaEtaria.length > 0)
    count++;
  if (Array.isArray(filtros.raca) && filtros.raca.length > 0) count++;
  if (Array.isArray(filtros.genero) && filtros.genero.length > 0) count++;
  return count;
});
</script>

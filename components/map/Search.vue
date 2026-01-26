<template>
  <div ref="searchBox" id="searchbar">
    <label for="map-search-input" class="sr-only">
      Buscar localização ou vítima no mapa
    </label>
    <UiInputSearch
      id="map-search-input"
      ref="inputRef"
      v-model="query"
      @input="search"
      @keydown="handleInputKeydown"
      placeholder="Procurar localização ou vítima"
      label="Buscar localização ou vítima no mapa"
      type="text"
      required
      maxlength="50"
      class="w-full border px-2 py-1 backdrop-blur-md"
      aria-autocomplete="list"
      :aria-expanded="
        showSuggestions && (cruzadoMatches.length || apiMatches.length)
      "
      aria-controls="search-results"
      :aria-activedescendant="
        focusedIndex !== -1 ? `search-result-${focusedIndex}` : undefined
      "
    />

    <ul
      id="search-results"
      v-if="showSuggestions && (cruzadoMatches.length || apiMatches.length)"
      class="mt-2 max-h-64 overflow-auto backdrop-blur-md text-sm bg-indigo/20 divide-y-1 divide-violet-light"
      role="listbox"
      aria-label="Resultados da busca"
      aria-live="polite"
      aria-atomic="false"
    >
      <!-- Vitimas -->
      <template v-if="cruzadoMatches.length">
        <li
          class="text-blue-300 text-sm leading-tight font-light px-4 py-3"
          role="presentation"
        >
          Vítimas
        </li>
        <!-- Result Vitimas -->
        <li
          v-for="(res, i) in cruzadoMatches"
          :key="'local-' + i"
          :id="`search-result-${i}`"
          :ref="(el) => setResultRef(el, i)"
          @click="goTo(res)"
          @keydown="handleResultKeydown($event, res, i)"
          @mouseenter="focusedIndex = i"
          role="option"
          :tabindex="focusedIndex === i ? 0 : -1"
          :aria-selected="focusedIndex === i"
          class="cursor-pointer text-white hover:bg-text-yellow-300 py-1.5 font-normal hover:bg-blue-900/80 px-4 hover:text-yellow-300 focus:bg-blue-900/80 focus-visible:outline-2 focus-visible:outline-yellow-300"
          :aria-label="`Vítima: ${res.label}`"
        >
          {{ res.label }}
        </li>
      </template>
        <!-- Localizacao -->
      <template v-if="apiMatches.length">
        <li
          class="text-blue-300 text-sm leading-tight font-light px-4 py-3"
          role="presentation"
        >
          Localização
        </li>
        <!-- Result Localizacao -->
        <li
          v-for="(res, i) in apiMatches"
          :key="'api-' + i"
          :id="`search-result-${cruzadoMatches.length + i}`"
          :ref="(el) => setResultRef(el, cruzadoMatches.length + i)"
          @click="goTo(res)"
          @keydown="handleResultKeydown($event, res, cruzadoMatches.length + i)"
          @mouseenter="focusedIndex = cruzadoMatches.length + i"
          role="option"
          :tabindex="focusedIndex === cruzadoMatches.length + i ? 0 : -1"
          :aria-selected="focusedIndex === cruzadoMatches.length + i"
          class="cursor-pointer text-white hover:bg-text-yellow-300 py-1.5 font-normal hover:bg-blue-900/80 px-4 hover:text-yellow-300 focus:bg-blue-900/80 border-0"
          :aria-label="`Localização: ${res.label}`"
        >
          {{ res.label }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
import UiInputSearch from '../Ui/InputSearch.vue';
import { onClickOutside } from '@vueuse/core';
import { nextTick } from 'vue';

const { $mapbox } = useNuxtApp();
const searchBox = ref(null);
const inputRef = ref(null);
const query = ref('');
const apiMatches = ref([]);
const cruzadoMatches = ref([]);
const showSuggestions = ref(false);
const focusedIndex = ref(-1);
const resultRefs = ref({});

const props = defineProps({
  map: Object,
  vitimas: {
    type: Array,
    default: () => [],
  },
});

// Função para definir refs dos resultados
const setResultRef = (el, index) => {
  if (el) {
    resultRefs.value[index] = el;
  }
};

// Calcular total de resultados
const totalResults = computed(
  () => cruzadoMatches.value.length + apiMatches.value.length,
);

// Obter todos os resultados em ordem
const allResults = computed(() => [
  ...cruzadoMatches.value,
  ...apiMatches.value,
]);

watch(query, () => {
  if (query.value.trim() !== '') {
    search();
    showSuggestions.value = true;
    // Resetar foco quando nova busca é feita
    nextTick(() => {
      focusedIndex.value = -1;
    });
  } else {
    cruzadoMatches.value = [];
    apiMatches.value = [];
    showSuggestions.value = false;
    focusedIndex.value = -1;
  }
});

watch(showSuggestions, (newVal) => {
  if (!newVal) {
    focusedIndex.value = -1;
  }
});

onClickOutside(searchBox, () => {
  showSuggestions.value = false;
  focusedIndex.value = -1;
});

// Handler para teclas no input
const handleInputKeydown = (event) => {
  if (!showSuggestions.value || totalResults.value === 0) {
    if (event.key === 'Escape') {
      showSuggestions.value = false;
      query.value = '';
    }
    return;
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      focusedIndex.value =
        focusedIndex.value < totalResults.value - 1
          ? focusedIndex.value + 1
          : 0;
      // Focar no elemento
      nextTick(() => {
        const element = resultRefs.value[focusedIndex.value];
        if (element) {
          element.focus();
        }
      });
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusedIndex.value =
        focusedIndex.value > 0
          ? focusedIndex.value - 1
          : totalResults.value - 1;
      // Focar no elemento
      nextTick(() => {
        const element = resultRefs.value[focusedIndex.value];
        if (element) {
          element.focus();
        }
      });
      break;
    case 'Escape':
      event.preventDefault();
      showSuggestions.value = false;
      focusedIndex.value = -1;
      const inputElement =
        inputRef.value?.$el?.querySelector('input') || inputRef.value?.$el;
      if (inputElement) {
        inputElement.focus();
      }
      break;
    case 'Enter':
      if (focusedIndex.value >= 0 && allResults.value[focusedIndex.value]) {
        event.preventDefault();
        goTo(allResults.value[focusedIndex.value]);
      }
      break;
  }
};

// Handler para teclas nos resultados
const handleResultKeydown = (event, item, index) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      goTo(item);
      break;
    case 'ArrowDown':
      event.preventDefault();
      focusedIndex.value =
        focusedIndex.value < totalResults.value - 1
          ? focusedIndex.value + 1
          : 0;
      nextTick(() => {
        const element = resultRefs.value[focusedIndex.value];
        if (element) {
          element.focus();
        }
      });
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusedIndex.value =
        focusedIndex.value > 0
          ? focusedIndex.value - 1
          : totalResults.value - 1;
      nextTick(() => {
        const element = resultRefs.value[focusedIndex.value];
        if (element) {
          element.focus();
        }
      });
      break;
    case 'Escape':
      event.preventDefault();
      showSuggestions.value = false;
      focusedIndex.value = -1;
      const inputElement =
        inputRef.value?.$el?.querySelector('input') || inputRef.value?.$el;
      if (inputElement) {
        inputElement.focus();
      }
      break;
    case 'Home':
      event.preventDefault();
      focusedIndex.value = 0;
      nextTick(() => {
        const element = resultRefs.value[0];
        if (element) {
          element.focus();
        }
      });
      break;
    case 'End':
      event.preventDefault();
      focusedIndex.value = totalResults.value - 1;
      nextTick(() => {
        const element = resultRefs.value[focusedIndex.value];
        if (element) {
          element.focus();
        }
      });
      break;
  }
};

const search = async () => {
  apiMatches.value = [];
  cruzadoMatches.value = [];

  // 1. Busca na base do Fogo Cruzado
  if (props.vitimas?.length) {
    cruzadoMatches.value = props.vitimas
      .filter(
        (vitima) =>
          vitima.name &&
          vitima.name.toLowerCase().includes(query.value.toLowerCase()),
      )
      .map((vitima) => ({
        label: vitima.name,
        lat: parseFloat(vitima.latitude),
        lon: parseFloat(vitima.longitude),
      }));
  }
  const center = props.map?.getCenter?.();

  // 2. Busca na API do Mapbox
  const token = $mapbox.accessToken;
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query.value,
    )}.json?access_token=${token}&bbox=-74.0,-34.0,-34.0,5.5` +
      (center ? `&proximity=${center.lng},${center.lat}` : ''),
  );
  const data = await response.json();

  apiMatches.value = data.features.map((f) => ({
    label: f.place_name,
    lat: f.center[1],
    lon: f.center[0],
  }));
};

const goTo = (item) => {
  props.map.flyTo({
    center: [item.lon, item.lat],
    zoom: 18,
  });
  query.value = item.label;
  setTimeout(() => {
    showSuggestions.value = false;
  }, 100);
};
</script>

<style>
#searchbar {
  border: var(--sds-size-stroke-border) solid var(--Azul-600, #4235bc);
  background: rgba(87, 78, 252, 0.2);
  /* Blur/Glass */
  backdrop-filter: blur(calc(var(--sds-size-blur-100) / 2));

  color: var(--Azul-300, #aca6e0);

  /* Single Line/Body Base */
  font-family: var(--sds-typography-body-font-family);
  font-size: var(--sds-typography-body-size-medium);
  font-style: normal;
  font-weight: var(--sds-typography-body-font-weight-regular);
  line-height: 100%; /* 16px */
}
</style>

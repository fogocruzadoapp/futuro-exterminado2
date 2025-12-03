<template>
  <div ref="searchBox" id="searchbar">
    <UiInputSearch
      v-model="query"
      @input="search"
      placeholder="Procurar localização ou vítima"
      type="text"
      required
      maxlength="50"
      class="w-full border px-2 py-1 backdrop-blur-md"
    />

    <ul
      v-if="showSuggestions && (cruzadoMatches.length || apiMatches.length)"
      class="mt-2 max-h-64 overflow-auto backdrop-blur-md text-sm bg-indigo/20 divide-y-1 divide-violet-light"
    >
      <!-- Vitimas -->
      <div>
        <li
          v-if="cruzadoMatches.length"
          class="text-blue-300 text-sm leading-tight font-light px-4 py-3"
        >
          Vítimas
        </li>
        <!-- Result Vitimas -->
        <li
          v-for="(res, i) in cruzadoMatches"
          :key="'local-' + i"
          @click="goTo(res)"
          class="cursor-pointer text-white hover:bg-text-yellow-300 py-1.5 font-normal hover:bg-blue-900/80 px-4 hover:text-yellow-300"
        >
          {{ res.label }}
        </li>
      </div>
      <div>
        <!-- Localizacao -->
        <li
          v-if="apiMatches.length"
          class="text-blue-300 text-sm leading-tight font-light px-4 py-3"
        >
          Localização
        </li>
        <!-- Result Localizacao -->
        <li
          v-for="(res, i) in apiMatches"
          :key="'api-' + i"
          @click="goTo(res)"
          class="cursor-pointer text-white hover:bg-text-yellow-300 py-1.5 font-normal hover:bg-blue-900/80 px-4 hover:text-yellow-300"
        >
          {{ res.label }}
        </li>
      </div>
    </ul>
  </div>
</template>

<script setup>
import UiInputSearch from '../Ui/InputSearch.vue';
import { onClickOutside } from '@vueuse/core';

const { $mapbox } = useNuxtApp();
const searchBox = ref(null);
const query = ref('');
const apiMatches = ref([]);
const cruzadoMatches = ref([]);
const showSuggestions = ref(false);

const props = defineProps({
  map: Object,
  vitimas: {
    type: Array,
    default: () => [],
  },
});

watch(query, () => {
  if (query.value.trim() !== '') {
    search();
    showSuggestions.value = true;
  } else {
    cruzadoMatches.value = [];
    apiMatches.value = [];
    showSuggestions.value = false;
  }
});

onClickOutside(searchBox, () => {
  showSuggestions.value = false;
});

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
  (center ? `&proximity=${center.lng},${center.lat}` : '')
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

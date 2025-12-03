<template>
  <div class="w-full h-[450px]">
    <div class="evolution h-full relative flex flex-col w-full">

      <!-- Barras (anos) -->
      <div class="anos flex items-end gap-2 flex-1 -mb-6 ml-6 z-10">
        <div
          v-for="(a, idx) in data"
          :key="a.ano ?? idx"
          class="ano h-full flex-1 min-w-0 flex flex-col justify-end gap-1 transition-all duration-300 ease-in-out"
          :class="{
            'opacity-70': hoveredIndex !== null && hoveredIndex !== idx,
          }"
        >
          <div
            class="blocos w-full bg-black/5 overflow-hidden flex flex-col justify-end cursor-pointer transition-all duration-300 ease-in-out"
            :style="{ height: barHeight(total(a)) }"
            @mouseenter="onEnterBar($event, a, idx)"
            @mousemove="onMoveBar"
            @mouseleave="onLeaveBar"
          >
            <div
              v-for="([crime, valor], j) in crimesArray(a)"
              :key="crime"
              :class="['w-full', palette[j % palette.length]]"
              :style="{ height: segmentHeight(a, valor) }"
            />
          </div>

          <div class="text-center text-sm label opacity-0 md:opacity-80">
            {{ a.ano }}
          </div>
        </div>
      </div>

      <!-- Índices -->
      <div
        v-if="maxRounded > 0"
        class="indices absolute w-full h-full pointer-events-none"
      >
        <div
          v-for="(t, i) in ticks"
          :key="i"
          class="absolute left-0 right-0 border-t border-black/20 transition-all duration-300 ease-in-out"
          :style="{ bottom: (i / (ticks.length - 1)) * 100 + '%' }"
        >
          <span class="absolute left-0 -top-4 text-xs opacity-70">
            {{ t }}
          </span>
        </div>
      </div>
    </div>
  </div>

  <ClientOnly>
    <UiTooltip v-bind="tip" />
  </ClientOnly>
</template>

<script setup>
// Imports e configs
import { computed, ref } from 'vue';
import { useFloatingTooltip } from '#imports';
const { tip, showAtEvent, moveWithEvent, hide } = useFloatingTooltip();

// Estado para controlar hover
const hoveredIndex = ref(null);

// Props
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  palette: {
    type: Array,
    default: () => ['bg-violet/85', 'bg-coral/85'],
  },
});

// Data
const crimesArray = (a) => Object.entries(a?.crimes ?? {});
const total = (a) => crimesArray(a).reduce((s, [, v]) => s + num(v), 0);

// Computeds
// Max do gráfico
const maxRaw = computed(() => Math.max(0, ...props.data.map(total)));
const maxRounded = computed(() => {
  const m = maxRaw.value;
  if (!m) return 0;
  // arredonda em múltiplo de 10
  const step = 10;
  return Math.ceil(m / step) * step;
});

// ticks
const ticks = computed(() => {
  if (!maxRounded.value) return [0];
  const arr = [];
  for (let i = 0; i <= 5; i++) arr.push((maxRounded.value / 5) * i);
  return arr;
});

// Functions
// Estilo da barra e seguimentos
const barHeight = (tot) => {
  const max = maxRounded.value || 1;
  return (tot / max) * 100 + '%';
};
const segmentHeight = (a, valor) => {
  const tot = total(a) || 1;
  return (num(valor) / tot) * 100 + '%';
};

// Parse seguro
function num(v) {
  if (v == null || v === '') return 0;
  const n = Number(String(v).replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

// Tooltip
function tooltipContent(row) {
  const fer = row?.crimes?.feridas ?? 0;
  const mor = row?.crimes?.mortas ?? 0;
  const tot = fer + mor;
  return `
        <div class="font-bigShoulders text-2xl uppercase font-bold text-blue-900">${row.ano}</div>
        <div class="text-lg text-blue-900">${tot} balead${tot > 1 ? 'os(as)' : 'o(a)'}</div>
        <hr class="border-t border-neutral-400 mt-2 mb-2" />
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-xl ${props.palette[0]}"></span>
          <span class="text-md text-neutral-600">${fer} Ferida${fer > 1 ? 's' : ''}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-xl ${props.palette[1]}"></span>
          <span class="text-md text-neutral-600">${mor} Morta${mor > 1 ? 's' : ''}</span>
        </div>
      `;
}

function onEnterBar(e, row, idx) {
  hoveredIndex.value = idx;
  showAtEvent(e, tooltipContent(row));
}
function onMoveBar(e) {
  moveWithEvent(e);
}
function onLeaveBar() {
  hoveredIndex.value = null;
  hide();
}
</script>
<style scoped>
  .ano:first-child .label, .ano:last-child .label {
    @apply opacity-100;
  }
  .ano:last-child .label {
    text-indent: -20px;
  }
</style>

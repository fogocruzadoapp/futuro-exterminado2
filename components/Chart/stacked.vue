<template>
  <div class="w-full">
    <div class="flex flex-col gap-3">
      <!-- Linha -->
      <div
        v-for="(row, i) in data"
        :key="row.label ?? i"
        class="flex items-center gap-3 transition-all duration-300 ease-in-out"
        :class="{ 'opacity-70': hoveredIndex !== null && hoveredIndex !== i }"
      >
        <!-- Label + total -->
        <div
          class="shrink-0 flex items-baseline gap-2 w-[150px] md:w-[220px] justify-between"
        >
          <span
            class="text-sm leading-none opacity-80 truncate transition-all duration-300 ease-in-out"
            >{{ row.label }}</span
          >
          <span
            class="text-[18px] font-extrabold tabular-nums transition-all duration-300 ease-in-out"
            >{{ row.value }}</span
          >
        </div>

        <!-- Barra empilhada -->
        <div
          class=" bg-black/5 w-[calc(100%-162px)] md:w-[calc(100%-232px)]"
          @mouseenter="onEnterBar($event, row, i)"
          @mousemove="onMoveBar"
          @mouseleave="onLeaveBar"
        >
          <div class="relative h-6 overflow-hidden flex bg-black/5 transition-all duration-300 ease-in-out" :style="{ width: barWidth(row.value) }">
            <div
              v-for="([crime, valor], j) in crimesArray(row)"
              :key="crime"
              :class="['h-full', palette[j % palette.length]]"
              :style="{ width: segmentWidth(row, valor) }"
            />
          </div>
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
  crimesOrder: {
    type: Array,
    default: () => ['feridas', 'mortas'],
  },
  palette: {
    type: Array,
    default: () => ['bg-violet/85', 'bg-coral/85'],
  },
});

// Computeds
// Máximo para escalar largura das barras
const maxRaw = computed(() =>
  Math.max(0, ...props.data.map((r) => num(r.value))),
);

// Functions
const num = (v) => (Number.isFinite(+v) ? +v : 0);

const crimesArray = (row) => {
  const c = row?.crimes ?? {};
  const ordered = props.crimesOrder.map((k) => [k, num(c[k] ?? 0)]);
  for (const k of Object.keys(c))
    if (!props.crimesOrder.includes(k)) ordered.push([k, num(c[k])]);
  return ordered;
};

// Larguras
const barWidth = (val) => {
  const max = maxRaw.value || 1;
  return (num(val) / max) * 100 + '%';
};
const segmentWidth = (row, valor) => {
  const tot = num(row?.value) || 1;
  return (num(valor) / tot) * 100 + '%';
};

// Tooltip
function tooltipContent(row) {
  const fer = row?.crimes?.feridas ?? 0;
  const mor = row?.crimes?.mortas ?? 0;
  const pct = row?.percent != null ? Number(row.percent).toLocaleString('pt-BR', { style: 'decimal', maximumFractionDigits: 1 }) + '%' : '';

  return `
        <div class="font-bigShoulders text-2xl uppercase font-bold text-blue-900">${row.label}</div>
        <div class="text-lg text-blue-900">${pct} das vítimas</div>
        <hr class="border-t border-neutral-400 mt-2 mb-2" />
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-xl ${props.palette[0]}"></span>
          <span class="text-md text-neutral-600">${fer} ferida${fer > 1 ? 's' : ''}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-xl ${props.palette[1]}"></span>
          <span class="text-md text-neutral-600">${mor} morta${mor > 1 ? 's' : ''}</span>
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

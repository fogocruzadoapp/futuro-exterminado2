<script setup>
// Imports e configs
import { computed } from 'vue';
import { useFloatingTooltip } from '#imports';
import { Title } from '#components';
const { tip, showAtEvent, moveWithEvent, hide } = useFloatingTooltip();

// Data
const wrapRef = ref(null);
const box = reactive({ width: 0, height: 0 });

// Props
const props = defineProps({
  anoFeridos: { type: Number, required: true },
  anoMortos: { type: Number, required: true },

  situacaoFeridos: { type: Number, default: 0 },
  situacaoMortos: { type: Number, default: 0 },

  semLegenda: { type: Boolean, default: false },
  detalhes: { type: Boolean, default: false },

  overlapFraction: { type: Number, default: 0.3 },
  verticalOffset: { type: Number, default: 12 },

  title: { type: String },
  big: { type: Boolean, default: false },
});

// Computeds
const maxSizeD = computed(() =>
  Math.max(20, Math.min(box.width, box.height) * 1),
);
const minSizeD = computed(() => maxSizeD.value * 0.2);

// helpers
const toNum = (n) => {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
};
const clamp01 = (x) => Math.max(0, Math.min(1, x));

// Totais (determinam os diâmetros)
const feridosN = computed(() => toNum(props.anoFeridos));
const mortosN = computed(() => toNum(props.anoMortos));
const totalN = computed(() => feridosN.value + mortosN.value);
const feridosS = computed(() => toNum(props.situacaoFeridos));
const mortosS = computed(() => toNum(props.situacaoMortos));
const totalS = computed(() => feridosS.value + mortosS.value);

// proporções (para tamanho por ÁREA)
const ratioFeridos = computed(() =>
  totalN.value ? feridosN.value / totalN.value : 0,
);
const ratioMortos = computed(() =>
  totalN.value ? mortosN.value / totalN.value : 0,
);

const scaleByArea = (r) =>
  minSizeD.value +
  Math.sqrt(clamp01(Number(r))) * (maxSizeD.value - minSizeD.value);

const sizeFeridos = computed(() =>
  totalN.value ? scaleByArea(ratioFeridos.value) : 0,
);
const sizeMortos = computed(() =>
  totalN.value ? scaleByArea(ratioMortos.value) : 0,
);

// offsets relativos ao centro do container
const offsets = computed(() => {
  const dF = sizeFeridos.value;
  const dM = sizeMortos.value;

  if (!feridosN.value && !mortosN.value) {
    return { feridos: { display: 'none' }, mortos: { display: 'none' } };
  }

  if (dF && !mortosN.value) {
    return {
      feridos: { ml: 0, mt: +props.verticalOffset / 2, display: 'block' },
      mortos: { display: 'none' },
    };
  }
  if (!feridosN.value && dM) {
    return {
      feridos: { display: 'none' },
      mortos: { ml: 0, mt: -props.verticalOffset / 2, display: 'block' },
    };
  }

  // Ambos presentes
  const rF = dF / 2;
  const rM = dM / 2;
  const overlapH = Math.min(dF, dM) * props.overlapFraction;
  const D = Math.max(0, rF + rM - overlapH);
  const half = D / 2;
  const vy = props.verticalOffset;

  return {
    feridos: { ml: +half, mt: +vy, display: 'block' },
    mortos: { ml: -half, mt: -vy, display: 'block' },
  };
});

// Onmounted
onMounted(() => {
  const ro = new ResizeObserver(([e]) => {
    const { width, height } = e.contentRect;
    box.width = width;
    box.height = height;
  });
  if (wrapRef.value) ro.observe(wrapRef.value);
});

// Funções

// Tooltip
function tooltipContent(row) {
  let html = '';
  if (props.title) {
    html += `<div class="font-bigShoulders text-2xl uppercase font-bold text-blue-900">${props.title}</div>`;
  }
  html += `<div class="text-lg text-blue-900 transition-all duration-300 ease-in-out">${
    row.crime
  } ${row.label}${row.crime > 1 ? 's' : ''}</div>
              <hr class="border-t border-neutral-400 mt-2 mb-2" />
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-xl ${
                  row.label == 'ferida' ? 'bg-violet/65' : 'bg-coral/65'
                }"></span>
                <span class="text-md text-neutral-600">${
                  row.percent
                }% do total de vítimas</span>
            </div>`;
  return html;
}
function onEnterBar(e, row) {
  showAtEvent(e, tooltipContent(row));
}
function onMoveBar(e) {
  moveWithEvent(e);
}
</script>

<template>
  <div class="relative flex justify-center my-1">
    <div class="w-full max-h-40 min-h-32 relative" ref="wrapRef">
      <!-- Mortos (direita) -->
      <div
        v-if="mortosN > 0"
        class="absolute flex items-center justify-center z-30 transition-all duration-300 ease-in-out origin-center"
        :style="{
          width: sizeMortos + 'px',
          height: sizeMortos + 'px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          marginLeft: offsets.mortos?.ml + 'px',
          marginTop: offsets.mortos?.mt + 'px',
          display: offsets.mortos?.display ?? 'block',
        }"
        @mouseenter="
          onEnterBar($event, {
            label: 'morta',
            crime: situacaoMortos,
            percent: totalN
              ? ((situacaoMortos / totalN) * 100).toFixed(1).replace('.', ',')
              : 0,
          })
        "
        @mousemove="onMoveBar"
        @mouseleave="hide"
      >
        <div
          class="relative bg-coral/25 rounded-full flex items-center justify-center z-30 w-full h-full transition-all duration-300 ease-in-out"
        >
          <div
            class="relative bg-coral/65 rounded-full flex items-center justify-center z-30 transition-all duration-300 ease-in-out"
            :style="{
              width: (situacaoMortos / anoMortos) * 100 + '%',
              height: (situacaoMortos / anoMortos) * 100 + '%',
            }"
          >
            <span
              v-if="!semLegenda"
              class="text-xl font-extrabold font-bigShoulders"
              :class="{ 'text-black': detalhes, 'text-white': !detalhes }"
            >
              {{ situacaoMortos }}
            </span>
          </div>
        </div>
      </div>
      <!-- Feridos (esquerda) -->
      <div
        class="absolute flex items-center justify-center z-20 transition-all duration-300 ease-in-out origin-center"
        v-if="feridosN > 0"
        :style="{
          width: sizeFeridos + 'px',
          height: sizeFeridos + 'px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          marginLeft: offsets.feridos?.ml + 'px',
          marginTop: offsets.feridos?.mt + 'px',
          display: offsets.feridos?.display ?? 'block',
        }"
        @mouseenter="
          onEnterBar($event, {
            label: 'ferida',
            crime: situacaoFeridos,
            percent: totalN
              ? ((situacaoFeridos / totalN) * 100).toFixed(1).replace('.', ',')
              : 0,
          })
        "
        @mousemove="onMoveBar"
        @mouseleave="hide"
      >
        <div
          class="relative bg-violet/25 rounded-full flex items-center justify-center z-30 w-full h-full transition-all duration-300 ease-in-out"
        >
          <div
            class="relative bg-violet/65 rounded-full flex items-center justify-center z-30 transition-all duration-300 ease-in-out"
            :style="{
              width: (situacaoFeridos / anoFeridos) * 100 + '%',
              height: (situacaoFeridos / anoFeridos) * 100 + '%',
            }"
          >
            <span
              v-if="!semLegenda"
              class="text-xl font-extrabold font-bigShoulders"
              :class="{ 'text-black': detalhes, 'text-white': !detalhes }"
            >
              {{ situacaoFeridos }}
            </span>
          </div>
        </div>
      </div>
      <div  class="relative w-full block pt-[80%]"></div>
    </div>

    <!-- Legendas -->
    <div
      v-if="!detalhes && !semLegenda"
      class="absolute bottom-0 left-0 flex flex-col gap-1"
    >
      <div class="text-violet-light text-sm leading-none">
        {{
          ((situacaoFeridos / (anoFeridos + anoMortos)) * 100)
            .toFixed(1)
            .replace('.', ',')
        }}%
      </div>
      <div class="inline-flex items-center gap-1">
        <div class="text-white text-sm leading-none">feridas</div>
        <div class="w-3 h-3 bg-violet rounded-full"></div>
      </div>
    </div>

    <div
      v-if="!detalhes && !semLegenda"
      class="absolute top-0 right-0 flex flex-col gap-1"
    >
      <div class="inline-flex items-center gap-1">
        <div class="w-3 h-3 bg-coral rounded-full"></div>
        <div class="text-white text-sm leading-none">mortas</div>
      </div>
      <div class="text-violet-light text-sm leading-none text-right">
        {{
          ((situacaoMortos / (anoFeridos + anoMortos)) * 100)
            .toFixed(1)
            .replace('.', ',')
        }}%
      </div>
    </div>
  </div>

  <ClientOnly>
    <UiTooltip v-bind="tip" />
  </ClientOnly>
</template>

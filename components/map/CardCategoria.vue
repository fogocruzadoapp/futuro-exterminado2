<template>
  <div
    @click="toggleCategoria"
    :class="[
      'self-stretch py-4 inline-flex flex-col justify-center items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out relative overflow-hidden',
      isAtivo ? '' : 'hover:bg-black/20',
    ]"
  >
    <!-- Máscara SVG e fundo blur quando ativo -->
    <svg
      v-if="isAtivo"
      class="absolute backdrop-blur-md inset-0 w-full h-full max-h-full pointer-events-none z-0"
      viewBox="0 0 99 196"
      preserveAspectRatio="none"
      style="display: block"
    >
      <defs>
        <mask id="mask-cardcategoria-inline">
          <path
            d="M98 176L65 196H0V57.999L29.8984 41H0L69.7646 0H98V176ZM0 57.999L-0.000976562 58V41H0V57.999Z"
            fill="white"
          />
          <path
            d="M-5.59796e-08 17L30 -2.80142e-06L-7.99073e-07 -1.49008e-06L-5.59796e-08 17Z"
            fill="white"
          />
        </mask>
      </defs>
      <rect
        x="0"
        y="0"
        width="99"
        height="196"
        fill="#000000"
        fill-opacity="0.2"
        mask="url(#mask-cardcategoria-inline)"
      />
    </svg>

    <!-- Botao Fechar -->
    <div
      v-if="isAtivo"
      @click="!toggleCategoria"
      class="absolute right-1 top-1"
    >
      <UiIcon class="relative" size="small">
        <SvgoClose :fontControlled="false" />
      </UiIcon>
    </div>

    <!-- Conteúdo do card -->
    <div
      class="relative z-10 gap-2.5 justify-start h-full w-full flex flex-col items-center"
    >
      <!-- IconeCard -->
      <div>
        <component
          :is="icone"
          class="w-10 h-10 text-white"
          :fontControlled="false"
        />
      </div>

      <!-- GraficoRing -->
      <ChartRing
        :feridos="feridos"
        :mortos="mortos"
        :totalGeral="totalGeral"
        :porcentagem="porcentagem"
        :backgroundOpacity="0.2"
      />

      <!-- Legenda -->
      <div
        class="self-stretch flex-1 flex flex-col justify-end items-center gap-1"
      >
        <div
          class="self-stretch flex flex-1 justify-center items-center text-center text-white text-base font-normal leading-none"
        >
          {{ titulo }}
        </div>
        <div
          class="self-stretch px-1.5 inline-flex justify-center items-center gap-1.5"
        >
          <!-- Mortos -->
          <div class="flex justify-end items-center gap-0.5">
            <div class="w-2 h-2 bg-coral rounded-full"></div>
            <div
              class="text-right justify-start text-blue-300 text-sm font-light leading-none"
            >
              {{ mortos }}
            </div>
          </div>
          <!-- Feridos -->
          <div class="flex justify-start items-center gap-0.5">
            <div class="w-2 h-2 bg-violet rounded-full"></div>
            <div
              class="text-right justify-start text-blue-300 text-sm font-light leading-none"
            >
              {{ feridos }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import ChartRing from './Chart/Ring.vue';

const props = defineProps({
  categoria: {
    type: String,
    required: true,
    validator: (value) =>
      ['acaoPolicial', 'balaPerdida', 'dentroDeCasa'].includes(value),
  },
  feridos: {
    type: Number,
    required: true,
  },
  mortos: {
    type: Number,
    required: true,
  },
  titulo: {
    type: String,
    required: true,
  },
  icone: {
    type: Object,
    required: true,
  },
  totalGeral: {
    type: Number,
    required: true,
  },
});

// Injetar filtros para sincronização
const filtros = inject('filtros');

// Computed para verificar se está ativo
const isAtivo = computed(() => {
  return filtros[props.categoria];
});

// Computed para calcular total da categoria
const total = computed(() => {
  return props.feridos + props.mortos;
});

// Computed para calcular porcentagem
const porcentagem = computed(() => {
  if (props.totalGeral === 0) return 0;
  return ((total.value / props.totalGeral) * 100).toFixed(1);
});

// Função para alternar categoria
function toggleCategoria() {
  filtros[props.categoria] = !filtros[props.categoria];
}
</script>

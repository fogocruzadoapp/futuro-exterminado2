<template>
  <div class="card">
    <!-- Background -->
    <div class="fundo">
      <!-- Esquerda -->
      <div class="max-w-32">
        <svg
          width="128"
          height="394"
          viewBox="0 0 128 394"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Variação 1 - Original -->
          <path
            v-if="variation === 1 || variation === 4"
            d="M128 393.91H127.872L0 304.001V83.9141H105.6L0 23.1143V0H128V393.91Z"
            :fill="computedSvgFillColor"
          />
          <!-- Variação 2 -->
          <path
            v-else-if="variation === 2"
            d="M128 394H0V199.415H105.6L0 138.615V0H128V394Z"
            :fill="computedSvgFillColor"
          />
          <!-- Variação 3 -->
          <path
            v-else-if="variation === 3"
            d="M0.000976562 346.001L0 159.396H92L27.2607 122.101H128L0 48V0H128V393.906H67.8672L0.000976562 346.001Z"
            :fill="computedSvgFillColor"
          />
        </svg>
      </div>
      <!-- Centro -->
      <div
        class="flex-1 w-full -mx-0.5 py-4 flex flex-col gap-2 items-center justify-center"
        :class="computedBackgroundClass"
        :style="{ backgroundColor: computedBackgroundColor }"
      ></div>
      <!-- Direita -->
      <div class="max-w-32">
        <svg
          width="128"
          height="394"
          viewBox="0 0 128 394"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Variação 1 - Original -->
          <path
            v-if="variation === 1 || variation === 4"
            d="M128 74.0986V185.666H65.248L128 221.994V222.188H0L128 296.289V394H0V0.0175781H0.0302734L128 74.0986Z"
            :fill="computedSvgFillColor"
          />
          <!-- Variação 2 -->
          <path
            v-else-if="variation === 2"
            d="M128 74.0986V283.912H0L125.576 356.609H64L128 393.66V394H0V0.0175781H0.0302734L128 74.0986ZM128 0.0175781H0.0302734L0 0H128V0.0175781Z"
            :fill="computedSvgFillColor"
          />
          <!-- Variação 3 -->
          <path
            v-else-if="variation === 3"
            d="M128 136.666H65.248L128 172.994V173.203H0L128 247.304V394H0V0H128V136.666Z"
            :fill="computedSvgFillColor"
          />
        </svg>
      </div>
    </div>
    <!-- Conteudo -->
    <div
      class="absolute top-0 left-0 max-w-full max-h-full w-full h-full flex justify-center items-center flex-col"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variation: {
    type: Number,
    default: 1,
    validator: (value) => [1, 2, 3, 4].includes(value),
  },
  color: {
    type: String,
    default: '#2f227d', // bg-blue-900
  },
});

// Computed para determinar se é uma classe do Tailwind ou cor hexadecimal
const computedBackgroundColor = computed(() => {
  // Se começar com 'bg-', é uma classe do Tailwind
  if (props.color.startsWith('bg-')) {
    return null; // Retorna null para usar a classe diretamente
  }
  // Caso contrário, é uma cor hexadecimal
  return props.color;
});

const computedBackgroundClass = computed(() => {
  // Se é uma classe do Tailwind, retorna a classe
  if (props.color.startsWith('bg-')) {
    return props.color;
  }
  // Caso contrário, retorna string vazia
  return '';
});

// Para o SVG, converte a cor para hexadecimal
const computedSvgFillColor = computed(() => {
  // Se é uma classe do Tailwind, retorna a cor hexadecimal equivalente
  if (props.color.startsWith('bg-')) {
    // Mapeamento das suas cores customizadas
    const tailwindColors = {
      'bg-blue-100': '#e3e1f5',
      'bg-blue-200': '#cbc8e8',
      'bg-blue-300': '#aca6e0',
      'bg-blue-400': '#8c82e0',
      'bg-blue-500': '#6a5ed6',
      'bg-blue-600': '#4235bc',
      'bg-blue-700': '#3a2d9e',
      'bg-blue-800': '#2f227d',
      'bg-blue-900': '#24195d',
      'bg-blue-1000': '#160f38',
      'bg-base-100': '#f6f2f7',
      'bg-base-200': '#e9e1eb',
      'bg-base-300': '#d9d0db',
      'bg-base-400': '#bcb0bf',
      'bg-base-500': '#978a9c',
      'bg-base-600': '#76697a',
      'bg-base-700': '#5c5061',
      'bg-base-800': '#453b4a',
      'bg-base-900': '#2a232e',
      'bg-base-1000': '#1d0c07',
      'bg-yellow-100': '#ffc876',
      'bg-yellow-200': '#ffbd5c',
      'bg-yellow-300': '#ffad33',
      'bg-yellow-400': '#e89d2e',
      'bg-yellow-500': '#b57b24',
      'bg-violet': '#a64dff',
      'bg-coral': '#ec6775',
      'bg-indigo': '#574efc',
    };
    return tailwindColors[props.color] || '#2f227d';
  }
  // Se já é hexadecimal, retorna a mesma cor
  return props.color;
});
</script>
<style scoped>
@reference "@/assets/css/global.css";
.card {
  @apply relative duration-300 ease-in-out transition-all;
  .fundo {
    @apply flex flex-row transition-all duration-300 ease-in-out;
  }
  &:hover {
    .fundo {
      @apply opacity-75;
    }
  }
}
</style>

<template>
  <figure
    class="relative"
    :style="{
      transform: `rotate(${rotationDegrees}deg)`,
      width: sizeWidth,
      height: sizeHeight,
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d'
    }"
  >
    <!-- SVG para clip-path -->
    <svg
      width="0"
      height="0"
      class="absolute"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath :id="clipId" clipPathUnits="objectBoundingBox">
          <path :d="currentClipPath" />
        </clipPath>
      </defs>
    </svg>

    <!-- Container com clip-path aplicado -->
    <div
      class="w-full h-full pointer-events-none"
      :style="{
        clipPath: `url(#${clipId})`,
        isolation: 'isolate',        // <<< evita 'vazamento' do blend
        contain: 'layout paint',     // <<< ajuda a estabilizar a pintura
        willChange: 'transform'
      }"
    >
      <img
        :src="imageSrc"
        class="w-full h-full object-cover"
        :alt="alt"
        style="
          filter: grayscale(100%) brightness(70%);
          transform: translateZ(0);           /* força GPU */
          backface-visibility: hidden;
          will-change: transform;
        "
      />

      <!-- Camada de cor -->
      <div
        class="absolute top-0 left-0 w-full h-full mix-blend-color"
        style="
          background: linear-gradient(0deg, rgba(58,45,158,.75) 0%, rgba(58,45,158,.75) 100%);
          transform: translateZ(0);
          backface-visibility: hidden;
          will-change: opacity, transform;
        "
      ></div>

      <!-- Camada de noise -->
      <div
        class="absolute top-0 left-0 w-full h-full mix-blend-multiply"
        style="
          background-image: url('/images/texture/noise.png');
          background-size: cover;
          transform: translateZ(0);
          backface-visibility: hidden;
          will-change: opacity, transform;
        "
      ></div>
    </div>
  </figure>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // Imagem
  imageSrc: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: 'Imagem',
  },

  // Rotação (qualquer número - positivo para horário, negativo para anti-horário)
  rotation: {
    type: [String, Number],
    default: 10,
  },

  // Largura (string ou number - ex: '200px', '20rem', 200)
  width: {
    type: [String, Number],
    default: '100%',
  },

  // Altura (string ou number - ex: '200px', '20rem', 200)
  height: {
    type: [String, Number],
    default: '100%',
  },

  // Tipo de corte (default, type1, type2, type3, type4)
  cutType: {
    type: String,
    default: 'default',
    validator: (value) =>
      ['default', 'type1', 'type2', 'type3', 'type4'].includes(value),
  },
});

// Converte width e height para string com unidade
const sizeWidth = computed(() => {
  const value = props.width;
  return typeof value === 'number' ? `${value}px` : value;
});

const sizeHeight = computed(() => {
  const value = props.height;
  return typeof value === 'number' ? `${value}px` : value;
});

// ID único para o clip-path baseado nas props para evitar problemas de hidratação
const clipId = computed(() => {
  // Cria um ID determinístico baseado nas props para evitar diferenças SSR/Cliente
  const propsHash = `${props.cutType}-${props.imageSrc}-${props.rotation}-${props.width}-${props.height}`;
  return `figure-clip-${propsHash.replace(/[^a-zA-Z0-9]/g, '-')}`;
});

// Tipos de corte
const clipPaths = {
  default:
    'M1,0.07 L0.806,0.183 L0.926,0.184 L0.721,0.303 L1,0.303 V1 L0,1 L0,0.88 L0.262,0.727 L0,0.727 L0,0 L1,0 L1,0.07 Z',
  type1:
    'M0.757,0.141 L1,0.141 V1 L0.35,1 L0.066,0.833 L0.193,0.833 L0,0.719 V0 L0.997,0 L0.757,0.141 Z',
  type2:
    'M1,0.738 L0.553,1 L0,1 L0,0.273 L0.289,0.274 L0,0.103 V0 L1,0 L1,0.738 Z',
  type3:
    'M1,0.598 L0.674,0.789 L0.865,0.789 L0.504,1 L0,1 L0,0 L1,0 L1,0.598 Z M1,1 L0.708,1 L1,0.829 L1,1 Z',
  type4:
    'M1,0.355 L0.846,0.446 L0.942,0.446 L0.74,0.564 L1,0.564 V1 L0.492,1 L0,0.711 L0,0 L1,0 L1,0.355 Z',
};

const currentClipPath = computed(() => {
  return clipPaths[props.cutType] || clipPaths.default;
});

// Converte o valor de rotação para graus
const rotationDegrees = computed(() => {
  return Number(props.rotation);
});
</script>

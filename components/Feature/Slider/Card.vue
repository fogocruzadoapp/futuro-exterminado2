<template>
  <!-- Card Vitimas -->
  <div
    class="container mx-auto md:pt-0 px-3 h-full md:px-0 flex md:items-center justify-center items-end min-h-[700px] md:min-h-0"
  >
    <div
      class="md:h-[488px] h-[498px] my-14 w-full max-w-[1280px] flex flex-col"
    >
      <!-- Top -->
      <div class="w-full h-16 min-h-10">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1280 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          class="translate-y-0.5"
        >
          <path :d="topSvgPath" :fill="svgColor" />
        </svg>
      </div>
      <!-- Center -->
      <div
        class="w-full flex-1 flex flex-col md:flex-row items-center justify-center md:px-12 px-8 pt-4 gap-4 md:gap-8 bg-blue-900"
      >
        <!-- Centro - Primeiro no mobile -->
        <div
          class="flex flex-col relative w-full gap-4 h-[300px] md:min-w-[340px] md:h-full order-1 md:order-2"
        >
          <div
            class="absolute bottom-0 md:top-1/2 z-20 left-0 w-full h-[500px] md:h-[600px] md:-translate-y-1/2 border-2 border-yellow-300"
          >
            <FeatureVideoPlayer
              :thumbnail="thumbnail"
              :video-url="videoUrl"
              :is-active="isActive"
            />
          </div>
        </div>

        <!-- Esquerda - Segundo no mobile -->
        <div
          class="flex flex-col gap-1 w-full md:h-full items-start justify-end text-white order-2 md:order-1"
        >
          <!-- Mobile Controle de tamanho-->
          <div class="w-full md:hidden flex">
            <UiTextAutoSize
              tag="h1"
              :minSize="14"
              :maxSize="72"
              class="text-7xl leading-[1.3] font-bold text-white w-full font-bigShoulders"
            >
              {{ nome }}
            </UiTextAutoSize>
          </div>
          <!-- Desktop -->
          <div class="md:flex hidden max-w-[300px]">
            <UiTypography variant="h1" color="white" class="text-7xl font-bold">
              {{ nome }}
            </UiTypography>
          </div>
          <div class="md:text-lg max-h-[200px] md:min-h-[140px] line-clamp-8">
            {{ descricao }}
          </div>
        </div>

        <!-- Direita - Terceiro no mobile -->
        <div
          class="flex flex-col gap-4 w-full md:h-full items-start justify-end order-3"
        >
          <div class="flex flex-row gap-2 items-start">
            <SvgoPin
              class="w-[18px] h-6 text-coral md:translate-y-1"
              :fontControlled="false"
            />
            <span class="text-white text-xs md:text-lg">{{ localidade }}</span>
          </div>
        </div>
      </div>
      <!-- Bottom -->
      <div class="w-full h-16 min-h-10">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1280 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          class="-translate-y-0.5"
        >
          <path :d="bottomSvgPath" :fill="svgColor" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SvgoPin } from '#components';
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: Number,
    required: true,
    validator: (value) => [1, 2, 3, 4].includes(value),
  },
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  localidade: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

// SVGs para cada tipo
const svgConfigs = {
  1: {
    top: 'M160 40.7998V0H1140L1229.6 52V17.4424L1248 28V0H1280V64H0V0H89.5996L160 40.7998Z',
    bottom: 'M1280 0V64H108L18.4004 12V46.5576L0 36V0H1280Z',
    color: '#24195D',
  },
  2: {
    top: 'M361.334 0L450.934 52V17.4424L469.334 28V0H868.266L938.666 40.7998V0H1280V64H0V0H361.334Z',
    bottom: 'M1280 0V64H1260L1170.4 12V46.5576L1152 36V64H0V0H1280Z',
    color: '#24195D',
  },
  3: {
    top: 'M160 40.7998V0H1140L1229.6 52V17.4424L1248 28V0H1280V64H0V0H89.5996L160 40.7998Z',
    bottom: 'M1280 0V64H108L18.4004 12V46.5576L0 36V0H1280Z',
    color: '#24195D',
  },
  4: {
    top: 'M450.934 52V17.4424L469.334 28V0H868.266L938.666 40.7998V0H1280V64H0V0H361.334L450.934 52Z',
    bottom: 'M1280 0V64H1260L1170.4 12V46.5576L1152 36V64H0V0H1280Z',
    color: '#24195D',
  },
};

// Computed properties para o SVG atual
const currentConfig = computed(() => svgConfigs[props.type] || svgConfigs[1]);
const topSvgPath = computed(() => currentConfig.value.top);
const bottomSvgPath = computed(() => currentConfig.value.bottom);
const svgColor = computed(() => currentConfig.value.color);
</script>

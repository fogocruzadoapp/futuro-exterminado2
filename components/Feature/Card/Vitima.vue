<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';

// Props para cor personalizável e dados
const props = defineProps({
  color: {
    type: String,
    default: '#ec6775', // cor padrão
  },
  image: {
    type: String,
    required: true,
  },
  imageSize: {
    type: String,
    default: 'max-w-[400px] max-h-[400px]',
  },
  containerRef: {
    type: Object,
    default: null,
  },
  nome: {
    type: String,
    required: true,
  },
  localizacao: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value),
  },
  // Configurações de animação
  config: {
    type: Object,
    default: () => ({
      // Escala
      scaleEntrada: 1,
      scaleMeio: 1,
      scaleSaida: 1,

      // Blur
      blurEntrada: 5,
      blurMeio: 0,
      blurSaida: 0,

      // Rotação
      rotationEntrada: 0,
      rotationMeio: 0,
      rotationSaida: 0,

      // Translate Y
      translateYEntrada: 0,
      translateYMeio: 0,
      translateYSaida: 0,

      // Translate X
      translateXEntrada: 0,
      translateXMeio: 0,
      translateXSaida: 0,
    }),
  },
});

// Estilos dinâmicos
const bgStyle = computed(() => ({
  backgroundColor: props.color,
  borderColor: props.color,
}));
const pathFill = computed(() => props.color);

// Classes de alinhamento
const alignmentClasses = computed(() => {
  return props.align === 'right' ? 'items-end' : 'items-start';
});

// Classes de posicionamento absoluto
const absolutePositionClasses = computed(() => {
  return props.align === 'right'
    ? 'absolute top-0 right-0 w-fit h-full flex flex-col justify-center'
    : 'absolute top-0 left-0 w-fit h-full flex flex-col justify-center';
});

// Transform da imagem baseado no alinhamento
const imageTransformClasses = computed(() => {
  return props.align === 'right' ? '' : '';
});

// Refs para scroll animation
const cardRef = ref(null);
const scrollProgress = ref(0.5); // Começa no meio (tamanho normal)

// Função para calcular o progresso baseado na posição do card
const calculateScrollProgress = () => {
  if (!cardRef.value) return;

  const cardRect = cardRef.value.getBoundingClientRect();

  // Se há um container pai, usar ele como referência
  if (props.containerRef && props.containerRef.value) {
    const containerRect = props.containerRef.value.getBoundingClientRect();
    const containerHeight = containerRect.height;
    const cardCenter = cardRect.top + cardRect.height / 2;
    const containerCenter = containerRect.top + containerHeight / 2;

    // Distância do centro do card até o centro do container
    const distance = cardCenter - containerCenter;

    // Normalizar para 0-1 baseado no container
    let progress = 0.5 - distance / containerHeight;

    // Limitar entre 0 e 1
    progress = Math.max(0, Math.min(1, progress));

    scrollProgress.value = progress;
  } else {
    // Fallback para window scroll (comportamento original)
    const windowHeight = window.innerHeight;
    const cardCenter = cardRect.top + cardRect.height / 2;
    const windowCenter = windowHeight / 2;

    const distance = cardCenter - windowCenter;
    let progress = 0.5 - distance / windowHeight;

    progress = Math.max(0, Math.min(1, progress));
    scrollProgress.value = progress;
  }
};

// Escala baseada no scroll progress
const imageScale = computed(() => {
  // 0 = scaleEntrada, 0.5 = scaleMeio, 1 = scaleSaida
  if (scrollProgress.value <= 0.5) {
    // De scaleEntrada para scaleMeio (0 -> 0.5)
    return (
      props.config.scaleEntrada +
      (scrollProgress.value / 0.5) *
        (props.config.scaleMeio - props.config.scaleEntrada)
    );
  } else {
    // De scaleMeio para scaleSaida (0.5 -> 1)
    return (
      props.config.scaleMeio +
      ((scrollProgress.value - 0.5) / 0.5) *
        (props.config.scaleSaida - props.config.scaleMeio)
    );
  }
});

// Blur baseado no scroll progress
const imageBlur = computed(() => {
  // 0 = blurEntrada, 0.5 = blurMeio, 1 = blurSaida
  if (scrollProgress.value <= 0.5) {
    // De blurEntrada para blurMeio (0 -> 0.5)
    return (
      props.config.blurEntrada +
      (scrollProgress.value / 0.5) *
        (props.config.blurMeio - props.config.blurEntrada)
    );
  } else {
    // De blurMeio para blurSaida (0.5 -> 1)
    return (
      props.config.blurMeio +
      ((scrollProgress.value - 0.5) / 0.5) *
        (props.config.blurSaida - props.config.blurMeio)
    );
  }
});

// Rotação baseada no scroll progress
const imageRotation = computed(() => {
  // 0 = rotationEntrada, 0.5 = rotationMeio, 1 = rotationSaida
  if (scrollProgress.value <= 0.5) {
    // De rotationEntrada para rotationMeio (0 -> 0.5)
    return (
      props.config.rotationEntrada +
      (scrollProgress.value / 0.5) *
        (props.config.rotationMeio - props.config.rotationEntrada)
    );
  } else {
    // De rotationMeio para rotationSaida (0.5 -> 1)
    return (
      props.config.rotationMeio +
      ((scrollProgress.value - 0.5) / 0.5) *
        (props.config.rotationSaida - props.config.rotationMeio)
    );
  }
});

// Translate Y baseado no scroll progress
const imageTranslateY = computed(() => {
  // 0 = translateYEntrada, 0.5 = translateYMeio, 1 = translateYSaida
  if (scrollProgress.value <= 0.5) {
    // De translateYEntrada para translateYMeio (0 -> 0.5)
    return (
      props.config.translateYEntrada +
      (scrollProgress.value / 0.5) *
        (props.config.translateYMeio - props.config.translateYEntrada)
    );
  } else {
    // De translateYMeio para translateYSaida (0.5 -> 1)
    return (
      props.config.translateYMeio +
      ((scrollProgress.value - 0.5) / 0.5) *
        (props.config.translateYSaida - props.config.translateYMeio)
    );
  }
});

// Translate X baseado no scroll progress (movimento horizontal)
const imageTranslateX = computed(() => {
  // 0 = translateXEntrada, 0.5 = translateXMeio, 1 = translateXSaida
  if (scrollProgress.value <= 0.5) {
    // De translateXEntrada para translateXMeio (0 -> 0.5)
    return (
      props.config.translateXEntrada +
      (scrollProgress.value / 0.5) *
        (props.config.translateXMeio - props.config.translateXEntrada)
    );
  } else {
    // De translateXMeio para translateXSaida (0.5 -> 1)
    return (
      props.config.translateXMeio +
      ((scrollProgress.value - 0.5) / 0.5) *
        (props.config.translateXSaida - props.config.translateXMeio)
    );
  }
});

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', calculateScrollProgress, { passive: true });
  calculateScrollProgress(); // Calcular posição inicial
});

onUnmounted(() => {
  window.removeEventListener('scroll', calculateScrollProgress);
});
</script>

<template>
  <!-- Card -->
  <div
    ref="cardRef"
    :class="`relative w-full h-full flex flex-col  ${alignmentClasses} justify-center min-h-[1200px]`"
  >
    <!-- Img -->
    <div
      :class="`relative -z-10 ${imageTransformClasses}`"
      class="overflow-clip"
      :style="{
        transform: `scale(${imageScale}) rotate(${imageRotation}deg) translate(${imageTranslateX}px, ${imageTranslateY}px)`,
        filter: `blur(${imageBlur}px)`,
      }"
    >
      <figure :class="`${props.imageSize} grayscale overflow-hidden`">
        <img :src="props.image" class="w-full h-full object-cover" />
      </figure>
    </div>
    <!-- Conteudo -->
    <div :class="absolutePositionClasses">
      <div class="flex flex-row h-fit relative">
        <!--  Col Esquerda -->
        <div class="md:min-w-16 min-w-5 flex flex-col">
          <!-- Bloco 1 -->
          <div :style="bgStyle" class="w-full"></div>
          <!-- Bloco 2 - Com corte negativo -->
          <div
            :style="bgStyle"
            class="w-full md:h-[62px] h-[20px]"
            style="
              clip-path: polygon(
                0 2.4%,
                82.5% 51.4%,
                0 51.4%,
                0 100%,
                100% 100%,
                100% 0%,
                0 0%
              );
            "
          ></div>
          <!-- Bloco 3 -->
          <div :style="bgStyle" class="w-full flex-1"></div>
          <!-- Bloco 4 - Com corte diagonal -->
          <div
            :style="bgStyle"
            class="w-full md:h-[62px] h-[20px]"
            style="
              clip-path: polygon(0 0%, 100% 0%, 100% 100%, 98.4% 100%, 0% 2.2%);
            "
          ></div>
        </div>
        <!--  Col Centro -->
        <div :style="bgStyle" class="py-8 flex-1 max-w-[288px]">
          <div class="flex flex-col gap-8">
            <div class="flex flex-col text-base-1000">
              <div class="font-extrabold font-bigShoulders text-7xl">
                {{ props.nome }}
              </div>
              <div class="flex flex-row gap-2 items-center">
                <SvgoPin
                  class="w-[24px] h-6 text-base-1000 md:translate-y-0"
                  :fontControlled="false"
                />
                <span>{{ props.localizacao }}</span>
              </div>
            </div>
            <div class="text-white">
              {{ props.descricao }}
            </div>
          </div>
        </div>
        <!--  Col Direita -->
        <div class="md:min-w-16 min-w-5 flex flex-col">
          <!-- Bloco 1 - Com corte negativo -->
          <div
            :style="bgStyle"
            class="w-full md:h-[62px] h-[20px]"
            style="clip-path: polygon(0% 0%, 100% 61.3%, 100% 100%, 0% 100%)"
          ></div>
          <!-- Bloco 2 -->
          <div :style="bgStyle" class="w-full flex-1 border border-inner"></div>
          <!-- Bloco 3 - Com corte negativo -->
          <div
            :style="bgStyle"
            class="w-full md:h-[65px] h-[20px]"
            style="
              clip-path: polygon(
                50% 0%,
                100% 30%,
                100% 30%,
                0% 30%,
                100% 90%,
                100% 101%,
                0% 101%,
                0% 0%
              );
            "
          ></div>
          <!-- Bloco 4 -->
          <div :style="bgStyle" class="w-full flex-1 border"></div>
        </div>

        <!-- Fragmento 1 de SVG -->
        <div
          class="absolute bottom-0 left-0 w-[30px] h-[16px] md:w-[59px] md:h-[32px] translate-y-full -translate-x-1/3"
        >
          <svg
            class="w-full h-full"
            viewBox="0 0 59 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMinYMax slice"
          >
            <path
              d="M1.39876e-06 32L58.1818 0L0 2.54321e-06L1.39876e-06 32Z"
              :fill="pathFill"
            />
          </svg>
        </div>
        <!-- Fragmento 2 de SVG -->
        <div
          class="absolute top-0 right-0 w-[24px] h-[13px] md:w-[48px] md:h-[26px] -translate-y-full translate-x-1/3"
        >
          <svg
            class="w-full h-full"
            viewBox="0 0 48 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMaxYMin slice"
          >
            <path
              d="M47.2727 26L0 0L47.2727 2.05717e-06V26Z"
              :fill="pathFill"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

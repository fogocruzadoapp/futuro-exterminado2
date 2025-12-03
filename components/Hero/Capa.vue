<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRandomImages } from '~/composables/useRandomImages';
import config from '~/data/config.json';

// Emite evento para o componente pai
const emit = defineEmits(['start-intro']);

// Função para iniciar o fluxo de introdução
const startIntro = () => {
  // Após 0.5 segundos, emite o evento para fechar o componente
  emit('start-intro');
};

// Obtém imagens aleatórias sem repetição
const { getRandomImages, availableImages } = useRandomImages();

// Lista fixa para SSR (evita problemas de hidratação)
const fixedImages = [
  '/images/vitimas/vitima1.png',
  '/images/vitimas/vitima2.png',
  '/images/vitimas/vitima3.png',
  '/images/vitimas/vitima4.png',
  '/images/vitimas/vitima5.png',
];

// Usa imagens fixas para evitar problemas de hidratação
const randomImages = fixedImages;

// Deslocamento padrão para todas as vítimas
const defaultIntensity = 60;

// URL do vídeo de introdução vinda do arquivo de configuração
const introVideoUrl = config.introVideoUrl || '';
const showIntroVideo = Boolean(config.showIntroVideo && introVideoUrl);

// Configuração de animação automática para cada vítima
const animationConfig = {
  vitima1: { duration: 8000, delay: 0, intensity: defaultIntensity },
  vitima2: { duration: 7000, delay: 1000, intensity: defaultIntensity },
  vitima3: { duration: 9000, delay: 2000, intensity: defaultIntensity },
  vitima4: { duration: 6000, delay: 1500, intensity: defaultIntensity },
  vitima5: { duration: 10000, delay: 3000, intensity: defaultIntensity },
};

// Estados para controlar as animações
const animationStates = ref({
  vitima1: { x: 0, y: 0 },
  vitima2: { x: 0, y: 0 },
  vitima3: { x: 0, y: 0 },
  vitima4: { x: 0, y: 0 },
  vitima5: { x: 0, y: 0 },
});

// Função para gerar posição aleatória
const getRandomPosition = (intensity) => ({
  x: (Math.random() - 0.5) * intensity,
  y: (Math.random() - 0.5) * intensity,
});

// Função para animar uma vítima com movimento contínuo
const animateVictim = (victimKey, config) => {
  let currentTarget = { x: 0, y: 0 };
  let nextTarget = getRandomPosition(config.intensity);

  const animate = () => {
    // Move para a próxima posição aleatória
    currentTarget = nextTarget;
    animationStates.value[victimKey] = currentTarget;

    // Gera próxima posição aleatória
    nextTarget = getRandomPosition(config.intensity);

    // Reinicia a animação continuamente
    setTimeout(animate, config.duration);
  };

  // Inicia após o delay
  setTimeout(animate, config.delay);
};

// Função para obter o transform de uma vítima
const getVictimTransform = (victimKey) => {
  const state = animationStates.value[victimKey];
  return `translate(${state.x}px, ${state.y}px)`;
};

// Executa quando o componente é montado
onMounted(() => {
  // Inicia as animações de todas as vítimas
  Object.keys(animationConfig).forEach((victimKey) => {
    animateVictim(victimKey, animationConfig[victimKey]);
  });
});
</script>

<template>
  <section
    class="absolute top-0 left-0 min-h-screen h-screen w-screen min-w-screen z-[49] bg-blue-800 overflow-hidden transition-opacity duration-[500ms] ease-out"
  >
    <div class="relative min-h-screen min-w-screen">
      <!-- Conteúdo -->
      <div
        class="flex flex-col items-center justify-center gap-8 md:gap-0 md:justify-between py-12 px-5 mx-auto container min-h-screen z-20 relative"
      >
        <!-- Logo Fogo Cruzado -->
        <figure>
          <img src="~/assets/images/logo-fogo-cruzado.png" class="w-[172px]" />
        </figure>
        <!-- Logo Intro  -->
        <div
          v-if="!showIntroVideo"
          class="flex flex-col items-center justify-center md:gap-6 w-full"
        >
          <SvgoLogoHorizontal
            class="md:w-[800px] md:h-[80px] max-w-full text-white text-shadow-2xl"
            :fontControlled="false"
          />
          <div class="text-white text-lg w-full text-center text-shadow-2xl">
            Crianças e adolescentes estão na linha de tiro. Conheça os dados e
            histórias que não podem ser esquecidas.
          </div>
        </div>
        <!--  Video Intro -->
        <FeatureVideoPlayerYoutube
          v-if="showIntroVideo"
          :url="introVideoUrl"
          class="w-full max-w-4xl"
        />
        <!-- Botão Iniciar -->
        <div
          class="flex flex-col items-center justify-center gap-4 relative z-40"
        >
          <div @click="startIntro" class="cursor-pointer">
            <UiButton> Iniciar </UiButton>
          </div>
          <div
            class="text-white text-sm md:w-full w-2/3 text-center md:text-left"
          >
            Use fones de ouvido para uma experiência mais imersiva
          </div>
        </div>
      </div>

      <!-- Background Texture Pattern -->
      <div class="absolute inset-0 opacity-100 z-10">
        <svg
          viewBox="0 0 1920 1080"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-full h-full"
        >
          <defs>
            <pattern
              id="texture-pattern-stats"
              patternUnits="userSpaceOnUse"
              width="1920"
              height="1080"
            >
              <image
                href="@/assets/images/texture/model1.png"
                x="0"
                y="0"
                width="1920"
                height="1080"
                preserveAspectRatio="none"
              />
            </pattern>
          </defs>
          <rect
            width="1920"
            height="1080"
            fill="url(#texture-pattern-stats)"
            opacity="0.3"
            style="mix-blend-mode: multiply"
          />
        </svg>
      </div>

      <!-- Vitimas -->
      <div class="absolute w-full h-full inset-0 z-10 opacity-50">
        <!-- Vitimas 1 -->
        <div
          class="absolute top-0 -translate-y-10 left-0 w-[300px] md:w-[400px] transition-transform duration-[3000ms] ease-in-out will-change-transform"
          :style="{ transform: getVictimTransform('vitima1') }"
        >
          <UiFigure
            :image-src="randomImages[0]"
            alt="Vítima"
            :rotation="-5"
            cut-type="default"
          />
        </div>
        <!-- Vitimas 2 -->
        <div
          class="absolute md:bottom-10 bottom-0 md:left-20 left-0 w-[200px] md:w-[256px] transition-transform duration-[3000ms] ease-in-out will-change-transform"
          :style="{ transform: getVictimTransform('vitima2') }"
        >
          <UiFigure
            :image-src="randomImages[1]"
            alt="Vítima"
            :rotation="5"
            cut-type="type1"
          />
        </div>
        <!-- Vitimas 3 -->
        <div
          class="absolute md:top-1/2 top-32 md:right-1/2 right-0 transform md:translate-x-1/2 md:-translate-y-1/2 w-[200px] md:w-[400px] transition-transform duration-[3000ms] ease-in-out will-change-transform"
          :style="{ transform: getVictimTransform('vitima3') }"
        >
          <UiFigure
            :image-src="randomImages[2]"
            alt="Vítima"
            :rotation="5"
            cut-type="type2"
          />
        </div>
        <!-- Vitimas 4 -->
        <div
          class="absolute top-0 right-0 w-[128px] md:w-[256px] transition-transform duration-[3000ms] ease-in-out will-change-transform"
          :style="{ transform: getVictimTransform('vitima4') }"
        >
          <UiFigure
            :image-src="randomImages[3]"
            alt="Vítima"
            :rotation="5"
            cut-type="type3"
          />
        </div>
        <!-- Vitimas 5-->
        <div
          class="absolute bottom-0 right-0 w-[250px] md:w-[400px] transition-transform duration-[3000ms] ease-in-out will-change-transform"
          :style="{ transform: getVictimTransform('vitima5') }"
        >
          <UiFigure
            :image-src="randomImages[4]"
            alt="Vítima"
            :rotation="5"
            cut-type="type4"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<template>
  <!-- Slider Container -->
  <div
    ref="sliderRef"
    class="relative w-full overflow-hidden flex flex-col gap-8"
  >
    <!-- Slider Track -->
    <div
      class="flex"
      :class="{
        'slider-transition': isTransitioning,
      }"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <!-- Original slides -->
      <div
        v-for="(item, index) in items"
        :key="index"
        class="w-full flex-shrink-0"
      >
        <FeatureSliderCard
          :type="item.type"
          :nome="item.nome"
          :descricao="item.descricao"
          :localidade="item.localidade"
          :thumbnail="item.thumbnail"
          :video-url="item.videoUrl"
          :is-active="currentIndex === index"
          :key="`card-${index}-${currentIndex}`"
        />
      </div>
    </div>

    <!-- Navigation Arrows (only show if more than 1 item) -->
    <template v-if="items.length > 1">
      <!-- Navigation Container -->
      <div class="flex justify-center items-center gap-2 z-30">
        <!-- Previous Arrow -->
        <button
          @click="goToPrevious"
          :disabled="isAnimating || currentIndex === 0"
          :class="{
            'bg-amber-500 hover:bg-yellow-300 hover:bg-opacity-70 cursor-pointer':
              !isAnimating && currentIndex > 0,
            'bg-gray-400  opacity-50 cursor-not-allowed': isAnimating || currentIndex === 0,
          }"
          class="h-11 w-11 bg-opacity-50 text-white flex items-center justify-center transition-all duration-200 ease-in-out"
          aria-label="Slide anterior"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12.707 16.4141L6 9.70703L10.3496 5.35742L10.7969 6.25293L10.7969 4.91016L12.707 3L14.1211 4.41406L8.82812 9.70703L10.8486 11.7266L9.79687 12.2529L11.374 12.2529L14.1211 15L12.707 16.4141Z"
              fill="#24195D"
            />
          </svg>
        </button>

        <!-- Next Arrow -->
        <button
          @click="goToNext"
          :disabled="isAnimating || currentIndex === items.length - 1"
          :class="{
            'bg-amber-500 hover:bg-yellow-300 hover:bg-opacity-70 cursor-pointer':
              !isAnimating && currentIndex < items.length - 1,
            'bg-gray-400 cursor-not-allowed opacity-50': isAnimating || currentIndex === items.length - 1,
          }"
          class="h-11 w-11 bg-opacity-50 text-white flex items-center justify-center transition-all duration-200 ease-in-out"
          aria-label="Próximo slide"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M7.41406 3L14.1211 9.70703L10.5752 13.2529L8.79687 13.2529L9.98242 13.8457L7.41406 16.4141L6 15L11.293 9.70703L8.49121 6.90625L9.79687 6.25293L7.83887 6.25293L6 4.41406L7.41406 3Z"
              fill="#24195D"
            />
          </svg>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: (value) => {
      return (
        Array.isArray(value) &&
        value.length > 0 &&
        value.every(
          (item) =>
            item &&
            typeof item.type === 'number' &&
            typeof item.nome === 'string' &&
            typeof item.descricao === 'string' &&
            typeof item.localidade === 'string' &&
            typeof item.thumbnail === 'string' &&
            typeof item.videoUrl === 'string',
        )
      );
    },
  },
});

// Estado do slider (começa no primeiro slide)
const currentIndex = ref(0);
const isTransitioning = ref(true);
const isAnimating = ref(false);
const sliderRef = ref(null);

// Função para forçar fechamento de todos os vídeos
const closeAllVideos = () => {
  // Dispara evento customizado para fechar todos os vídeos
  window.dispatchEvent(new CustomEvent('closeAllVideos'));
};

// Sistema de detecção de visibilidade
const isSliderVisible = ref(true);
let scrollTimeout = null;

const checkSliderVisibility = () => {
  if (!sliderRef.value) return;

  const rect = sliderRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Considera visível se pelo menos 30% do slider está na tela
  const sliderHeight = rect.bottom - rect.top;
  const visibleHeight =
    Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  const visibilityRatio = visibleHeight / sliderHeight;

  const isVisible = visibilityRatio > 0.3;

  if (isSliderVisible.value && !isVisible) {
    // Slider saiu da tela, fecha todos os vídeos
    closeAllVideos();
  }

  isSliderVisible.value = isVisible;
};

// Listener de scroll com debounce para performance
const handleScroll = () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(() => {
    checkSliderVisibility();
  }, 100); // Debounce de 100ms
};

// Funções de navegação sem loop infinito
const goToNext = () => {
  // Previne cliques múltiplos durante animação ou se já está no último slide
  if (isAnimating.value || currentIndex.value >= props.items.length - 1) return;

  // Fecha todos os vídeos antes de mudar de slide
  closeAllVideos();

  isAnimating.value = true;
  currentIndex.value++;

  // Libera após a transição
    setTimeout(() => {
      isAnimating.value = false;
    }, 1500);
};

const goToPrevious = () => {
  // Previne cliques múltiplos durante animação ou se já está no primeiro slide
  if (isAnimating.value || currentIndex.value <= 0) return;

  // Fecha todos os vídeos antes de mudar de slide
  closeAllVideos();

  isAnimating.value = true;
  currentIndex.value--;

  // Libera após a transição
    setTimeout(() => {
      isAnimating.value = false;
    }, 1500);
};

// Lifecycle hooks
onMounted(() => {
  // Adiciona listener de scroll
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Verifica visibilidade inicial
  setTimeout(() => {
    checkSliderVisibility();
  }, 100);
});

onUnmounted(() => {
  // Remove listener de scroll
  window.removeEventListener('scroll', handleScroll);

  // Limpa timeout pendente
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
});
</script>

<style scoped>
.slider-transition {
  transition: transform 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>

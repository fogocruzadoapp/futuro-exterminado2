<template>
  <div class="relative w-full h-full bg-blue-1000 overflow-hidden">
    <!-- Etapa 1: Capa com Thumbnail -->
    <div
      v-if="currentStage === 'thumbnail'"
      class="absolute inset-0 w-full h-full cursor-pointer bg-blue-900"
      @click="startLoading"
    >
      <figure class="relative h-full w-full">
        <!-- Thumbnail -->
        <img
          v-if="!thumbnailError"
          :src="thumbnail"
          :alt="alt || 'Video thumbnail'"
          class="w-full h-full object-cover"
          style="filter: grayscale(100%) brightness(70%)"
          @error="onThumbnailError"
          @load="onThumbnailLoad"
        />

        <!-- Filtro com gradiente e noise -->
        <div
          class="absolute top-0 left-0 w-full h-full mix-blend-color"
          style="
            background: linear-gradient(
              180deg,
              rgba(29, 12, 7, 0.5) 0%,
              rgba(255, 173, 51, 0.5) 100%
            );
          "
        ></div>
        <div
          class="absolute top-0 left-0 w-full h-full mix-blend-multiply"
          style="background: url('/images/texture/noise.png')"
        ></div>
      </figure>

      <!-- Overlay com botão play -->
      <div
        class="absolute inset-0 bg-opacity-30 flex items-center justify-center"
      >
        <div
          class="bg-yellow-300 bg-opacity-90 h-12 w-12 flex items-center justify-center hover:bg-opacity-100 transition-all duration-300 transform hover:scale-110"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.16602 2.5L15.8327 10L4.16602 17.5V2.5Z"
              stroke="#24195D"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Etapa 2: Loading -->
    <div
      v-if="currentStage === 'loading'"
      class="absolute inset-0 w-full h-full bg-blue-1000 flex flex-col items-center justify-center"
    >
      <!-- SVG de loading -->
      <svg
        class="w-20 h-20"
        version="1.1"
        id="L9"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enable-background="new 0 0 0 0"
        xml:space="preserve"
      >
        <path
          fill="#FFAD33"
          d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="1s"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>

    <!-- Etapa 3: Video Player -->
    <div
      v-if="currentStage === 'playing'"
      class="absolute inset-0 w-full h-full"
      :class="{ 'bg-black': isFullscreen }"
    >
      <!-- Botão de fechar -->
      <button
        @click="closeVideo"
        class="absolute top-0 right-0 z-30 bg-yellow-300 w-12 h-12 flex items-center justify-center bg-opacity-50 hover:bg-opacity-70 text-white p-2 transition-all duration-200 cursor-pointer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.0049 8.52246L12.5312 5.99609L13.5859 7.89648L11.4775 10.0049L18 16.5283L16.5283 18L13.1475 14.6299L10.0049 8.96094V11.4775L3.47168 18L2 16.5283L8.52246 10.0049L2 3.47168L3.47168 2L10.0049 8.52246ZM18 3.47168L14.1816 7.30078V4.34668L16.5283 2L18 3.47168Z"
            fill="#24195D"
          />
        </svg>
      </button>

      <!-- Video -->
      <video
        ref="videoRef"
        :src="videoUrl"
        :class="
          isFullscreen
            ? 'w-full h-full object-contain'
            : 'w-full h-full object-cover'
        "
        autoplay
        @loadeddata="onVideoLoaded"
        @timeupdate="onTimeUpdate"
        @ended="onVideoEnded"
        @play="onVideoPlay"
        @pause="onVideoPause"
      />

      <!-- Controles do Player -->
      <div
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
      >
        <!-- Primeira linha: Controles principais -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <!-- Play/Pause -->
            <button
              @click="togglePlayPause"
              class="text-white hover:text-gray-300 transition-colors cursor-pointer"
            >
              <svg
                v-if="isPlaying"
                width="12"
                height="16"
                viewBox="0 0 12 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 16V4.93871e-07H0V16H4Z" fill="#FFAD33" />
                <path
                  d="M11.988 10.8633H10.5L12 6.8572V1.24848e-05L8.01207 0L8.00004 16L11.988 16V10.8633Z"
                  fill="#FFAD33"
                />
              </svg>
              <svg
              v-else
                width="13"
                height="15"
                viewBox="0 0 13 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13 7.5L0 15V0L13 7.5ZM0.00683594 7.71875V11.7969L2.29102 7.71875H0.00683594Z"
                  fill="#FFAD33"
                />
              </svg>
            </button>
            <!-- Tempo -->
            <div class="text-white text-sm">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </div>
          </div>

          <!-- Controles da direita -->
          <div class="flex items-center gap-4">
            <!-- Mute/Unmute -->
            <button
              @click="toggleMute"
              class="text-white hover:text-gray-300 transition-colors cursor-pointer"
            >
              <svg
                v-if="isMuted"
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.9388 7.11091L14.9995 6.05025L19.9492 11L18.8886 12.0607L13.9388 7.11091Z"
                  fill="#FFAD33"
                />
                <path
                  d="M15.0601 12.0104L13.9995 10.9497L18.9492 6L20.0099 7.06066L15.0601 12.0104Z"
                  fill="#FFAD33"
                />
                <path
                  d="M12 18L5.14258 13.54L0 13.5V5.40039L5.14258 5.44043L12 0V18ZM6.0752 6.61523L5.89258 6.75977V12.2383L5.96094 12.2832L10.5 15.2344V3.10449L6.0752 6.61523ZM1.5 12.0107L4.39258 12.0332V6.93457L1.5 6.91211V12.0107Z"
                  fill="#FFAD33"
                />
              </svg>
              <svg
                v-else
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="equalizer-muted -translate-y-0.5"
              >
                <!-- Barra 1 (esquerda) -->
                <path
                  d="M4 18L4 6L2 6L2 18L4 18Z"
                  fill="#FFAD33"
                  class="bar bar-1"
                />
                <!-- Barra 2 (centro) -->
                <path
                  d="M10 18L10 2L8 2L8 18L10 18Z"
                  fill="#FFAD33"
                  class="bar bar-2"
                />
                <!-- Barra 3 (direita) -->
                <path
                  d="M16 18L16 8L14 8L14 18L16 18Z"
                  fill="#FFAD33"
                  class="bar bar-3"
                />
              </svg>
            </button>

            <!-- Fullscreen -->
            <button
              @click="toggleFullscreen"
              class="text-white hover:text-gray-300 transition-colors cursor-pointer"
            >
              <svg
                v-if="isFullscreen"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 16H8V19H10V14H5V16ZM8 8H5V10H10V5H8V8ZM14 19H16V16H19V14H14V19ZM16 8V5H14V10H19V8H16Z"
                  fill="#FFAD33"
                />
              </svg>
              <svg
                v-else
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 14H5V19H10V17H7V14ZM5 10H7V7H10V5H5V10ZM17 17H14V19H19V14H17V17ZM14 5V7H17V10H19V5H14Z"
                  fill="#FFAD33"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Segunda linha: Barra de progresso -->
        <div class="w-full mt-2 select-none">
          <div
            ref="barRef"
            class="relative w-full h-1 bg-white/30 rounded-full cursor-pointer"
            @pointerdown="onBarPointerDown"
            @pointermove="onBarPointerMove"
            @pointerup="onBarPointerUp"
            @pointerleave="onBarPointerUp"
          >
            <!-- Barra de progresso -->
            <div
              class="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-100 pointer-events-none"
              :style="{ width: progress + '%' }"
            ></div>

            <!-- Thumb (bolinha) -->
            <div
              class="absolute top-1/2 w-2 h-2 bg-yellow-300 rounded-full transform -translate-y-1/2 transition-all duration-100 hover:scale-125 pointer-events-none"
              :style="{ left: 'calc(' + progress + '% - 6px)' }"
            ></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

// Data
const barRef = ref(null)

const props = defineProps({
  thumbnail: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Estados do componente
const currentStage = ref('thumbnail');
const loadingProgress = ref(0);
const videoRef = ref(null);
const thumbnailError = ref(false);

// Estados do player
const isPlaying = ref(false);
const isMuted = ref(false);
const isFullscreen = ref(false);
const isDragging = ref(false);
const currentTime = ref(0);
const duration = ref(0);

// Computed
const progress = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

// Funções
const clamp01 = (v) => Math.max(0, Math.min(1, v))

function seekFromClientX(clientX) {
  if (!videoRef.value || !barRef.value || !isFinite(duration.value) || duration.value === 0) return
  const rect = barRef.value.getBoundingClientRect()
  const p = clamp01((clientX - rect.left) / rect.width)
  const t = p * duration.value
  videoRef.value.currentTime = t
  currentTime.value = t
}

function onBarPointerDown(e) {
  if (!barRef.value) return
  isDragging.value = true
  barRef.value.setPointerCapture?.(e.pointerId)
  seekFromClientX(e.clientX)
}

function onBarPointerMove(e) {
  if (!isDragging.value) return
  seekFromClientX(e.clientX)
}

function onBarPointerUp(e) {
  if (!isDragging.value) return
  isDragging.value = false
  barRef.value?.releasePointerCapture?.(e.pointerId)
}

// Funções de controle das etapas
const startLoading = () => {
  currentStage.value = 'loading';
  loadingProgress.value = 0;

  // Cria um vídeo temporário para carregar
  const tempVideo = document.createElement('video');
  tempVideo.src = props.videoUrl;
  tempVideo.preload = 'metadata';

  // Event listeners para progresso real
  tempVideo.addEventListener('loadstart', () => {
    loadingProgress.value = 10;
  });

  tempVideo.addEventListener('progress', () => {
    if (tempVideo.buffered.length > 0) {
      const bufferedEnd = tempVideo.buffered.end(tempVideo.buffered.length - 1);
      const duration = tempVideo.duration;
      if (duration > 0) {
        loadingProgress.value = Math.min(90, (bufferedEnd / duration) * 100);
      }
    }
  });

  tempVideo.addEventListener('canplay', () => {
    loadingProgress.value = 100;
    setTimeout(() => {
      currentStage.value = 'playing';
      if (videoRef.value) {
        videoRef.value.load();
      }
    }, 500);
  });

  tempVideo.addEventListener('error', () => {
    // Se der erro, força o carregamento
    loadingProgress.value = 100;
    setTimeout(() => {
      currentStage.value = 'playing';
      if (videoRef.value) {
        videoRef.value.load();
      }
    }, 500);
  });

  // Inicia o carregamento
  tempVideo.load();
};

const closeVideo = () => {
  // Pausa o vídeo se estiver reproduzindo
  if (videoRef.value && !videoRef.value.paused) {
    videoRef.value.pause();
  }

  // Reseta os estados
  isPlaying.value = false;
  currentTime.value = 0;

  // Volta para o thumbnail
  currentStage.value = 'thumbnail';
};

// Funções do player
const togglePlayPause = () => {
  if (!videoRef.value) return;

  if (isPlaying.value) {
    videoRef.value.pause();
    isPlaying.value = false;
  } else {
    videoRef.value
      .play()
      .then(() => {
        isPlaying.value = true;
      })
      .catch(() => {
        // Erro ao reproduzir vídeo
      });
  }
};

const toggleMute = () => {
  if (!videoRef.value) return;

  videoRef.value.muted = !videoRef.value.muted;
  isMuted.value = videoRef.value.muted;
};

const toggleFullscreen = () => {
  if (!videoRef.value) return;

  if (!document.fullscreenElement) {
    videoRef.value.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
};

// Event handlers do video
const onVideoLoaded = () => {
  duration.value = videoRef.value.duration;

  // Garante que o vídeo não esteja mutado
  if (videoRef.value) {
    videoRef.value.muted = false;
    isMuted.value = false;

    // Inicia a reprodução automaticamente
    videoRef.value
      .play()
      .then(() => {
        isPlaying.value = true;
      })
      .catch(() => {
        // Erro ao reproduzir vídeo automaticamente
      });
  }
};

const onTimeUpdate = () => {
  if (!isDragging.value) {
    currentTime.value = videoRef.value.currentTime;
  }
};

const onVideoEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0;
};

const onVideoPlay = () => {
  isPlaying.value = true;
};

const onVideoPause = () => {
  isPlaying.value = false;
};

// Listeners para fullscreen
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
};

// Watcher para fechar vídeo quando slide não está ativo
watch(
  () => props.isActive,
  (newValue) => {
    if (!newValue && currentStage.value === 'playing') {
      closeVideo();
    }
  },
);

// Listener para evento global de fechar todos os vídeos
const handleCloseAllVideos = () => {
  if (currentStage.value === 'playing') {
    closeVideo();
  }
};

// Funções para thumbnail
const onThumbnailError = () => {
  thumbnailError.value = true;
};

const onThumbnailLoad = () => {
  thumbnailError.value = false;
};

// Utilitários
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  window.addEventListener('closeAllVideos', handleCloseAllVideos);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  window.removeEventListener('closeAllVideos', handleCloseAllVideos);
});
</script>

<style scoped>
/* Estilos customizados para a barra de progresso do YouTube */

/* Animação do equalizador quando mutado */
.equalizer-muted .bar {
  animation: equalizer-bounce 1s ease-in-out infinite;
  transform-origin: bottom;
}

.equalizer-muted .bar-1 {
  animation-delay: 0s;
}

.equalizer-muted .bar-2 {
  animation-delay: 0.3s;
}

.equalizer-muted .bar-3 {
  animation-delay: 0.6s;
}

@keyframes equalizer-bounce {
  0%,
  100% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
}
</style>

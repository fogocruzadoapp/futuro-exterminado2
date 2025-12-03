<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  videoSrc: {
    type: String,
    required: true,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  loop: {
    type: Boolean,
    default: true,
  },
  muted: {
    type: Boolean,
    default: true,
  },
  playsinline: {
    type: Boolean,
    default: true,
  },
  objectFit: {
    type: String,
    default: 'cover', // 'cover', 'contain', 'fill', 'scale-down'
  },
  className: {
    type: String,
    default: 'w-full h-full',
  },
  overlay: {
    type: Boolean,
    default: false,
  },
  overlayOpacity: {
    type: Number,
    default: 0.3,
  },
  delay: {
    type: Number,
    default: 0, // Delay em segundos
  },
});

const videoRef = ref(null);
const shouldPlay = ref(false);
let delayTimeout = null;

// Classes para object-fit
const objectFitClasses = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  'scale-down': 'object-scale-down',
};

// Função para iniciar o vídeo
const startVideo = () => {
  if (videoRef.value && props.autoplay) {
    videoRef.value.play().catch((error) => {
      /*       console.log('⚠️ Reprodução de vídeo bloqueada:', error); */
    });
  }
};

// Inicia o vídeo após o delay
const initVideoWithDelay = () => {
  if (props.delay > 0) {
    delayTimeout = setTimeout(() => {
      shouldPlay.value = true;
      startVideo();
    }, props.delay * 1000);
  } else {
    shouldPlay.value = true;
    startVideo();
  }
};

onMounted(() => {
  initVideoWithDelay();
});

onUnmounted(() => {
  if (delayTimeout) {
    clearTimeout(delayTimeout);
  }
});
</script>

<template>
  <!-- Overlay gradient -->
  <div
    class="absolute top-0 left-0 w-full h-full inset-0 pointer-events-none"
    style="
      background: linear-gradient(
        320deg,
        rgba(22, 15, 56, 0.25) 0%,
        rgba(16, 10, 45, 1) 75%,
        rgba(16, 10, 45, 1) 100%
      );
    "
  ></div>
  <div class="absolute top-0 left-0 w-full h-full -z-10">
    <div class="relative" :class="className">
      <video
        ref="videoRef"
        :src="props.videoSrc"
        :autoplay="shouldPlay && props.autoplay"
        :loop="props.loop"
        :muted="props.muted"
        :playsinline="props.playsinline"
        :class="['w-full h-full', objectFitClasses[props.objectFit]]"
        preload="auto"
      />

      <!-- Overlay opcional -->
      <div
        v-if="props.overlay"
        class="absolute inset-0 bg-black"
        :style="{ opacity: props.overlayOpacity }"
      />
    </div>
  </div>
</template>

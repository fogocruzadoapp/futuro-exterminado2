<template>
  <!-- Sinal de Scroll -->
  <div
    class="absolute bottom-2 left-1/2 -translate-x-1/2 w-[2px] h-24 z-30 transition-opacity duration-1000 ease-in-out"
    :class="{ 'opacity-0': !isScrollEnabled, 'opacity-100': isScrollEnabled }"
  >
    <!-- Gota principal -->
    <div
      class="absolute top-0 left-0 w-full h-full bg-yellow-300 rounded-full animate-drop"
    ></div>
  </div>
</template>

<script setup>
const props = defineProps({
  // Indica se o scroll está habilitado
  isScrollEnabled: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped>
/* Animação da gota principal - crescimento contínuo de cima para baixo */
@keyframes drop {
  0% {
    height: 0%;
    transform: translateY(0);
  }
  50% {
    height: 100%;
    transform: translateY(0);
  }
  100% {
    height: 0%;
    transform: translateY(0);
  }
}

.animate-drop {
  animation: drop 2s ease-in-out infinite;
}
</style>

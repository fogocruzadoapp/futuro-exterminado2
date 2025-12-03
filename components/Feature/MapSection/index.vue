<script setup>
import { ref, computed } from 'vue';

// Props para receber o scroll externo
const props = defineProps({
  scrollProgress: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0 && value <= 1,
  },
});

// Estado do estágio da animação do mapa baseado no scroll externo
const mapStage = computed(() => {
  const progress = props.scrollProgress;

  // Converte o progresso em estágio (0-4) com divisão em 4 partes iguais
  // Cada estágio ocupa 25% da seção
  if (progress < 0.25) {
    return 0; // Zero SVGs
  } else if (progress < 0.5) {
    return 1; // 1/4 dos SVGs
  } else if (progress < 0.75) {
    return 2; // 2/4 dos SVGs
  } else if (progress < 1) {
    return 3; // 3/4 dos SVGs
  } else {
    return 4; // Todos os SVGs
  }
});
</script>

<!-- components/Feature/MapSection/index.vue -->
<template>
  <section class="relative">
    <!-- Background fixo -->
    <div class="h-screen sticky top-0 min-h-screen w-full overflow-hidden">
      <FeatureMapSectionBackground :stage="mapStage" />
    </div>
    <slot />
  </section>
</template>

<script setup>
const estatisticaContainerRef = ref(null);
</script>

<!-- pages/introducao.vue -->
<template>
  <LayoutHeader />
  <main>
    <!-- Dados Estatisticos -->
    <section class="relative max-h-[8200px]">
      <!-- Animação Section Estatistica + Vitimas -->
      <div
        ref="estatisticaContainerRef"
        class="relative w-full h-[7220px] md:h-[6400px] md:-translate-y-0"
      >
        <!-- Grafico Estatistica -->
        <div class="sticky top-0 min-h-screen flex w-full my-40">
          <Estatistica
            :containerRef="estatisticaContainerRef"
            :stagesConfig="[
              { start: 0, end: 20, name: 'stage1' },
              { start: 20, end: 40, name: 'stage2' },
              { start: 40, end: 70, name: 'stage3' },
              { start: 70, end: 100, name: 'stage4' },
            ]"
          />
        </div>

        <!-- Animacao Cards Vitimas -->
        <div class="absolute top-0 left-0 w-full h-full z-20 overflow-hidden">
          <div
            class="flex flex-col container mx-auto items-center justify-center px-5 md:px-0 pt-[700px] pb-[180px] md:pt-[800px] md:pb-[800px]"
          >
            <EstatisticaVitimas />
          </div>
        </div>
      </div>

      <!-- Background Texture Pattern -->
      <FeatureTexturaSection :z-index="-10" />
    </section>
  </main>
</template>

<style scoped>
/* Círculo Feridos - Desktop */
@media (min-width: 768px) {
  .circle-feridos {
    width: var(--feridos-desktop-width) !important;
    height: var(--feridos-desktop-height) !important;
  }

  .circle-feridos-text {
    font-size: calc(var(--feridos-desktop-width) * 0.44) !important;
  }
}

/* Círculo Mortos - Desktop */
@media (min-width: 768px) {
  .circle-mortos {
    width: var(--mortos-desktop-width) !important;
    height: var(--mortos-desktop-height) !important;
  }

  .circle-mortos-text {
    font-size: calc(var(--mortos-desktop-width) * 0.35) !important;
  }
}
</style>

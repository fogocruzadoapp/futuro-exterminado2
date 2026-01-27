<template>
  <div class="flex flex-row gap-4 absolute right-8 bottom-5">
    <div class="flex gap-2">
      <UiIconBg 
        @click="$emit('zoom-in')"
        aria-label="Aumentar zoom do mapa"
      >
        <SvgoZoomin aria-hidden="true" />
      </UiIconBg>
      <UiIconBg 
        @click="$emit('zoom-out')"
        aria-label="Diminuir zoom do mapa"
      >
        <SvgoZoomout aria-hidden="true" />
      </UiIconBg>
    </div>
    <UiIconBg 
      @click="$emit('fullscreen')"
      :aria-label="isFullscreen ? 'Sair do modo tela cheia' : 'Entrar em modo tela cheia'"
    >
      <SvgoFullscreenout v-if="isFullscreen" aria-hidden="true" />
      <SvgoFullscreenin v-else aria-hidden="true" />
    </UiIconBg>
  </div>
</template>

<script setup>
defineProps({
  disabled: Boolean,
  disableZoomIn: Boolean,
  disableZoomOut: Boolean,
  isFullscreen: Boolean,
});
</script>

<template>
  <div class="flex flex-row gap-4 absolute right-8 bottom-5">
    <div class="flex gap-2">
      <UiIconBg @click="$emit('zoom-in')">
        <SvgoZoomin />
      </UiIconBg>
      <UiIconBg @click="$emit('zoom-out')">
        <SvgoZoomout />
      </UiIconBg>
    </div>
    <UiIconBg @click="$emit('fullscreen')">
      <SvgoFullscreenout v-if="isFullscreen" />
      <SvgoFullscreenin v-else />
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

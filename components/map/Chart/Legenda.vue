<template>
  <div class="flex items-center gap-4 flex-row">
    <div
      v-for="item in items"
      :key="item.key"
      class="flex items-center gap-1 flex-row"
    >
      <span
        class="rounded-full w-3 h-3 flex items-center justify-center"
        :class="item.color"
      ></span>
      <span class="text-xs text-base-600">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: false,
    default: () => [
      { key: 'feridas', label: 'feridas', color: 'bg-violet/85' },
      { key: 'mortas', label: 'mortas', color: 'bg-coral/85' },
    ],
  },
});
</script>

<style scoped>
/* Estilos específicos para a legenda, se necessário */
</style>

<template>
  <button
    :class="[
      'flex items-center justify-center ease-in-out bg-yellow cursor-pointer text-blue-dark hover:bg-yellow/80 transition-colors duration-200 bg-yellow-300 text-blue-dark w-8 h-8',
    ]"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'small'].includes(value),
  },
});
</script>

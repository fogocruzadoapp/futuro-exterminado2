<template>
  <button
    :class="[
      'flex items-center justify-center ease-in-out bg-yellow cursor-pointer text-blue-dark hover:bg-yellow/80 transition-colors duration-200',
      size === 'small' ? 'w-5 h-5' : 'w-10 h-10',
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

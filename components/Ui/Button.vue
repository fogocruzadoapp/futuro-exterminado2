<template>
  <button
    :class="[
      'ui-button flex ease-in-out cursor-pointer transition-colors duration-200 p-3 leading-none flex-row gap-2 items-center justify-center font-medium',
      size === 'small'
        ? 'px-2 py-1 text-sm'
        : size === 'big'
        ? 'px-4 py-2 text-lg min-w-[160px] md:min-w-[256px]'
        : 'px-2 py-2',

      getButtonClasses(),
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'small', 'big'].includes(value),
  },
  type: {
    type: String,
    default: 'default',
    validator: (value) =>
      ['default', 'primary', 'secondary', 'outline'].includes(value),
  },
});

const emit = defineEmits(['click']);

const getButtonClasses = () => {
  const baseClasses = 'w-fit h-fit';

  switch (props.type) {
    case 'primary':
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    case 'secondary':
      return `${baseClasses} bg-gray-200 text-gray-700 hover:bg-gray-300`;
    case 'outline':
      return `${baseClasses} bg-transparent text-yellow-300 border-2 border-yellow-300 hover:bg-yellow-300 hover:text-white`;
    default:
      return `${baseClasses} bg-yellow-300 text-blue-900 hover:bg-yellow-100 border hover:border-yellow-300 border-transparent  inside-border`;
  }
};
</script>

<style>
@reference "@/assets/css/global.css";

.ui-button svg {
  @apply translate-y-[1px];
}
</style>

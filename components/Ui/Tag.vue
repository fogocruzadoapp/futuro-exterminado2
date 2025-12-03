<template>
  <div
    v-if="removable"
    class="tag"
    @click="$emit('remove')"
    :aria-label="`Remover ${text}`"
  >
    <span>{{ text }}</span>
    <button>
      <SvgoClose class="w-3 h-3" :fontControlled="false" />
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  removable: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['remove']);
</script>

<style scoped>
@reference "@/assets/css/global.css";
.tag {
  @apply bg-yellow-300 transition-all duration-200 ease-in-out  flex items-center cursor-pointer  border-2 border-yellow-300;

  span {
    @apply flex-1 bg-white text-blue-900 px-2 py-1  transition-all duration-200 ease-in-out  leading-none;
  }
  button {
    @apply min-w-5 min-h-5 w-5 h-5 flex items-center justify-center cursor-pointer;
  }
  &:hover {
    @apply bg-yellow-100;
    span {
      @apply bg-transparent;
    }
  }
}
</style>

<template>
  <Transition name="background">
    <div
      v-if="showMenuContent"
      class="fixed top-0 left-0 w-full h-full z-20 pointer-events-none"
    >
      <div
        class="absolute top-0 left-0 w-full h-full flex items-center bg-[#160F38]"
      ></div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  showMenuContent: Boolean,
});
</script>

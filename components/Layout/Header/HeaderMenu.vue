<template>
  <section
    v-if="isOpen"
    class="fixed top-0 left-0 w-full bg-red-white text-black z-40 h-full flex justify-center items-center"
  >
    <div class="relative w-full h-full">
      <Transition name="fade">
        <div
          v-if="showMenuContent"
          class="relative z-50 p-8 text-white w-full h-full flex flex-col items-center justify-center"
        >
          <LayoutMenu />
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  showMenuContent: Boolean,
});
</script>

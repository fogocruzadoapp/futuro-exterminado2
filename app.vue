<script setup>
  const { progress, isLoading, start } = useLoadingIndicator({
    duration: 2000,
    throttle: 200,
    estimatedProgress: (duration, elapsed) => (2 / Math.PI * 100) * Math.atan(elapsed / duration * 100 / 50),
  });
  start({ force: true })
</script>
<template>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
  <div class="fixed z-50 top-0 left-0 flex flex-col justify-center items-center bg-blue-1000 text-white p-4 w-full h-full" v-if="isLoading">
    <div class="w-8 h-8 rounded-full border-4 border-white border-l-transparent animate-spin"></div>
  </div>
</template>
<style scoped>
  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
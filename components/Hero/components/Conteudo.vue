<script setup>
const props = defineProps({
  start: { type: Boolean, default: false },
});
</script>
<template>
  <div
    class="container relative px-5 flex flex-col mx-auto min-h-screen z-20"
  >
    <div
      class="md:w-1/2 gap-4 w-full min-h-screen flex flex-col justify-center"
    >
      <div class="min-w-full opacity-0 transition-all duration-3000 delay-6000"
        :style="{ opacity: props.start ? 1 : 0, translateY: props.start ? '0' : '3rem' }"
      >
        <SvgoLogoVertical
          class="md:h-[160px] h-full min-w-full md:min-w-[470px] text-white text-shadow-2xl"
          :fontControlled="false"
        />
      </div>
      <div class="text-white text-2xl md:text-4xl text-shadow-2xl opacity-0 transition-all duration-3000 delay-7000"
      :style="{ opacity: props.start ? 1 : 0, translateY: props.start ? '0' : '3rem' }"
      >
        Uma plataforma que mapeia dados e preserva histórias que não podem ser
        esquecidas
      </div>
    </div>
  </div>
</template>

<script setup>
// Props para cor personalizável
const props = defineProps({
  color: {
    type: String,
    default: '#F6F2F7', // cor padrão
  },
});

// Estilos dinâmicos
const bgStyle = computed(() => ({
  backgroundColor: props.color,
  borderColor: props.color,
}));
const pathFill = computed(() => props.color);
</script>

<template>
  <!-- Painel -->
  <div class="flex flex-row h-fit relative">
    <!--  Col Esquerda -->
    <div class="md:min-w-16 min-w-5 flex flex-col -mr-[1px]">
      <!-- Bloco 1 -->
      <div :style="bgStyle" class="w-full min-h-[200px] -mb-[1px]"></div>
      <!-- Bloco 2 - Com corte negativo -->
      <div
        :style="bgStyle"
        class="w-full md:h-[62px] h-[20px]"
        style="
          clip-path: polygon(
            0 2.4%,
            82.5% 51.4%,
            0 51.4%,
            0 100%,
            100% 100%,
            100% 0%,
            0 0%
          );
        "
      ></div>
      <!-- Bloco 3 -->
      <div :style="bgStyle" class="w-full flex-1 -my-[1px]"></div>
      <!-- Bloco 4 - Com corte diagonal -->
      <div
        :style="bgStyle"
        class="w-full md:h-[62px] h-[20px]"
        style="
          clip-path: polygon(0 0%, 100% 0%, 100% 100%, 98.4% 100%, 0% 2.2%);
        "
      ></div>
    </div>
    <!--  Col Centro -->
    <div :style="bgStyle" class="md:py-12 py-8 md:px-4 px-2 flex-1 max-w-[calc(100%-2.5rem)]">
      <slot />
    </div>
    <!--  Col Direita -->
    <div class="md:min-w-16 min-w-5 flex flex-col -ml-[1px]">
      <!-- Bloco 1 - Com corte negativo -->
      <div
        :style="bgStyle"
        class="w-full md:h-[62px] h-[20px]"
        style="clip-path: polygon(0% 0%, 100% 61.3%, 100% 100%, 0% 100%)"
      ></div>
      <!-- Bloco 2 -->
      <div
        :style="bgStyle"
        class="w-full flex-1 border border-inner -my-[1px]"
      ></div>
      <!-- Bloco 3 - Com corte negativo -->
      <div
        :style="bgStyle"
        class="w-full md:h-[65px] h-[20px]"
        style="
          clip-path: polygon(
            50% 0%,
            100% 30%,
            100% 30%,
            0% 30%,
            100% 90%,
            100% 101%,
            0% 101%,
            0% 0%
          );
        "
      ></div>
      <!-- Bloco 4 -->
      <div :style="bgStyle" class="w-full flex-1 border -mt-[1px]"></div>
    </div>

    <!-- Fragmento 1 de SVG -->
    <div
      class="absolute bottom-0 left-0 w-[30px] h-[16px] md:w-[59px] md:h-[32px] translate-y-full -translate-x-1/3"
    >
      <svg
        class="w-full h-full"
        viewBox="0 0 59 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMax slice"
      >
        <path
          d="M1.39876e-06 32L58.1818 0L0 2.54321e-06L1.39876e-06 32Z"
          :fill="pathFill"
        />
      </svg>
    </div>
    <!-- Fragmento 2 de SVG -->
    <div
      class="absolute top-0 right-0 w-[24px] h-[13px] md:w-[48px] md:h-[26px] -translate-y-full translate-x-1/3"
    >
      <svg
        class="w-full h-full"
        viewBox="0 0 48 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMin slice"
      >
        <path d="M47.2727 26L0 0L47.2727 2.05717e-06V26Z" :fill="pathFill" />
      </svg>
    </div>
  </div>
</template>

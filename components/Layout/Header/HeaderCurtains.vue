<template>
  <Transition name="curtain">
    <div
      v-if="isOpen"
      class="fixed top-0 left-0 w-full h-full z-30 pointer-events-none"
    >
      <div class="absolute top-0 left-0 w-full h-full flex items-center">
        <!-- Cortina esquerda -->
        <div
          class="absolute top-0 left-0 h-screen w-1/2 transition-transform duration-700 ease-in-out flex"
          :class="
            isAnimating
              ? 'translate-x-15 translate-y-1'
              : '-translate-x-[300%] md:-translate-x-[150%] xl:-translate-x-[200%]'
          "
        >
          <!-- SVG da cortina esquerda -->
          <svg
            viewBox="0 0 2210 812"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="h-full w-auto block absolute top-0 scale-105 -right-[450px]"
            style="display: block"
          >
            <defs>
              <pattern
                id="texture-pattern"
                patternUnits="userSpaceOnUse"
                width="2210"
                height="812"
              >
                <image
                  href="@/assets/images/texture/model1.png"
                  x="221"
                  y="0"
                  width="1768"
                  height="812"
                  preserveAspectRatio="none"
                />
              </pattern>
            </defs>
            <path
              d="M0 812L7.09873e-05 -0.000193204L1527 -5.97098e-05L1836.84 175L1638 175L1798.65 264L1551 264L2210 636L1883.87 636L1977 687L1872.2 687L2093 812L0 812Z"
              fill="#7D0099"
            />
            <path
              d="M0 812L7.09873e-05 -0.000193204L1527 -5.97098e-05L1836.84 175L1638 175L1798.65 264L1551 264L2210 636L1883.87 636L1977 687L1872.2 687L2093 812L0 812Z"
              fill="url(#texture-pattern)"
              opacity="0.3"
              style="mix-blend-mode: multiply"
            />
          </svg>
        </div>
        <!-- Cortina direita -->
        <div
          class="absolute top-0 right-0 h-screen w-1/2 transition-transform duration-700 ease-in-out flex"
          :class="
            isAnimating
              ? '-translate-x-15'
              : 'translate-x-[300%] md:translate-x-[150%] xl:translate-x-[200%]'
          "
        >
          <!-- SVG da cortina direita -->
          <svg
            viewBox="0 0 2210 812"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="h-full w-auto block absolute top-0 scale-105 -left-[450px]"
            style="display: block"
          >
            <defs>
              <pattern
                id="texture-pattern"
                patternUnits="userSpaceOnUse"
                width="2210"
                height="812"
              >
                <image
                  href="@/assets/images/texture/model1.png"
                  x="552.5"
                  y="0"
                  width="1105"
                  height="812"
                  preserveAspectRatio="none"
                />
              </pattern>
            </defs>
            <path
              d="M2210 0V812H683L373.164 637H572L411.348 548H659L0 176H326.131L233 125H337.803L117 0H2210Z"
              fill="#7D0099"
            />
            <path
              d="M2210 0V812H683L373.164 637H572L411.348 548H659L0 176H326.131L233 125H337.803L117 0H2210Z"
              fill="url(#texture-pattern)"
              opacity="0.3"
              style="mix-blend-mode: multiply"
            />
          </svg>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  isAnimating: Boolean,
});
</script>

<script setup>
const props = defineProps({
  percentLoaded: { type: Number, default: 0 },
  loaded: { type: Boolean, default: false },
});
const animatedPercent = ref(0);
let animationFrame;
let animationStartTime = 0;
const animationDuration = 500;
let startValue = 0;
let targetValue = 0;

const animatePercent = (timestamp) => {
  if (!animationStartTime) animationStartTime = timestamp;
  const progress = Math.min(
    (timestamp - animationStartTime) / animationDuration,
    1,
  );

  // Ease out function for smooth deceleration
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const easedProgress = easeOut(progress);

  // Calculate current value based on start and target values
  const currentValue = startValue + (targetValue - startValue) * easedProgress;
  animatedPercent.value = Math.floor(currentValue);

  if (progress < 1) {
    animationFrame = requestAnimationFrame(animatePercent);
  } else {
    animatedPercent.value = targetValue;
  }
};

watch(
  () => props.percentLoaded,
  (newVal, oldVal) => {
    if (newVal > 0) {
      startValue = animatedPercent.value;
      targetValue = newVal;
      animationStartTime = 0;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(animatePercent);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
});

const percentCalc = computed(() => animatedPercent.value);
</script>
<template>
  <div
    style="z-index: 50"
    class="loading-wrapper flex flex-col justify-center items-center min-h-screen text-white z-50 absolute top-0 left-0 w-full h-full transition-all duration-2000 delay-1000 ease-in-out"
    :class="loaded ? 'opacity-0 translate-y-[100px]' : ''"
  >
    <div class="flex flex-col justify-center items-center gap-2">
      <!-- Porcentagem -->
      <div class="text-7xl font-extrabold font-bigShoulders">
        {{ percentCalc }}%
      </div>

      <!-- Barra de Progresso -->
      <div
        class="w-[350px] md:w-[512px] h-6 overflow-hidden border-2 border-white"
      >
        <div
          class="h-full bg-yellow-300 transition-all duration-500 ease-linear"
          :style="{ width: `${percentCalc}%` }"
        ></div>
      </div>

      <!-- Texto -->
      <div>carregando...</div>
    </div>
  </div>
</template>

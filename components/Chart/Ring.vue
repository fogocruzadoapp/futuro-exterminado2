<template>
  <div ref="containerRef" class="flex flex-col items-center gap-6">
    <!-- Anel da Categoria -->
    <div class="relative" :class="props.sizeClass">
      <svg class="w-full h-full" viewBox="0 0 420 420">
        <!-- Anel de fundo -->
        <circle
          cx="210"
          cy="210"
          r="201"
          fill="none"
          stroke="#160f38"
          stroke-width="18"
        />
        <!-- Anel - Mortos (vermelho/coral) -->
        <circle
          v-if="mortos > 0 && total > 0"
          cx="210"
          cy="210"
          r="201"
          fill="none"
          stroke="#ec6775"
          stroke-width="18"
          :stroke-dasharray="`${mortosPTotal * 1239} 1239`"
          stroke-dashoffset="0"
          transform="rotate(-90 210 210)"
          class="transition-all duration-700 ease-in-out"
        />
        <!-- Anel - Feridos (roxo) -->
        <circle
          v-if="feridos > 0 && total > 0"
          cx="210"
          cy="210"
          r="201"
          fill="none"
          stroke="#a64dff"
          stroke-width="18"
          :stroke-dasharray="`${feridosPTotal * 1239} 1239`"
          :stroke-dashoffset="`-${mortosPTotal * 1239}`"
          transform="rotate(-90 210 210)"
          class="transition-all duration-700 ease-in-out"
        />
      </svg>

      <!-- Texto central -->
      <div
        class="absolute inset-0 flex flex-col text-white justify-center items-center text-center"
      >
        <div class="font-extrabold font-bigShoulders text-5xl md:text-7xl">
          {{ Math.round(animatedPorcentagem) }}%
        </div>
        <div
          class="font-bigShoulders text-2xl md:text-3xl transition-opacity duration-500 ease-in-out"
          :class="{
            'opacity-0': !isTextVisible,
            'opacity-100': isTextVisible,
          }"
          v-html="currentText"
        ></div>
      </div>
    </div>
    <!-- Labels inferiores -->
    <div class="flex gap-8">
      <!-- Mortos -->
      <div class="flex items-center gap-2 text-coral text-sm">
        <span> {{ mortos }} mortos </span>
      </div>
      <!-- Feridos -->
      <div class="flex items-center gap-2 text-violet text-sm">
        <span> {{ feridos }} feridos </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from 'vue';

const props = defineProps({
  feridos: { type: Number, required: true },
  mortos: { type: Number, required: true },
  totalGeral: { type: Number, required: true },
  porcentagem: { type: [Number, String], required: true },
  corFeridos: { type: String, default: '#8B5CF6' },
  corMortos: { type: String, default: '#FF6B6B' },
  backgroundOpacity: { type: [Number, String], default: 0.2 },
  sizeClass: { type: String, default: 'w-16 h-16' },
  texto: { type: String, default: 'DAS VÍTIMAS ERAM<br />MENINOS' },
});

// Valor animado da porcentagem
const animatedPorcentagem = ref(0);

// Estado para controlar a animação do texto
const isTextVisible = ref(true);
const currentText = ref(props.texto);

// Referência do container para Intersection Observer
const containerRef = ref(null);

// Estado para controlar se o elemento já foi animado
const hasAnimated = ref(false);

// Converte porcentagem para número
const targetPorcentagem = computed(() => {
  return typeof props.porcentagem === 'string'
    ? parseFloat(props.porcentagem)
    : props.porcentagem;
});

const mortosPTotal = computed(() => props.mortos / props.totalGeral);
const feridosPTotal = computed(() => props.feridos / props.totalGeral);

const total = computed(() => props.feridos + props.mortos);

// Função para animar o texto com fade
const animateText = (newText) => {
  // Fade out
  isTextVisible.value = false;

  setTimeout(() => {
    // Muda o texto quando está invisível
    currentText.value = newText;

    // Fade in
    setTimeout(() => {
      isTextVisible.value = true;
    }, 50); // Pequeno delay para garantir que o texto mudou
  }, 250); // Metade da duração da transição CSS
};

// Função de animação com progressão mais natural
const animateToTarget = () => {
  const startValue = animatedPorcentagem.value;
  const endValue = targetPorcentagem.value;
  const duration = 1500; // 1.5 segundos para uma animação mais rápida
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function mais suave - começa rápido e desacelera muito no final
    const easeOutCubic = 1 - Math.pow(1 - progress, 4);

    animatedPorcentagem.value =
      startValue + (endValue - startValue) * easeOutCubic;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

// Intersection Observer para animar quando entrar na tela (apenas primeira vez)
onMounted(() => {
  if (!containerRef.value) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated.value) {
          hasAnimated.value = true;
          animateToTarget();
        }
      });
    },
    {
      threshold: 0.3, // Anima quando 30% do elemento estiver visível
      rootMargin: '0px 0px -50px 0px', // Anima um pouco antes de entrar completamente
    },
  );

  observer.observe(containerRef.value);

  // Cleanup
  onBeforeUnmount(() => {
    observer.disconnect();
  });
});

// Watch para executar animação quando qualquer valor mudar
watch(
  () => [props.porcentagem, props.feridos, props.mortos, props.texto],
  (newValues, oldValues) => {
    // Anima o texto se mudou
    if (oldValues && newValues[3] !== oldValues[3]) {
      animateText(props.texto);
    }

    // Executa a animação do valor atual para o novo valor
    nextTick(() => {
      animateToTarget();
    });
  },
);
</script>

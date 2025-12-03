<template>
  <div class="absolute inset-0 flex items-center justify-center">
    <ChartRing
      :feridos="currentStageData.feridos"
      :mortos="currentStageData.mortos"
      :total-geral="intro.vitimasCount"
      :porcentagem="currentStageData.percent"
      size-class="md:size-[420px] size-[368px]"
      :texto="currentStageData.texto"
    />
  </div>
</template>

<script setup>
// Imports e configs
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

// Data
const currentStage = ref(0);
const intro = inject('introStats');

// Props
const props = defineProps({
  containerRef: {
    type: Object,
    default: null,
  },
  // Configuração personalizada dos stages (opcional)
  stagesConfig: {
    type: Array,
    default: () => [
      { start: 0, end: 20, name: 'stage1' },
      { start: 20, end: 40, name: 'stage2' },
      { start: 40, end: 70, name: 'stage3' },
      { start: 70, end: 100, name: 'stage4' },
    ],
  },
});

// Computeds
// Dados do stage atual
const currentStageData = computed(() => {
  if (!intro) {
    return {
      feridos: 0,
      mortos: 0,
      percent: 0,
      texto: 'Carregando...',
    };
  }

  const stageConfigs = [
    {
      feridos: intro.menino?.feridos || 0,
      mortos: intro.menino?.mortos || 0,
      percent: intro.menino?.percent || 0,
      texto: 'DAS VÍTIMAS ERAM<br />MENINOS',
    },
    {
      feridos: intro.operacao?.feridos || 0,
      mortos: intro.operacao?.mortos || 0,
      percent: intro.operacao?.percent || 0,
      texto: 'baleadas durante <br />operação policial',
    },
    {
      feridos: intro.balaPerdida?.feridos || 0,
      mortos: intro.balaPerdida?.mortos || 0,
      percent: intro.balaPerdida?.percent || 0,
      texto: 'Foram atingidas por<br />bala perdida',
    },
    {
      feridos: intro.casa?.feridos || 0,
      mortos: intro.casa?.mortos || 0,
      percent: intro.casa?.percent || 0,
      texto: 'foram baleadas<br />dentro de casa',
    },
  ];

  return stageConfigs[currentStage.value] || stageConfigs[0];
});

const totalStages = computed(() => props.stagesConfig.length);

// Função para detectar scroll e mudar o stage
const handleScroll = () => {
  // Se não temos o containerRef, não faz nada
  if (!props.containerRef) {
    return;
  }

  const containerRect = props.containerRef.getBoundingClientRect();
  const containerTop = containerRect.top;
  const containerHeight = containerRect.height;

  // Se o container não está visível, não faz nada
  if (containerTop > window.innerHeight || containerTop + containerHeight < 0) {
    return;
  }

  // Calcula o padding da seção (considerando mobile e desktop)
  const isMobile = window.innerWidth < 768;
  const paddingTop = isMobile ? 700 : 800; // pt-[700px] md:pt-[800px]
  const paddingBottom = isMobile ? 180 : 800; // pb-[180px] md:pb-[800px]
  const totalPadding = paddingTop + paddingBottom;

  // Área útil do container (altura total - padding)
  const usableHeight = containerHeight - totalPadding;

  // Ajusta o cálculo do progresso considerando o padding
  // Quando containerTop = 0: progresso = 0% (início)
  // Quando containerTop = -(containerHeight - paddingTop): progresso = 100% (fim da área útil)
  const progress = Math.abs(containerTop) / (usableHeight + paddingTop);

  // Converte progresso (0-1) para porcentagem (0-100)
  const progressPercent = Math.min(Math.max(progress * 100, 0), 100);

  let newStage = 0;

  // Se chegou no final (100% ou mais), fica no último stage
  if (progressPercent >= 100) {
    newStage = props.stagesConfig.length - 1;
  } else {
    // Verifica em qual stage estamos baseado na configuração personalizada
    for (let i = 0; i < props.stagesConfig.length; i++) {
      const stage = props.stagesConfig[i];
      if (progressPercent >= stage.start && progressPercent < stage.end) {
        newStage = i;
        break;
      }
    }
  }

  if (newStage !== currentStage.value) {
    currentStage.value = newStage;
  }
};

// Lifecycle hooks
onMounted(async () => {
  await nextTick();
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleScroll);
});
</script>

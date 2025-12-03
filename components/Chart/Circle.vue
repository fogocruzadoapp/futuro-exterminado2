<script setup>
import { computed } from 'vue';

// Props
const props = defineProps({
  situacaoFeridos: {
    type: Number,
    required: true,
  },
  situacaoMortos: {
    type: Number,
    required: true,
  },
});

// Configurações de tamanho máximo e mínimo dos círculos (px)
const maxSize = 100;
const minSize = 20;

// Calcula o total, convertendo para número para evitar NaN
const total = computed(() => {
  const feridos = Number(props.situacaoFeridos);
  const mortos = Number(props.situacaoMortos);
  return feridos + mortos;
});

// Calcula a % dos feridos, com proteção para total 0
const percentFeridos = computed(() => {
  const feridos = Number(props.situacaoFeridos);
  return total.value > 0 ? (feridos / total.value) * 100 : 0;
});

// Calcula a % dos mortos, com proteção para total 0
const percentMortos = computed(() => {
  const mortos = Number(props.situacaoMortos);
  return total.value > 0 ? (mortos / total.value) * 100 : 0;
});

// Arredonda as % para exibição, evitando NaN
const percentFeridosRounded = computed(() =>
  isNaN(percentFeridos.value) ? 0 : Math.round(percentFeridos.value),
);
const percentMortosRounded = computed(() =>
  isNaN(percentMortos.value) ? 0 : Math.round(percentMortos.value),
);

// Calcula tamanho proporcional dos círculos
const sizeFeridos = computed(() =>
  Math.max((percentFeridos.value / 100) * maxSize, minSize),
);
const sizeMortos = computed(() =>
  Math.max((percentMortos.value / 100) * maxSize, minSize),
);

// Calcula posicionamento das bolas para ficarem lado a lado com intersecção
const positionFeridos = computed(() => {
  const feridosSize = sizeFeridos.value;
  const mortosSize = sizeMortos.value;

  // Se só tem feridos, centraliza no container
  if (props.situacaoFeridos > 0 && props.situacaoMortos === 0) {
    const left = 50 - feridosSize / 2 / 3.2; // 50% do container (320px = 100%)
    const top = 50 - feridosSize / 2 / 1.28; // 50% do container (128px = 100%)
    return { left: left + '%', top: top + '%' };
  }

  // Calcula intersecção proporcional (30% do tamanho da menor bola)
  const minSize = Math.min(feridosSize, mortosSize);
  const overlap = minSize * 0.3;

  // Posiciona a bola dos feridos à esquerda (em pixels)
  const left = 160 - feridosSize / 2; // 160px é o centro do container
  // Centraliza verticalmente no centro do container
  const top = 50 - feridosSize / 2; // 50% do container

  return { left: left + 'px', top: top + '%' };
});

const positionMortos = computed(() => {
  const feridosSize = sizeFeridos.value;
  const mortosSize = sizeMortos.value;

  // Se só tem mortos, centraliza no container
  if (props.situacaoMortos > 0 && props.situacaoFeridos === 0) {
    const left = 50 - mortosSize / 2 / 3.2; // 50% do container (320px = 100%)
    const top = 50 - mortosSize / 2 / 1.28; // 50% do container (128px = 100%)
    return { left: left + '%', top: top + '%' };
  }

  // Calcula intersecção proporcional (30% do tamanho da menor bola)
  const minSize = Math.min(feridosSize, mortosSize);
  const overlap = minSize * 0.3;

  // Posiciona a bola dos mortos à direita, com intersecção (em pixels)
  const left = 160 + feridosSize / 2 - overlap; // 160px é o centro do container
  // Centraliza verticalmente no centro do container
  const top = 50 - mortosSize / 2; // 50% do container

  return { left: left + 'px', top: top + '%' };
});
</script>

<template>
  <div class="relative flex justify-center">
    <div class="w-full max-h-64 min-h-32 relative">
      <!-- Círculo Feridos -->
      <div
        v-if="props.situacaoFeridos > 0"
        class="absolute bg-violet/85 rounded-full flex justify-center items-center z-30"
        :style="{
          width: sizeFeridos + 'px',
          height: sizeFeridos + 'px',
          left: positionFeridos.left,
          top: positionFeridos.top,
        }"
      >
        <div class="text-white text-xl font-extrabold font-bigShoulders">
          {{ props.situacaoFeridos }}
        </div>
      </div>

      <!-- Círculo Mortos -->
      <div
        v-if="props.situacaoMortos > 0"
        class="absolute bg-coral/85 rounded-full flex justify-center items-center z-20"
        :style="{
          width: sizeMortos + 'px',
          height: sizeMortos + 'px',
          left: positionMortos.left,
          top: positionMortos.top,
        }"
      >
        <div class="text-white text-xl font-extrabold font-bigShoulders">
          {{ props.situacaoMortos }}
        </div>
      </div>
    </div>
  </div>
</template>

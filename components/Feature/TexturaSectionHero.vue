<template>
  <div
    class="absolute top-0 left-0 w-full h-full inset-0 z-50"
    :style="textureStyle"
  />
</template>

<script setup>
import { computed } from 'vue';

// Props para customização
const props = defineProps({
  // Imagem de textura
  textureImage: {
    type: String,
    default: '/images/texture/model1.png',
  },
  // Opacidade da textura
  opacity: {
    type: Number,
    default: 0.3,
  },
  // Modo de mistura (blend mode)
  blendMode: {
    type: String,
    default: 'multiply',
  },
  // Z-index customizável
  zIndex: {
    type: Number,
    default: 40,
  },
  // Tamanho da textura (para repetição)
  textureSize: {
    type: String,
    default: 'auto', // 'auto', 'cover', 'contain', ou valores específicos como '100px 100px'
  },
  // Repetição da textura
  repeat: {
    type: String,
    default: 'repeat', // 'repeat', 'no-repeat', 'repeat-x', 'repeat-y'
  },
  // Cor de fundo
  backgroundColor: {
    type: String,
    default: '#f1f1f1', // Cor de fundo por trás da textura
  },
});

// Calcula o estilo da textura
const textureStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
  backgroundImage: `url(${props.textureImage})`,
  backgroundSize: props.textureSize,
  backgroundRepeat: props.repeat,
  backgroundPosition: '0 0',
  opacity: props.opacity,
  mixBlendMode: props.blendMode,
  zIndex: props.zIndex,
}));
</script>

<style scoped>
/* Estilos específicos do componente se necessário */
</style>

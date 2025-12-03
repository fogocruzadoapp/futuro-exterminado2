<template>
  <!-- Botão unificado -->
  <div class="relative cursor-pointer z-20" @click="handleToggle">
    <!-- Botão de Filtro (quando showAside é false) -->
    <div v-if="!showAside">
      <UiIconBg class="relative z-20 mt-.5">
        <SvgoFilter />
      </UiIconBg>
      <div
        v-if="filtrosAtivos > 0"
        class="h-10 w-10 flex items-center justify-center translate-x-1 translate-y-1 absolute top-0 right-0 z-50"
      >
        <span
          class="text-yellow-300 absolute bottom-0 text-sm right-1 z-50 font-bigShoulders"
        >
          {{ filtrosAtivos }}
        </span>
        <div class="absolute right-0 bottom-0">
          <svg
            width="25"
            height="36"
            viewBox="0 0 25 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 36L25 0V36H0Z" fill="#574efc" />
          </svg>
        </div>
      </div>
    </div>
    <!-- Botão de Fechar (quando showAside é true) -->
    <div v-if="showAside">
      <UiIconBg class="relative z-50 mt-.5">
        <SvgoClose />
      </UiIconBg>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  showAside: {
    type: Boolean,
    default: false,
  },
  filtrosAtivos: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['toggle']);

const handleToggle = () => {
  // Emitir o evento toggle para o index.vue controlar
  emit('toggle');
};
</script>

<style scoped>
/* Estilos específicos do componente se necessário */
</style>

<template>
  <div class="w-16 flex-1 max-w-20 min-w-16 max-h-20 min-h-16 relative">
    <!-- Anel da Categoria com Pizza -->
    <svg
      class="w-16 h-16 absolute left-0 top-0 transition-all duration-300 ease-in-out"
      viewBox="0 0 64 64"
    >
      <!-- Anel de fundo -->
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="none"
        stroke="black"
        :opacity="backgroundOpacity"
        stroke-width="4"
        stroke-linecap="round"
      />
      <!-- Anel - Mortos -->
      <circle
        v-if="mortos > 0 && total > 0"
        cx="32"
        cy="32"
        r="30"
        fill="none"
        :stroke="corMortos"
        stroke-width="4"
        stroke-linecap="round"
        :stroke-dasharray="`${mortosPTotal * 188.5} 188.5`"
        stroke-dashoffset="0"
        transform="rotate(-90 32 32)"
        class="transition-all duration-300 ease-in-out"
      />
      <!-- Anel - Feridos -->
      <circle
        v-if="feridos > 0 && total > 0"
        cx="32"
        cy="32"
        r="30"
        fill="none"
        :stroke="corFeridos"
        stroke-width="4"
        stroke-linecap="round"
        :stroke-dasharray="`${feridosPTotal * 188.5} 188.5`"
        :stroke-dashoffset="`-${mortosPTotal * 188.5}`"
        transform="rotate(-90 32 32)"
        class="transition-all duration-300 ease-in-out"
      />
    </svg>
    <!-- Texto -->
    <div
      class="absolute inline-flex flex-col justify-center w-full h-full items-center z-20 -translate-y-0.5"
    >
      <div
        class="text-2xl font-extrabold font-bigShoulders flex justify-center items-center"
      >
        {{ total }}
      </div>
      <div
        class="flex justify-center items-center text-blue-300 text-xs font-light leading-none -translate-y-1"
      >
        {{ porcentagem }}%
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  feridos: { type: Number, required: true },
  mortos: { type: Number, required: true },
  totalGeral: { type: Number, required: true },
  porcentagem: { type: [Number, String], required: true },
  corFeridos: { type: String, default: '#8B5CF6' },
  corMortos: { type: String, default: '#FF6B6B' },
  backgroundOpacity: { type: [Number, String], default: 0.2 },
});

const mortosPTotal = computed(() => props.mortos / props.totalGeral);
const feridosPTotal = computed(() => props.feridos / props.totalGeral);

const total = computed(() => props.feridos + props.mortos);
</script>

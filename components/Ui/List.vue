<!-- components/Ui/List.vue -->
<template>
  <div class="space-y-3">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="flex items-start gap-3"
    >
      <!-- Bullet Point -->
      <div
        :class="['rounded-full flex-shrink-0 mt-3', bulletSize, bulletColor]"
      ></div>

      <!-- Conteúdo do item -->
      <div class="flex-1">
        <UiTypography
          :variant="itemVariant"
          :color="itemColor"
          :class="itemClass"
        >
          {{ item }}
        </UiTypography>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // Array de strings ou objetos com conteúdo dos itens
  items: {
    type: Array,
    required: true,
  },
  // Variante do texto dos itens
  itemVariant: {
    type: String,
    default: 'body3',
    validator: (value) =>
      [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'body1',
        'body2',
        'body3',
        'caption',
        'overline',
      ].includes(value),
  },
  // Cor do texto dos itens
  itemColor: {
    type: String,
    default: 'inherit',
    validator: (value) =>
      [
        'inherit',
        'white',
        'black',
        'gray',
        'yellow',
        'purple',
        'violet',
        'orange',
      ].includes(value),
  },
  // Classe adicional para os itens
  itemClass: {
    type: String,
    default: '',
  },
  // Tamanho do bullet point
  bulletSize: {
    type: String,
    default: 'w-1 h-1',
    validator: (value) =>
      ['w-1 h-1', 'w-2 h-2', 'w-3 h-3', 'w-4 h-4'].includes(value),
  },
  // Cor do bullet point
  bulletColor: {
    type: String,
    default: 'bg-white',
    validator: (value) =>
      [
        'bg-white',
        'bg-yellow-300',
        'bg-blue-400',
        'bg-orange',
        'bg-gray',
      ].includes(value),
  },
});
</script>

<style scoped>
/* Estilos específicos para a lista */
</style>

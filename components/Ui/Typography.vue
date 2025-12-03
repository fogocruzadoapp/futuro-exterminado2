<template>
  <component :is="component" :class="computedClasses" v-bind="$attrs">
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // Variante do texto (h1, h2, h3, h4, h5, h6, body1, body2, caption, etc.)
  variant: {
    type: String,
    default: 'body1',
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
        'subtitle1',
        'subtitle2',
      ].includes(value),
  },

  // Elemento HTML a ser renderizado
  component: {
    type: String,
    default: '',
  },

  // Alinhamento do texto
  align: {
    type: String,
    default: 'inherit',
    validator: (value) =>
      ['left', 'center', 'right', 'justify', 'inherit'].includes(value),
  },

  // Cor do texto
  color: {
    type: String,
    default: 'inherit',
    validator: (value) =>
      [
        'inherit',
        'primary',
        'secondary',
        'error',
        'warning',
        'info',
        'success',
        'white',
        'black',
        'gray',
        'blue',
        'yellow',
        'coral',
        'violet',
        'purple',
      ].includes(value),
  },

  // Se o texto deve ser em maiúsculas
  uppercase: {
    type: Boolean,
    default: false,
  },

  // Se o texto deve ser em negrito
  bold: {
    type: Boolean,
    default: false,
  },

  // Se o texto deve ser em itálico
  italic: {
    type: Boolean,
    default: false,
  },

  // Se o texto deve ser truncado
  noWrap: {
    type: Boolean,
    default: false,
  },

  // Classes CSS adicionais
  class: {
    type: String,
    default: '',
  },
});

// Define o elemento HTML baseado na variante se não foi especificado
const component = computed(() => {
  if (props.component) return props.component;

  const variantMap = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    body1: 'p',
    body2: 'p',
    body3: 'p',
    caption: 'span',
    overline: 'span',
    subtitle1: 'h6',
    subtitle2: 'h6',
  };

  return variantMap[props.variant] || 'span';
});

// Classes CSS computadas
const computedClasses = computed(() => {
  const classes = [];

  // Classes base da variante
  const variantClasses = {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bigShoulders font-extrabold leading-tight',
    h2: 'text-3xl md:text-4xl lg:text-5xl font-bigShoulders font-extrabold leading-tight',
    h3: 'text-2xl md:text-3xl lg:text-4xl font-bigShoulders font-bold leading-tight',
    h4: 'text-xl md:text-2xl lg:text-3xl font-bigShoulders font-bold leading-snug',
    h5: 'text-lg md:text-xl lg:text-2xl font-bigShoulders font-bold leading-snug',
    h6: 'text-base md:text-lg lg:text-xl font-bigShoulders font-bold leading-snug',
    body1: 'text-base font-host leading-relaxed',
    body2: 'text-sm font-host leading-relaxed',
    body3: 'text-lg font-host leading-relaxed',
    caption: 'text-xs font-host leading-normal',
    overline:
      'text-xs font-host font-medium uppercase tracking-widest leading-normal',
    subtitle1: 'text-lg font-host font-medium leading-relaxed',
    subtitle2: 'text-base font-host font-medium leading-relaxed',
  };

  classes.push(variantClasses[props.variant]);

  // Alinhamento
  if (props.align !== 'inherit') {
    classes.push(`text-${props.align}`);
  }

  // Cores
  const colorClasses = {
    inherit: '',
    primary: 'text-blue-600',
    secondary: 'text-violet',
    error: 'text-coral',
    warning: 'text-yellow-300',
    info: 'text-blue-200',
    success: 'text-green-500',
    white: 'text-white',
    black: 'text-black',
    gray: 'text-base-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-300',
    coral: 'text-coral',
    violet: 'text-violet',
    purple: 'text-blue-400',
  };

  if (colorClasses[props.color]) {
    classes.push(colorClasses[props.color]);
  }

  // Modificadores
  if (props.uppercase) classes.push('uppercase');
  if (props.bold) classes.push('font-bold');
  if (props.italic) classes.push('italic');
  if (props.noWrap) classes.push('truncate');

  // Classes adicionais
  if (props.class) classes.push(props.class);

  return classes.filter(Boolean).join(' ');
});

// Remove atributos do escopo do componente pai
defineOptions({
  inheritAttrs: false,
});
</script>

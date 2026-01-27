<template>
  <label :class="['ui-toggle', { 'ui-toggle--disabled': disabled }]">
    <input
      type="checkbox"
      :checked="modelValueProxy"
      :true-value="trueValue"
      :false-value="falseValue"
      :disabled="disabled"
      :id="toggleId"
      :name="name"
      :aria-label="props.ariaLabel ? computedAriaLabel : undefined"
      :aria-labelledby="props.ariaLabel ? undefined : labelId"
      role="switch"
      :aria-checked="modelValueProxy"
      @change="onChange"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      class="ui-toggle__input"
    />
    <span class="ui-toggle__label" :id="labelId">
      <slot>{{ props.label }}</slot>
    </span>
    <span class="ui-toggle__slider" aria-hidden="true"></span>
  </label>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: { type: [Boolean, String, Number], default: false },
  trueValue: { type: [String, Number, Boolean], default: true },
  falseValue: { type: [String, Number, Boolean], default: false },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: undefined },
  name: { type: String, default: undefined },
  label: { type: String, default: '' },
  ariaLabel: { type: String, default: undefined },
  ariaLabelledby: { type: String, default: undefined },
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);

// Gera um ID único se não fornecido
const toggleId = computed(() => {
  return props.id || `toggle-${Math.random().toString(36).substr(2, 9)}`;
});

const labelId = computed(() => {
  return `${toggleId.value}-label`;
});

const modelValueProxy = computed({
  get() {
    return props.modelValue === props.trueValue;
  },
  set(val) {
    emit('update:modelValue', val ? props.trueValue : props.falseValue);
  },
});

// Computa o aria-label dinâmico incluindo o estado quando há ariaLabel explícito
const computedAriaLabel = computed(() => {
  if (props.ariaLabel) {
    // Quando há ariaLabel, inclui o estado para melhor contexto
    return `${props.ariaLabel}, ${modelValueProxy.value ? 'ativado' : 'desativado'}`;
  }
  // Se não há ariaLabel, usa aria-labelledby que aponta para o label
  return undefined;
});

function onChange(e) {
  const newValue = e.target.checked ? props.trueValue : props.falseValue;
  emit('update:modelValue', newValue);
  emit('change', e);
}
</script>

<style scoped>
@reference "@/assets/css/global.css";

.ui-toggle {
  @apply relative flex items-center cursor-pointer gap-2;
  /* Garante que o label seja focável */
  position: relative;
}

.ui-toggle--disabled {
  @apply opacity-50 cursor-not-allowed;
}

.ui-toggle__input {
  /* Input invisível mas focável - cobre toda a área do toggle */
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  opacity: 0;
  z-index: 10;
  cursor: pointer;
  /* Garante que seja focável e clicável */
  pointer-events: auto;
}

.ui-toggle__input:focus-visible {
  /* Indicação visual de foco no slider */
  outline: none;
}

.ui-toggle__input:focus-visible ~ .ui-toggle__slider {
  /* Indicação visual de foco no slider */
  outline: 2px solid currentColor;
  outline-offset: 2px;
  border-radius: 9999px;
}

.ui-toggle__input:focus-visible ~ .ui-toggle__label {
  /* Indicação visual de foco no label */
  outline: 2px solid currentColor;
  outline-offset: 2px;
  border-radius: 0.25rem;
  padding: 2px;
}
.ui-toggle__slider {
  @apply min-w-8 min-h-5 w-8 h-5 relative bg-black/20 rounded-full transition-all;
  display: inline-block;
}
.ui-toggle__slider::before {
  @apply bg-yellow-300 w-4 h-4 absolute rounded-full top-0.5 duration-300 left-0.5 transition-all translate-x-0 ease-in-out;
  content: '';
}
.ui-toggle__input:checked ~ .ui-toggle__slider {
  @apply bg-blue-900;
}

.ui-toggle__input:checked ~ .ui-toggle__slider::before {
  @apply translate-x-[12px];
}
.ui-toggle__label {
  @apply text-base-600 text-sm font-sans;
  user-select: none;
}
</style>

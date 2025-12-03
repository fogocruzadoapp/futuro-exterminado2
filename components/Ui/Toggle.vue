<template>
  <label :class="['ui-toggle', { 'ui-toggle--disabled': disabled }]">
    <input
      type="checkbox"
      :checked="modelValueProxy"
      :true-value="trueValue"
      :false-value="falseValue"
      :disabled="disabled"
      :id="id"
      :name="name"
      @change="onChange"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      class="ui-toggle__input"
    />
    <span class="ui-toggle__label">
      <slot>{{ props.label }}</slot>
    </span>
    <span class="ui-toggle__slider"></span>
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
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);

const modelValueProxy = computed({
  get() {
    return props.modelValue === props.trueValue;
  },
  set(val) {
    emit('update:modelValue', val ? props.trueValue : props.falseValue);
  },
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
}
.ui-toggle--disabled {
  @apply opacity-50 cursor-not-allowed;
}
.ui-toggle__input {
  @apply absolute opacity-0 min-w-8 min-h-5 w-8 h-5 cursor-pointer;
  z-index: 1;
  top: 0;
  right: 0;
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

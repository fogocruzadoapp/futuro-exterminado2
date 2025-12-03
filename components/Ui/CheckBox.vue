<template>
  <label :class="['ui-checkbox', { 'ui-checkbox--disabled': disabled }]">
    <input
      type="checkbox"
      :checked="modelValueProxy"
      :value="value"
      :true-value="trueValue"
      :false-value="falseValue"
      :disabled="disabled"
      :id="id"
      :name="name"
      @change="onChange"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      class="ui-checkbox__input"
    />
    <span class="ui-checkbox__custom"></span>
    <span
      class="self-stretch justify-start text-blue-200 text-base font-normal leading-snug"
      ><slot
    /></span>
  </label>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: { type: [Boolean, Array, String, Number], default: false },
  value: { type: [String, Number, Boolean], default: undefined },
  trueValue: { type: [String, Number, Boolean], default: true },
  falseValue: { type: [String, Number, Boolean], default: false },
  disabled: { type: Boolean, default: false },
  id: { type: String, default: undefined },
  name: { type: String, default: undefined },
});

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);

const modelValueProxy = computed({
  get() {
    if (Array.isArray(props.modelValue)) {
      return props.modelValue.includes(props.value);
    }
    return props.modelValue === props.trueValue;
  },
  set(val) {
    if (Array.isArray(props.modelValue)) {
      let newValue = [...props.modelValue];
      if (val) {
        if (!newValue.includes(props.value)) newValue.push(props.value);
      } else {
        newValue = newValue.filter((v) => v !== props.value);
      }
      emit('update:modelValue', newValue);
    } else {
      emit('update:modelValue', val ? props.trueValue : props.falseValue);
    }
  },
});

function onChange(e) {
  modelValueProxy.value = e.target.checked;
  emit('change', e);
}
</script>

<style scoped>
@reference "@/assets/css/global.css";
.ui-checkbox {
  @apply flex items-center cursor-pointer gap-1.5;
}
.ui-checkbox--disabled {
  @apply opacity-5 cursor-not-allowed;
}
.ui-checkbox__input {
  @apply absolute opacity-0 w-0 h-0;
}
.ui-checkbox__custom {
  @apply w-4 h-4 rounded-full outline outline-1  relative outline-offset-[-1px] outline-yellow-300 inline-flex justify-center items-center gap-2.5;
  display: inline-block;
  position: relative;
  transition: border 0.2s, background 0.2s;
}
.ui-checkbox__input:checked + .ui-checkbox__custom {
  @apply bg-yellow-300;
}

.ui-checkbox__label {
  user-select: none;
}
</style>

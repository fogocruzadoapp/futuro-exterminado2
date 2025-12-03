<template>
  <div
    class="ui-input-wrapper relative min-w-full"
    :class="{ 'border-yellow-300': isFocused, 'border-blue': !isFocused }"
  >
    <input
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :name="name"
      :id="id"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      :minlength="minlength"
      :autofocus="autofocus"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @change="$emit('change', $event)"
      @keydown="$emit('keydown', $event)"
      @keyup="$emit('keyup', $event)"
      @keypress="$emit('keypress', $event)"
      class="ui-input"
    />
    <button
      v-if="modelValue && !disabled && !readonly"
      type="button"
      class="ui-input-clear absolute right-2 top-1/2 -translate-y-1/2 text-yellow-300 hover:text-yellow-300/80 focus:outline-none"
      @click="$emit('update:modelValue', '')"
      tabindex="-1"
      aria-label="Limpar campo"
    >
      <SvgoClose class="w-4 h-4" />
    </button>
    <span
      v-else
      class="ui-input-search absolute right-2 top-1/2 -translate-y-1/2 text-base-400 pointer-events-none"
    >
      <SvgoSearch class="w-4 h-4 text-yellow-300" />
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { SvgoClose, SvgoSearch } from '#components';

const isFocused = ref(false);

const props = defineProps({
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
  autocomplete: {
    type: String,
    default: '',
  },
  maxlength: {
    type: [Number, String],
    default: undefined,
  },
  minlength: {
    type: [Number, String],
    default: undefined,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
@reference "@/assets/css/global.css";
.ui-input-wrapper {
  @apply p-0 rounded-none transition-colors duration-150;
  position: relative;
  width: 100%;
}

.ui-input {
  @apply px-4 py-2 outline-none transition-colors duration-150 w-full flex items-center bg-indigo/20 text-blue-300 leading-none;
  padding-right: 2.5rem; /* espaço para o X/lupa */
}
.ui-input:focus {
  @apply text-white shadow;
}
.ui-input:disabled {
  @apply bg-base-100 text-base-400 cursor-not-allowed;
}
.ui-input-clear {
}
.ui-input-search {
  display: flex;
  align-items: center;
}
</style>

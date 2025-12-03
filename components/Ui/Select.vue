<template>
  <div class="ui-select relative normal-case" ref="selectRoot">
    <!-- Trigger -->
    <div
      class="ui-select__control w-fit flex items-center gap-2 z-20 justify-between cursor-pointer"
      :class="[
        { 'ui-select__control--open': isOpen },
        props.type === 'yellow'
          ? 'text-black bg-yellow-300 p-2 '
          : 'text-yellow-300',
      ]"
      @click="toggleDropdown"
      @keydown.enter.prevent="toggleDropdown"
      @keydown.space.prevent="toggleDropdown"
      @keydown.down.prevent="focusNextOption"
      @keydown.up.prevent="focusPrevOption"
      tabindex="0"
      :aria-expanded="isOpen.toString()"
      aria-haspopup="listbox"
    >
      <span class="truncate">
        <!-- Você controla o texto via slot (ex.: 'Alterar região') -->
        <slot name="label">
          {{ placeholder }}
        </slot>
      </span>
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="ui-select__dropdown font-host text-base absolute min-w-fit left-0 right-0 z-10 w-fit"
      :class="[
        dropdownDirection === 'up' ? 'bottom-full mb-2' : 'mt-1',
        props.type === 'yellow' ? 'bg-yellow-300/90' : 'bg-indigo/90',
      ]"
      role="listbox"
    >
      <div class="ui-select__scrollbox max-h-48 overflow-y-auto">
        <div
          v-for="(option, idx) in listOptions"
          :key="getKey(option) || '__placeholder'"
          class="ui-select__option px-4 py-2 cursor-pointer flex items-center justify-between"
          :class="[
            // foco via teclado (apenas cor de foco)
            { 'text-yellow-300': idx === focusedIndex && !isSelected(option) },
            // tema + hover
            props.type === 'yellow'
              ? 'hover:bg-yellow-300/60 hover:text-blue-900 text-blue-900'
              : 'hover:bg-blue/60 hover:text-yellow-300 text-white',
          ]"
          @click="selectOption(option)"
          @mouseenter="focusedIndex = idx"
          :aria-selected="isSelected(option).toString()"
          role="option"
          tabindex="-1"
        >
          <span class="text-nowrap">{{ getLabelOrPlaceholder(option) }}</span>
          <span v-if="isSelected(option)"><SvgoCheck /></span>
        </div>

        <div v-if="!listOptions.length" class="px-4 py-2 text-blue">
          Nenhuma opção
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Selecione uma opção',
  },
  optionLabelKey: {
    type: String,
    default: '',
  },
  optionValueKey: {
    type: String,
    default: '',
  },
  dropdownDirection: {
    type: String,
    default: 'down',
    validator: (v) => ['down', 'up'].includes(v),
  },
  // Se quiser exibir uma opção "vazia" no topo
  // (ex.: "Todos os estados"): passe defaultOptionLabel="Todos os estados"
  defaultOptionLabel: {
    type: String,
    default: undefined,
  },
  type: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'yellow'].includes(v),
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const focusedIndex = ref(-1)
const selectRoot = ref(null)

const getLabel = (option) =>
  props.optionLabelKey && typeof option === 'object'
    ? option[props.optionLabelKey]
    : option

const getValue = (option) =>
  props.optionValueKey && typeof option === 'object'
    ? option[props.optionValueKey]
    : option

const getKey = (option) => {
  if (option && option.__placeholder) return '__placeholder'
  return getValue(option)
}

const selectedLabel = computed(() => {
  const idx = props.options.findIndex((opt) =>
    isSameValue(getValue(opt), props.modelValue)
  )
  return idx !== -1 ? getLabel(props.options[idx]) : ''
})

// Agora a lista inclui o item selecionado (com ✔️) e,
// se houver defaultOptionLabel, injeta um "placeholder" no topo.
const listOptions = computed(() => {
  const base = [...props.options]
  const wantsPlaceholder =
    props.defaultOptionLabel !== undefined && props.defaultOptionLabel !== ''
  return wantsPlaceholder ? [{ __placeholder: true }, ...base] : base
})

function isSameValue(a, b) {
  return a === b || String(a) === String(b)
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    focusedIndex.value = -1
  }
}

function selectOption(option) {
  if (option && option.__placeholder) {
    selectPlaceholder()
    return
  }

  const firstOption = props.options[0]
  let value = getValue(option)

  // coerção de tipo para manter consistência
  if (
    typeof firstOption === 'number' ||
    (typeof firstOption === 'object' && typeof getValue(firstOption) === 'number')
  ) {
    value = Number(value)
  } else if (
    typeof firstOption === 'string' ||
    (typeof firstOption === 'object' && typeof getValue(firstOption) === 'string')
  ) {
    value = String(value)
  }

  emit('update:modelValue', value)
  isOpen.value = false
}

function selectPlaceholder() {
  emit('update:modelValue', '')
  isOpen.value = false
}

function isSelected(option) {
  if (option && option.__placeholder) {
    return props.modelValue === '' || props.modelValue === undefined
  }
  return isSameValue(getValue(option), props.modelValue)
}

function focusNextOption() {
  if (!isOpen.value) {
    isOpen.value = true
    focusedIndex.value = -1
    return
  }
  if (focusedIndex.value < listOptions.value.length - 1) {
    focusedIndex.value++
  }
}

function focusPrevOption() {
  if (!isOpen.value) {
    isOpen.value = true
    focusedIndex.value = listOptions.value.length - 1
    return
  }
  if (focusedIndex.value > -1) {
    focusedIndex.value--
  }
}

function handleKeydown(e) {
  if (!isOpen.value) return
  if (e.key === 'Enter') {
    if (focusedIndex.value >= 0 && focusedIndex.value < listOptions.value.length) {
      selectOption(listOptions.value[focusedIndex.value])
    }
  }
  if (e.key === 'Escape') {
    isOpen.value = false
  }
}

function handleClickOutside(event) {
  if (selectRoot.value && !selectRoot.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

watch(
  () => props.modelValue,
  () => {
    focusedIndex.value = -1
  }
)

function getLabelOrPlaceholder(option) {
  if (option && option.__placeholder) {
    return props.defaultOptionLabel ?? ''
  }
  return getLabel(option)
}
</script>

<style scoped>
.ui-select__control {
  transition: border 0.2s;
}
.ui-select__control--open {
  border-color: #6366f1;
}
.ui-select__dropdown {
  animation: fadeIn 0.15s;
}
.ui-select__scrollbox {
  max-height: 12rem;
  overflow-y: auto;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.ui-select__option {
  transition: background 0.15s, color 0.15s;
}
</style>
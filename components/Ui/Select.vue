<template>
  <div class="ui-select relative normal-case" ref="selectRoot">
    <label v-if="label && id" :for="id" :class="labelClass">
      {{ label }}
    </label>
    <!-- Trigger -->
    <button
      type="button"
      :id="id || undefined"
      class="ui-select__control w-fit flex items-center gap-2 z-20 justify-between cursor-pointer"
      :class="[
        { 'ui-select__control--open': isOpen },
        props.type === 'yellow'
          ? 'text-black bg-yellow-300 p-2 '
          : 'text-yellow-300',
      ]"
      @click="toggleDropdown"
      @keydown="handleControlKeydown"
      :aria-expanded="isOpen.toString()"
      aria-haspopup="listbox"
      :aria-label="ariaLabel || label || placeholder || undefined"
      role="combobox"
      :aria-controls="isOpen ? 'select-options' : undefined"
      :aria-activedescendant="
        focusedIndex >= 0 ? `select-option-${focusedIndex}` : undefined
      "
    >
      <span class="truncate" :aria-hidden="ariaLabel ? 'true' : undefined">
        <!-- Você controla o texto via slot (ex.: 'Alterar região') -->
        <slot name="label">
          {{ placeholder }}
        </slot>
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      id="select-options"
      class="ui-select__dropdown font-host text-base absolute min-w-fit left-0 right-0 z-10 w-fit"
      :class="[
        dropdownDirection === 'up' ? 'bottom-full mb-2' : 'mt-1',
        props.type === 'yellow' ? 'bg-yellow-300/90' : 'bg-indigo/90',
      ]"
      role="listbox"
    >
      <div class="ui-select__scrollbox max-h-48 overflow-y-auto" ref="scrollboxRef">
        <div
          v-for="(option, idx) in listOptions"
          :key="getKey(option) || '__placeholder'"
          :id="`select-option-${idx}`"
          :ref="(el) => setOptionRef(el, idx)"
          class="ui-select__option px-4 py-2 cursor-pointer flex items-center justify-between focus-visible:outline-2 focus-visible:outline-yellow-300 focus-visible:outline-offset-2"
          :class="[
            // foco via teclado
            {
              'text-yellow-300 bg-blue/60': idx === focusedIndex && !isSelected(option),
              'bg-yellow-300/60 text-blue-900':
                idx === focusedIndex &&
                !isSelected(option) &&
                props.type === 'yellow',
            },
            // tema + hover
            props.type === 'yellow'
              ? 'hover:bg-yellow-300/60 hover:text-blue-900 text-blue-900'
              : 'hover:bg-blue/60 hover:text-yellow-300 text-white',
          ]"
          @click="selectOption(option)"
          @mouseenter="focusedIndex = idx"
          :aria-selected="isSelected(option).toString()"
          role="option"
          :tabindex="idx === focusedIndex ? 0 : -1"
        >
          <span class="text-nowrap">{{ getLabelOrPlaceholder(option) }}</span>
          <span v-if="isSelected(option)"
            ><SvgoCheck aria-hidden="true"
          /></span>
        </div>

        <div v-if="!listOptions.length" class="px-4 py-2 text-blue">
          Nenhuma opção
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

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
  // aria-label para o controle (evita duplicação quando há botão dentro do slot)
  ariaLabel: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const focusedIndex = ref(-1);
const selectRoot = ref(null);
const scrollboxRef = ref(null);
const optionRefs = ref({});

const getLabel = (option) =>
  props.optionLabelKey && typeof option === 'object'
    ? option[props.optionLabelKey]
    : option;

const getValue = (option) =>
  props.optionValueKey && typeof option === 'object'
    ? option[props.optionValueKey]
    : option;

const getKey = (option) => {
  if (option && option.__placeholder) return '__placeholder';
  return getValue(option);
};

const selectedLabel = computed(() => {
  const idx = props.options.findIndex((opt) =>
    isSameValue(getValue(opt), props.modelValue),
  );
  return idx !== -1 ? getLabel(props.options[idx]) : '';
});

// Agora a lista inclui o item selecionado (com ✔️) e,
// se houver defaultOptionLabel, injeta um "placeholder" no topo.
const listOptions = computed(() => {
  const base = [...props.options];
  const wantsPlaceholder =
    props.defaultOptionLabel !== undefined && props.defaultOptionLabel !== '';
  return wantsPlaceholder ? [{ __placeholder: true }, ...base] : base;
});

function isSameValue(a, b) {
  return a === b || String(a) === String(b);
}

function toggleDropdown() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    focusedIndex.value = -1;
    // Quando abre, foca na primeira opção se houver
    nextTick(() => {
      if (listOptions.value.length > 0) {
        focusedIndex.value = 0;
        scrollToFocused();
      }
    });
  } else {
    focusedIndex.value = -1;
  }
}

function selectOption(option) {
  if (option && option.__placeholder) {
    selectPlaceholder();
    return;
  }

  const firstOption = props.options[0];
  let value = getValue(option);

  // coerção de tipo para manter consistência
  if (
    typeof firstOption === 'number' ||
    (typeof firstOption === 'object' &&
      typeof getValue(firstOption) === 'number')
  ) {
    value = Number(value);
  } else if (
    typeof firstOption === 'string' ||
    (typeof firstOption === 'object' &&
      typeof getValue(firstOption) === 'string')
  ) {
    value = String(value);
  }

  emit('update:modelValue', value);
  isOpen.value = false;
}

function selectPlaceholder() {
  emit('update:modelValue', '');
  isOpen.value = false;
}

function isSelected(option) {
  if (option && option.__placeholder) {
    return props.modelValue === '' || props.modelValue === undefined;
  }
  return isSameValue(getValue(option), props.modelValue);
}

// Função para definir refs das opções
const setOptionRef = (el, index) => {
  if (el) {
    optionRefs.value[index] = el;
  }
};

// Função para fazer scroll até a opção focada
const scrollToFocused = () => {
  if (focusedIndex.value >= 0 && optionRefs.value[focusedIndex.value]) {
    const optionEl = optionRefs.value[focusedIndex.value];
    const scrollbox = scrollboxRef.value;
    if (scrollbox && optionEl) {
      const optionRect = optionEl.getBoundingClientRect();
      const scrollboxRect = scrollbox.getBoundingClientRect();

      // Verifica se a opção está fora da área visível
      if (optionRect.top < scrollboxRect.top) {
        // Opção está acima da área visível
        scrollbox.scrollTop = optionEl.offsetTop - scrollbox.offsetTop;
      } else if (optionRect.bottom > scrollboxRect.bottom) {
        // Opção está abaixo da área visível
        scrollbox.scrollTop =
          optionEl.offsetTop -
          scrollbox.offsetTop -
          (scrollboxRect.height - optionRect.height);
      }

      // Foca no elemento para melhor navegação
      optionEl.focus();
    }
  }
};

function focusNextOption() {
  if (!isOpen.value) {
    isOpen.value = true;
    focusedIndex.value = -1;
    nextTick(() => {
      if (listOptions.value.length > 0) {
        focusedIndex.value = 0;
        scrollToFocused();
      }
    });
    return;
  }
  if (focusedIndex.value < listOptions.value.length - 1) {
    focusedIndex.value++;
    nextTick(() => {
      scrollToFocused();
    });
  } else {
    // Volta para o início se estiver no final
    focusedIndex.value = 0;
    nextTick(() => {
      scrollToFocused();
    });
  }
}

function focusPrevOption() {
  if (!isOpen.value) {
    isOpen.value = true;
    focusedIndex.value = listOptions.value.length - 1;
    nextTick(() => {
      scrollToFocused();
    });
    return;
  }
  if (focusedIndex.value > 0) {
    focusedIndex.value--;
    nextTick(() => {
      scrollToFocused();
    });
  } else {
    // Vai para o final se estiver no início
    focusedIndex.value = listOptions.value.length - 1;
    nextTick(() => {
      scrollToFocused();
    });
  }
}

// Handler de teclado no controle
function handleControlKeydown(e) {
  switch (e.key) {
    case 'Enter':
    case ' ':
      e.preventDefault();
      toggleDropdown();
      if (!isOpen.value && listOptions.value.length > 0) {
        nextTick(() => {
          focusedIndex.value = 0;
          scrollToFocused();
        });
      }
      break;
    case 'ArrowDown':
      e.preventDefault();
      focusNextOption();
      break;
    case 'ArrowUp':
      e.preventDefault();
      focusPrevOption();
      break;
    case 'Escape':
      if (isOpen.value) {
        e.preventDefault();
        isOpen.value = false;
        focusedIndex.value = -1;
      }
      break;
  }
}

function handleKeydown(e) {
  if (!isOpen.value) return;
  
  // Se o foco está em uma opção, permite navegação
  if (e.target && e.target.closest('.ui-select__option')) {
    const optionIndex = Array.from(
      e.target.closest('.ui-select__scrollbox')?.children || [],
    ).indexOf(e.target.closest('.ui-select__option'));
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex.value >= 0 && focusedIndex.value < listOptions.value.length) {
          selectOption(listOptions.value[focusedIndex.value]);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        focusNextOption();
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusPrevOption();
        break;
      case 'Home':
        e.preventDefault();
        focusedIndex.value = 0;
        nextTick(() => {
          scrollToFocused();
        });
        break;
      case 'End':
        e.preventDefault();
        focusedIndex.value = listOptions.value.length - 1;
        nextTick(() => {
          scrollToFocused();
        });
        break;
      case 'Escape':
        e.preventDefault();
        isOpen.value = false;
        focusedIndex.value = -1;
        // Retorna o foco para o botão
        const button = selectRoot.value?.querySelector('button');
        if (button) {
          button.focus();
        }
        break;
    }
  } else {
    // Handler global para Enter e Escape quando dropdown está aberto
    if (e.key === 'Enter' && focusedIndex.value >= 0) {
      if (focusedIndex.value < listOptions.value.length) {
        e.preventDefault();
        selectOption(listOptions.value[focusedIndex.value]);
      }
    }
    if (e.key === 'Escape') {
      isOpen.value = false;
      focusedIndex.value = -1;
    }
  }
}

function handleClickOutside(event) {
  if (selectRoot.value && !selectRoot.value.contains(event.target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
});

watch(
  () => props.modelValue,
  () => {
    focusedIndex.value = -1;
  },
);

function getLabelOrPlaceholder(option) {
  if (option && option.__placeholder) {
    return props.defaultOptionLabel ?? '';
  }
  return getLabel(option);
}
</script>

<style scoped>
.ui-select__control {
  transition: border 0.2s;
  /* Reset de estilos padrão do botão, mas permite que classes condicionais funcionem */
  border: none;
  background: transparent;
  padding: 0;
  font: inherit;
  color: inherit;
  text-align: inherit;
  outline: none;
}
.ui-select__control:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
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

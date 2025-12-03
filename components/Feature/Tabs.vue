<template>
  <div class="w-full">
    <!-- Container das Tabs -->
    <div class="overflow-x-auto w-full" style="max-width: calc(100vw - 5.5rem)">
      <nav class="flex space-x-0 min-w-max">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            tabColors.border,
            activeTab === tab.id
              ? `${tabColors.active.bg} ${tabColors.active.text}`
              : `${tabColors.inactive.text} ${tabColors.inactive.bg} ${tabColors.inactive.hover}`,
              'uppercase'
          ]"
          class="whitespace-nowrap"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Conteúdo das Tabs -->
    <div class="py-10">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        v-show="activeTab === tab.id"
        class="space-y-6"
      >
        <slot
          :name="`tab-${tab.id}`"
          :tab="tab"
          :isActive="activeTab === tab.id"
        >
          <!-- Fallback: se não houver slot, usa o conteúdo padrão -->
          <div v-if="tab.content" v-html="tab.content"></div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, useSlots } from 'vue';

const props = defineProps({
  // Tab inicial ativa (opcional)
  defaultTab: {
    type: String,
    default: '',
  },
  // Títulos personalizados para as tabs (opcional)
  tabLabels: {
    type: Object,
    default: () => ({}),
  },
  // Cores dos botões de navegação
  colors: {
    type: [Object, String],
    default: undefined, // Sem valor padrão para usar o modelo default
  },
});

const slots = useSlots();

// Modelos de cores pré-definidos
const colorModels = {
  default: {
    active: {
      bg: 'bg-base-200',
      text: 'text-blue-900',
    },
    inactive: {
      bg: 'hover:bg-yellow-100',
      text: 'text-blue-900',
      hover: 'hover:text-blue-900',
    },
    border: 'border-blue-900',
  },
  sobre: {
    active: {
      bg: 'bg-blue-1000/50',
      text: 'text-white',
    },
    inactive: {
      bg: 'hover:bg-yellow-100',
      text: 'text-white',
      hover: 'hover:text-white',
    },
    border: 'border-white',
  },
};

// Computed para gerenciar as cores
const tabColors = computed(() => {
  // Se não foi passada nenhuma prop, usa o modelo default
  if (
    !props.colors ||
    (typeof props.colors === 'object' && Object.keys(props.colors).length === 0)
  ) {
    return colorModels.default;
  }

  // Se foi passada uma string, busca o modelo correspondente
  if (typeof props.colors === 'string') {
    return colorModels[props.colors] || colorModels.default;
  }

  // Se foi passado um objeto, usa ele
  return props.colors;
});

// Detecta automaticamente as tabs baseado nos slots disponíveis
const tabs = computed(() => {
  const slotNames = Object.keys(slots).filter((name) =>
    name.startsWith('tab-'),
  );
  return slotNames.map((slotName) => {
    const id = slotName.replace('tab-', '');
    // Usa título personalizado se disponível, senão gera automaticamente
    const label =
      props.tabLabels[id] ||
      id
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .toUpperCase();
    return { id, label };
  });
});

// Estado da tab ativa
const activeTab = ref(props.defaultTab || tabs.value[0]?.id || '');

// Emit para quando a tab muda (opcional)
const emit = defineEmits(['tabChange']);

// Watcher para emitir mudanças
watch(
  () => activeTab.value,
  (newTab) => {
    emit('tabChange', newTab);
  },
);
</script>

<style scoped>
@reference "@/assets/css/global.css";
/* Estilos específicos para as tabs */

nav button {
  @apply whitespace-nowrap transition-all duration-200 px-6 w-full py-3 text-base font-extrabold font-bigShoulders ease-in-out cursor-pointer border-b-2 max-w-1/2;
}

/* Transição suave para mudança de conteúdo */
.space-y-6 {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

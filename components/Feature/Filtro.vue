<template>
  <div class="flex flex-col gap-2 py-10">
    <div class="flex items-center gap-4">
      <UiTypography variant="body1"
        >Selecione para filtrar os dados</UiTypography
      >
      <button
        v-if="mostrarBotaoLimpar"
        type="button"
        class="flex items-center gap-1 px-2 py-1 text-xs text-base-600 hover:text-red-400 hover:bg-red-50 cursor-pointer rounded-md transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-yellow-300 focus-visible:outline-offset-2"
        @click="limparFiltros"
        aria-label="Limpar todos os filtros"
      >
        <SvgoClose class="w-3 h-3" :fontControlled="false" aria-hidden="true" />
        <span>Limpar Todos</span>
      </button>
    </div>
    <!-- Controles de Filtro -->
    <div class="flex flex-row flex-wrap gap-2">
      <div
        v-for="filtro in filtrosConfig"
        :key="filtro.key"
        class="filter-group"
      >
        <UiSelect
          :id="`select-${filtro.key}`"
          v-model="model[filtro.key]"
          :options="filtro.options"
          :defaultOptionLabel="filtro.defaultOptionLabel"
          :placeholder="filtro.placeholder"
          :label="filtro.placeholder"
        >
          <template #label>
            <div
              class="text-blue-900 bg-yellow-300 p-2 flex gap-1 items-center hover:bg-yellow-300/80"
              aria-hidden="true"
            >
              {{ filtro.placeholder }}
              <SvgoDropdown aria-hidden="true" />
            </div>
          </template>
        </UiSelect>
      </div>
    </div>
    <!-- Tags de Filtros Aplicados -->
    <div v-if="filtrosAplicados" class="flex flex-wrap gap-2">
      <UiTag
        v-for="filtro in filtrosConfig.filter((f) => model[f.key] !== '')"
        :key="filtro.key"
        :text="`${filtro.placeholder} / ${model[filtro.key]}`"
        @remove="removerFiltro(filtro.key)"
      />
    </div>
  </div>
</template>

<script setup>
// Data
const filtrosConfig = [
  {
    key: 'operacaoAcaoPolicial',
    placeholder: 'Operação/Ação Policial',
    options: ['Sim', 'Não'],
    defaultOptionLabel: 'Todas',
  },
  {
    key: 'balaPerdida',
    placeholder: 'Bala perdida',
    options: ['Sim', 'Não'],
    defaultOptionLabel: 'Todas',
  },
  {
    key: 'dentroCasa',
    placeholder: 'Dentro de casa',
    options: ['Sim', 'Não'],
    defaultOptionLabel: 'Todas',
  },
  {
    key: 'situacao',
    placeholder: 'Situação',
    options: ['Morto', 'Ferido'],
    defaultOptionLabel: 'Todas',
  },
  {
    key: 'faixaEtaria',
    placeholder: 'Faixa etária',
    options: ['Criança (0-12)', 'Adolescente (13-17)'],
    defaultOptionLabel: 'Todas',
  },
  {
    key: 'racaCor',
    placeholder: 'Raça/cor',
    options: [
      'Branca',
      'Parda',
      'Negra',
      'Amarela',
      'Indígena',
      'Não identificado',
    ],
    defaultOptionLabel: 'Todas',
  },
  {
    key: 'genero',
    placeholder: 'Gênero',
    options: ['Menino', 'Menina', 'Não identificado'],
    defaultOptionLabel: 'Todos',
  },
];

// Computeds
// filtros aplicados
const filtrosAplicados = computed(() => {
  return filtrosConfig.some((filtro) => model.value[filtro.key] !== '');
});

// verificar se há mais de 2 filtros aplicados
const mostrarBotaoLimpar = computed(() => {
  const filtrosSelecionados = filtrosConfig.filter(
    (filtro) => model.value[filtro.key] !== '',
  );
  return filtrosSelecionados.length > 1;
});

// Métodos
const removerFiltro = (filtro) => {
  model.value[filtro] = '';
  emit('filtrar', { ...model.value });
};

const limparFiltros = () => {
  filtrosConfig.forEach((f) => {
    model.value[f.key] = '';
  });
  emit('limpar');
  emit('filtrar', { ...model.value });
};

// Emitir eventos
const emit = defineEmits(['filtrar', 'limpar']);

// Expor dados para o componente pai
const model = defineModel({
  type: Object,
  default: () => ({
    operacaoAcaoPolicial: '',
    balaPerdida: '',
    dentroCasa: '',
    situacao: '',
    faixaEtaria: '',
    racaCor: '',
    genero: '',
  }),
});
</script>

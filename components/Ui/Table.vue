<script setup>
// Props para receber os dados da tabela
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      tableHeaders: [],
      tableRows: [],
    }),
  },
  // Configurações opcionais
  striped: {
    type: Boolean,
    default: true,
  },
  hover: {
    type: Boolean,
    default: true,
  },
  // Classes customizadas
  tableClass: {
    type: String,
    default: '',
  },
  headerClass: {
    type: String,
    default: '',
  },
  rowClass: {
    type: String,
    default: '',
  },
  cellClass: {
    type: String,
    default: '',
  },
});

// Função para determinar alinhamento baseado no conteúdo
const getAlignment = (index, cell) => {
  // Se for a primeira coluna (índice 0), alinha à esquerda
  if (index === 0) return 'text-left';

  // Todas as outras colunas (índice > 0) alinham à direita
  return 'text-right';
};

// Função para formatar números
const formatNumber = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString('pt-BR');
  }
  return value;
};
</script>

<template>
  <div class="overflow-x-auto w-full">
    <table :class="['min-w-full bg-white', tableClass]">
      <!-- Cabeçalho -->
      <thead>
        <tr class="bg-base-300">
          <th
            v-for="(header, index) in data.tableHeaders"
            :key="index"
            :class="[
              'py-3 px-4 text-sm font-bold text-base-900',
              getAlignment(index, header),
              headerClass,
            ]"
          >
            {{ header }}
          </th>
        </tr>
      </thead>

      <!-- Corpo da tabela -->
      <tbody>
        <tr
          v-for="(row, rowIndex) in data.tableRows"
          :key="rowIndex"
          :class="[
            {
              'bg-base-100': striped && rowIndex % 2 === 1,
              'hover:bg-base-100': hover,
            },
            rowClass,
          ]"
        >
          <td
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            :class="[
              'py-3 px-4 text-sm text-gray-800',
              getAlignment(cellIndex, cell),
              cellClass,
            ]"
          >
            {{ cellIndex === 0 ? cell : formatNumber(cell) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* Estilos adicionais se necessário */
table {
  border-collapse: collapse;
}

/* Garantir que a tabela seja responsiva */
@media (max-width: 640px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}
</style>

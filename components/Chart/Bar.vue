<template>
  <div class="chart-bar w-full">
    <!-- Barra única dividida -->
    <div class="flex h-8 w-full overflow-hidden"
        @mouseenter="onEnterBar($event, chartData)"
        @mousemove="onMoveBar"
        @mouseleave="hide"
        >
      <div
        v-for="(item, index) in chartData"
        :key="index"
        class="h-full transition-all duration-700 ease-out"
        :class="[
          { 'border-r-[3px] border-white': index < chartData.length - 1 },
          item.colorClass || props.colorClasses[index] || 'bg-indigo-500',
        ]"
        :style="{
          width: `${item.percentage}%`,
          backgroundColor: item.useHexColor
            ? item.color || props.defaultColor
            : undefined,
        }"
      ></div>
    </div>

    <!-- Labels superiores -->
    <div class="flex relative w-full" style="height: 80px">
      <div
        v-for="(item, index) in chartData"
        :key="index"
        class="flex items-start flex-col pt-1 absolute"
        :class="[
          index === chartData.length - 1
            ? 'items-end text-right '
            : 'items-start ',
        ]"
        :style="getItemPositionStyle(index)"
      >
        <span
          class="text-3xl font-extrabold font-bigShoulders w-full"
          :class="[
            getTextColorClass(item, index),
            index === chartData.length - 1 ? 'flex justify-end' : '',
          ]"
        >
          {{ item.value }}
        </span>
        <span
          v-if="item.percentage > 5"
          class="w-full"
          :class="[
            getTextColorClass(item, index),
            index === chartData.length - 1 ? 'flex justify-end' : '',
          ]"
        >
          {{ item.label }}{{ item.value > 1 ? `s` : '' }}
        </span>
        <span
          v-if="item.percentage > 5"
          class="text-sm text-base-600 w-full"
          :class="[
            getTextColorClass(item, index),
            index === chartData.length - 1 ? 'flex justify-end' : '',
          ]"
        >
          {{ item.percentage.toLocaleString('pt-BR', { style: 'decimal', maximumFractionDigits: 1 }) }}%
        </span>
      </div>
    </div>
  </div>
  
  <ClientOnly>
    <UiTooltip v-bind="tip" />
  </ClientOnly>
</template>

<script setup>
// Imports e configs
  import { computed } from 'vue';
  import { useFloatingTooltip } from '#imports'
import { objectEntries, objectPick } from '@vueuse/core';
  const { tip, showAtEvent, moveWithEvent, hide } = useFloatingTooltip()

// Props
  const props = defineProps({
    // Dados do gráfico
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    // Cor padrão das barras (hex ou classe CSS)
    defaultColor: {
      type: String,
      default: '#6366F1', // indigo-500 (roxo/violeta como na imagem)
    },
    // Classes CSS para cores (bg-blue-600, etc)
    colorClasses: {
      type: Array,
      default: () => ['bg-indigo-500', 'bg-purple-400'],
    },
    title: {
      type: String,
      default: '',
    },
  });

// Computeds
  // Calcular total para percentuais
  const totalValue = computed(() => {
    const values = props.data.map((item) =>
      typeof item === 'object' ? item.value : item,
    );
    return values.reduce((sum, value) => sum + value, 0);
  });

  // Processar dados do gráfico
  const chartData = computed(() => {
    return props.data.map((item) => {
      let value, label, color, colorClass, useHexColor;

      if (typeof item === 'object') {
        value = item.value || 0;
        label = item.label || '';
        color = item.color || props.defaultColor;
        colorClass = item.colorClass || null;
        useHexColor = item.useHexColor || false;
      } else {
        value = item;
        label = String(item);
        color = props.defaultColor;
        colorClass = null;
        useHexColor = false;
      }

      // Calcular percentual
      const percentage =
        totalValue.value > 0 ? ((value / totalValue.value) * 100).toFixed(1) : 0;

      return {
        label,
        value,
        color,
        colorClass,
        useHexColor,
        percentage: parseFloat(percentage),
      };
    });
  });

// Funções
  // Função para converter cor de fundo em cor de texto
  const getTextColorClass = (item, index) => {
    // Se tem colorClass específica, converte bg- para text-
    if (item.colorClass) {
      return item.colorClass.replace('bg-', 'text-');
    }

    // Se tem colorClass padrão, converte bg- para text-
    if (props.colorClasses[index]) {
      return props.colorClasses[index].replace('bg-', 'text-');
    }

    // Fallback para cor padrão
    return 'text-indigo-500';
  };

  // Função para calcular a posição inicial de cada seção
  const getItemStartPosition = (index) => {
    if (index === 0) return 0;

    let cumulativePercentage = 0;
    for (let i = 0; i < index; i++) {
      cumulativePercentage += chartData.value[i].percentage;
    }

    return cumulativePercentage;
  };

  // Função para obter o estilo de posicionamento
  const getItemPositionStyle = (index) => {
    const isLast = index === chartData.value.length - 1;

    if (isLast) {
      return {
        right: '0px',
        left: 'auto',
        transform: 'translateX(0)',
      };
    }

    return {
      left: `${getItemStartPosition(index)}%`,
      right: 'auto',
      transform: 'translateX(0)',
    };
  };
  
  // Tooltip
    function tooltipContent(rows) {
      let html = `<div class="font-bigShoulders text-2xl uppercase font-bold text-blue-900">${props.title}</div>
                  <hr class="border-t border-neutral-400 mt-2 mb-2" />`
      
      for (const row of rows) {
        html += `<div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-xl ${row.colorClass || ''}"
                ${row.useHexColor ? `style="background-color:${row.color}"` : ''}"></span>
                  <span class="text-md text-neutral-600 lowercase">${row.value} ${row.label}${row.value > 1 ? 's' : ''} (${row.percentage.toLocaleString('pt-BR', { style: 'decimal', maximumFractionDigits: 1 })}%)</span>
                </div>`
      }
      html += '</div>';
      return html;
    }

    function onEnterBar(e, rows) { showAtEvent(e, tooltipContent(rows)) }
    function onMoveBar(e) { moveWithEvent(e) }
</script>

<style scoped>
.chart-bar {
  font-family: inherit;
}

/* Animação das seções da barra */
.chart-bar div[style*='width'] {
  animation: growRight 0.8s ease-out;
}

@keyframes growRight {
  from {
    width: 0 !important;
  }
}
</style>

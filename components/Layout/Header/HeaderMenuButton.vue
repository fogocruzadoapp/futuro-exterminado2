<template>
  <Transition name="fade-menu-btn" mode="out-in">
    <div v-if="!isOpen" class="flex gap-4 justify-end items-center" key="open">
      <div class="hidden md:flex">
        <span v-if="pageEstado && pageType==='detalhes'" class="text-white font-bigShoulders text-xl">{{
          estadoAbreviacao[pageEstado]
        }}&nbsp;/&nbsp;</span>
        <span v-if="estadoSelecionado && pageType==='mapa'" class="text-white font-bigShoulders text-xl">{{
          estadoAbreviacao[estadoSelecionado]
        }}&nbsp;/&nbsp;</span>
        <span class="text-white font-bigShoulders text-xl">{{ pageType==='introducao' ? 'Introdução' : pageType }}</span>
      </div>
      <button @click="$emit('open')" class="cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M24 18.9961V21.3965H14.9639L12.8037 20.1963V21.3965H12.3242L8.00391 18.9961V21.3965H0V18.9961H24ZM24 12.9961H3.99609V10.5957H24V12.9961ZM20.0039 4.5957V2.40039H24V4.7998H8.00391V2.40039H16.0439L20.0039 4.5957Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
    <button
      class="flex gap-4 w-3/12 justify-end cursor-pointer items-center"
      v-else
      @click="$emit('close')"
      key="close"
    >
      <span class="text-white text-xl font-bigShoulders hidden md:flex"
        >Fechar</span
      >
      <span class="">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12.0059 10.2275L15.0381 7.19531L16.3037 9.47559L13.7725 12.0059L21.5996 19.834L19.834 21.5996L15.7773 17.5566L12.0059 10.7539V13.7725L4.16602 21.5996L2.40039 19.834L10.2275 12.0059L2.40039 4.16602L4.16602 2.40039L12.0059 10.2275ZM21.5996 4.16602L17.0176 8.76172V5.21582L19.833 2.40039L21.5996 4.16602Z"
            fill="white"
          />
        </svg>
      </span>
    </button>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

// Data e refs
const estadoSelecionado = inject('estadoSelecionado');
const route = useRoute();

// Verifica se está na página do mapa
const pageType = computed(() => {
  return route.path.split('/')[1];
});
const pageEstado = computed(() => {
    return route.path.split('/')[2]
})

const estadoAbreviacao = {
  acre: 'AC',
  alagoas: 'AL',
  amapa: 'AP',
  amazonas: 'AM',
  bahia: 'BA',
  ceará: 'CE',
  'distrito-federal': 'DF',
  'espirito-santo': 'ES',
  goias: 'GO',
  maranhao: 'MA',
  'mato-grosso': 'MT',
  'mato-grosso-do-sul': 'MS',
  'minas-gerais': 'MG',
  para: 'PA',
  paraiba: 'PB',
  parana: 'PR',
  pernambuco: 'PE',
  piaui: 'PI',
  'rio-de-janeiro': 'RJ',
  'rio-grande-do-norte': 'RN',
  'rio-grande-do-sul': 'RS',
  rondonia: 'RO',
  roraima: 'RR',
  'santa-catarina': 'SC',
  'sao-paulo': 'SP',
  sergipe: 'SE',
  tocantins: 'TO',
};

// Props
defineProps({
  isOpen: Boolean,
});
</script>

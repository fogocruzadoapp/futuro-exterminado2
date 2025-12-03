<template>
  <div
    v-if="show && (html || isCluster || situation || genre || ageGroup)"
    class="fixed pointer-events-none z-[9999] min-w-[200px]"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <!-- Tooltip com HTML customizado (para gráficos) -->
    <div
      v-if="html"
      class="tooltip-content bg-white rounded-lg shadow-xl p-4 pointer-events-auto"
      v-html="html"
    ></div>

    <!-- Tooltip de cluster -->
    <div
      v-else-if="isCluster"
      class="p-3 flex items-center justify-center font-bigShoulders text-2xl"
      :style="{ backgroundColor: backgroundColor }"
    >
      {{ count }} vítimas
    </div>

    <!-- Tooltip de vítima individual -->
    <div
      v-else-if="!isCluster && (situation || genre || ageGroup)"
      class="min-h-[215px] min-w-[360px] overflow-hidden relative flex items-stretch w-fit"
      :class="classeSituacao"
    >
      <!-- Máscara esquerda -->
      <div class="flex flex-col">
        <div class="flex-1" :style="{ backgroundColor: backgroundColor }"></div>
        <div
          class="mask-left"
          :style="{ backgroundColor: backgroundColor }"
        ></div>
      </div>
      <!-- Conteúdo central -->
      <div
        class="w-full relative z-10 min-w-[264px] min-h-full flex items-center px-4 py-2"
        :style="{ backgroundColor: backgroundColor }"
      >
        <template v-if="!isCluster">
          <div class="h-full flex flex-col justify-center gap-4 py-6">
            <!-- Header -->
            <div class="flex flex-col gap-2 text-black text-2xl">
              <!-- Icone -->
              <div class="flex gap-3">
                <div v-if="balaPerdida"><SvgoAmmo /></div>
                <div v-if="dentroDeCasa"><SvgoHouse /></div>
                <div v-if="acaoPolicial"><SvgoCar /></div>
              </div>
              <!-- Titulo -->
              <div
                class="font-black font-bigShoulders uppercase leading-7 tracking-tight"
              >
                <span
                  v-if="
                    name &&
                    name !== 'null' &&
                    name !== 'undefined' &&
                    name !== 'Não identificado'
                  "
                >
                  {{ name }},
                </span>
                <span v-if="genre">{{
                  mapaGeneroTooltip(genre, ageGroup)
                }}</span>
                <span v-if="race">{{ mapaRacaTooltip(race, genre) }} </span>
                <span v-if="age">
                  de {{ age }} ano{{ age > 1 ? 's' : '' }}</span
                >
                <span v-if="ageGroup && !age">{{
                  ageGroup === 'Adolescente'
                    ? ' entre 12 e 17 anos'
                    : ' entre 0 e 11 anos'
                }}</span>
              </div>
            </div>
            <!-- Info -->
            <div class="text-base text-white leading-snug">
              {{ mapaSituacaoTooltip(situation, genre) }}
              <span v-if="dentroDeCasa"> <b>dentro de casa</b></span>
              <span v-if="balaPerdida"> por <b>bala perdida</b></span>
              <span v-if="date"> em {{ dataFormatada }}</span>
              <span v-if="acaoPolicial"> durante <b>ação policial</b></span>
            </div>
            <!-- Local -->
            <div class="flex gap-2">
              <div class="min-w-[24px]">
                <SvgoMap2 class="w-6 h-6 text-black" :fontControlled="false" />
              </div>
              <div class="leading-snug text-neutral">
                <span class="">{{ toTitleCasePtBR(localidadeCompleta) }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
      <!-- Máscara direita -->
      <div class="flex flex-col">
        <div
          class="mask-right"
          :style="{ backgroundColor: backgroundColor }"
        ></div>
        <div class="flex-1" :style="{ backgroundColor: backgroundColor }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SvgoAmmo2, SvgoCar1, SvgoHouse2, SvgoMap } from '#components';
import { computed } from 'vue';
const props = defineProps({
  // Controle de visibilidade e posicionamento
  show: {
    type: Boolean,
    default: false,
  },
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
  // HTML customizado (para gráficos)
  html: {
    type: String,
    default: '',
  },
  // Cluster
  isCluster: Boolean,
  count: Number,
  situacoes: Array,
  // Ponto individual
  name: String,
  genre: String,
  race: String,
  age: [String, Number],
  ageGroup: String,
  situation: String,
  balaPerdida: Boolean,
  dentroDeCasa: Boolean,
  acaoPolicial: Boolean,
  date: String,
  locality: String,
  subNeighborhood: String,
  neighborhood: String,
  city: String,
  state: String,
  // Cor do tooltip
  backgroundColor: {
    type: String,
    default: '#000000',
  },
});

function mapaGeneroTooltip(genero, grupo) {
  if (genero && genero !== 'Não identificado') {
    if (grupo == 'Criança') {
      if (genero === 'Homem cis' || genero === 'Homem trans') {
        return 'menino';
      } else if (
        genero === 'Mulher cis' ||
        genero === 'Mulher trans e travesti'
      ) {
        return 'menina';
      }
    } else if (grupo == 'Adolescente') {
      return 'adolescente';
    }
  } else {
    return grupo;
  }
}

function mapaRacaTooltip(raca, genero) {
  if (genero === 'Homem cis' || genero === 'Homem trans') {
    if (raca === 'Negra') return ' negro';
    if (raca === 'Branca') return ' branco';
  } else if (genero === 'Mulher cis' || genero === 'Mulher trans e travesti') {
    if (raca === 'Negra') return ' negra';
    if (raca === 'Branca') return ' branca';
  } else if (genero === 'Não identificado') {
    if (raca === 'Negra') return 'negro(a)';
    if (raca === 'Branca') return 'branco(a)';
  } else {
    return '';
  }
}

function mapaSituacaoTooltip(situacao, genero) {
  if (situacao === 'Wounded') {
    if (genero === 'Homem cis' || genero === 'Homem trans') {
      return 'Ferido';
    } else if (
      genero === 'Mulher cis' ||
      genero === 'Mulher trans e travesti'
    ) {
      return 'Ferida';
    } else if (genero === 'Não identificado') {
      return 'Ferido(a)';
    }
  } else if (situacao === 'Dead') {
    if (genero === 'Homem cis' || genero === 'Homem trans') {
      return 'Morto';
    } else if (
      genero === 'Mulher cis' ||
      genero === 'Mulher trans e travesti'
    ) {
      return 'Morta';
    } else if (genero === 'Não identificado') {
      return 'Morto(a)';
    }
  }
}

const dataFormatada = computed(() => {
  if (!props.date) return '';
  const dataValida = !isNaN(new Date(props.date).getTime());
  if (!dataValida) return '';
  const data = new Date(props.date);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(data);
});

const localidadeCompleta = computed(() => {
  const local = props.locality
    ? props.locality
    : props.subNeighborhood
    ? props.subNeighborhood
    : props.neighborhood
    ? props.neighborhood
    : null;
  return [local, props.city].filter(Boolean).join(', ');
});

const classeSituacao = computed(() => {
  if (props.isCluster) {
    if (props.situacoes && props.situacoes.length === 1) {
      return props.situacoes[0] === 'Dead'
        ? 'dead'
        : props.situacoes[0] === 'Wounded'
        ? 'wounded'
        : 'mixed';
    }
    return 'mixed';
  }
  return props.situation;
});

// Scripts para normalizar texto da localidade
const SMALL_WORDS = new Set([
  'a',
  'o',
  'as',
  'os',
  'da',
  'de',
  'do',
  'das',
  'dos',
  'e',
  'em',
  'no',
  'na',
  'nos',
  'nas',
  'ao',
  'aos',
  'à',
  'às',
  'ante',
  'após',
  'até',
  'com',
]);

const ALNUM = 'A-Za-zÀ-ÖØ-öø-ÿ0-9';

function capitalizeWord(w) {
  return w.replace(new RegExp(`^[${ALNUM}]|([\'’][${ALNUM}])`, 'g'), (m) =>
    m.toUpperCase(),
  );
}

function capitalizeHyphenated(core, forceCap = false) {
  return core
    .split(/(-)/)
    .map((part) => {
      if (part === '-') return part;
      const bare = part.replace(new RegExp(`[^${ALNUM}'’]`, 'g'), '');
      if (!bare) return part;
      const isSmall = SMALL_WORDS.has(bare.toLowerCase());
      const shouldCap = forceCap || !isSmall;
      return shouldCap ? capitalizeWord(part) : part.toLowerCase();
    })
    .join('');
}

function toTitleCasePtBR(str) {
  if (!str) return str;

  let s = str.toLowerCase().trim();
  let out = '';
  let i = 0;
  let atSegmentStart = true;

  while (i < s.length) {
    // espaços
    const space = s.slice(i).match(/^\s+/);
    if (space) {
      out += space[0];
      i += space[0].length;
      continue;
    }

    // próximo "token" até espaço
    const tokenMatch = s.slice(i).match(/^[^\s]+/);
    if (!tokenMatch) break;

    const token = tokenMatch[0];
    i += token.length;

    if (!new RegExp(`[${ALNUM}]`).test(token)) {
      out += token;
      atSegmentStart = /[.,:;!?()\[\]{}"“”'’–—]$/.test(token);
      continue;
    }

    const m = token.match(
      new RegExp(`^([^${ALNUM}'’-]*)([${ALNUM}'’-]+)([^${ALNUM}'’-]*)$`),
    );
    let lead = '',
      core = token,
      tail = '';
    if (m) {
      lead = m[1];
      core = m[2];
      tail = m[3];
    }

    let c = capitalizeHyphenated(core, atSegmentStart);

    if (!atSegmentStart && !c.includes('-')) {
      const bare = c.replace(/['’]/g, '');
      if (SMALL_WORDS.has(bare.toLowerCase())) {
        c = c.toLowerCase();
      }
    }

    out += lead + c + tail;

    atSegmentStart = /[.,:;!?()\[\]{}"“”'’–—]$/.test(tail);
  }

  return out;
}
</script>

<style scoped>
@reference "@/assets/css/global.css";

.mask-left,
.mask-right {
  width: 48px;
  height: 215px;
  z-index: 20;
  pointer-events: none;
}
.mask-left {
  /* Máscara SVG para cortar a esquerda */
  background: transparent;
  mask-image: url("data:image/svg+xml,%3Csvg width='48' height='215' viewBox='0 0 48 215' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M48 215L0 187.211V75.5H24L0 61.6055V0H48V215Z' fill='white'/%3E%3C/svg%3E");
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg width='48' height='215' viewBox='0 0 48 215' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M48 215L0 187.211V75.5H24L0 61.6055V0H48V215Z' fill='white'/%3E%3C/svg%3E");
  -webkit-mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
}
.mask-right {
  /* Máscara SVG para cortar a direita */
  background: transparent;
  mask-image: url("data:image/svg+xml,%3Csvg width='48' height='215' viewBox='0 0 48 215' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M48 215H0V0L48 27.7891V145.105H24L48 159H0L48 186.789V215Z' fill='white'/%3E%3C/svg%3E");
  mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg width='48' height='215' viewBox='0 0 48 215' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M48 215H0V0L48 27.7891V145.105H24L48 159H0L48 186.789V215Z' fill='white'/%3E%3C/svg%3E");
  -webkit-mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
}
</style>

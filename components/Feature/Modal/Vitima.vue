<template>
  <!-- Modal Overlay -->
  <div
    v-if="isOpen"
    class="fixed max-h-screen max-w-screen inset-0 z-50 flex flex-col items-center justify-center bg-blue-900/90 bg-opacity-50"
    @click="closeModal"
  >
    <!-- Modal Content -->
    <div
      class="relative w-full max-w-screen px-5 md:px-0 md:max-w-[630px] gap-6 flex justify-center flex-col items-center"
      @click.stop
    >
      <!-- Header -->
      <div class="text-white flex flex-col items-center justify-center gap-4">
        <div>
          <SvgoLogo
            class="min-w-[400px] h-[40px] text-white"
            :fontControlled="false"
          />
        </div>
        <div class="text-center text-xl">
          Crianças e adolescentes estão na linha de tiro.<br />
          Conheça os dados e histórias que não podem ser esquecidas.
        </div>
      </div>
      <!-- Card -->
      <div class="flex flex-col md:flex-row items-center md:py-5">
        <!-- Img -->
        <div class="relative -z-10 md:translate-x-4 -rotate-3">
          <figure :class="`${props.imageSize} grayscale overflow-auto`">
            <img :src="image" @error="handleImageError" class="w-full h-full object-cover" />
          </figure>
        </div>
        <!-- Conteudo -->
        <div class="flex flex-row h-fit relative -z-10">
          <!--  Col Esquerda -->
          <div class="md:min-w-11 min-w-5 flex flex-col">
            <!-- Bloco 1 -->
            <div :style="bgStyle" class="w-full"></div>
            <!-- Bloco 2 - Com corte negativo -->
            <div
              :style="bgStyle"
              class="w-full md:h-[62px] h-[20px]"
              style="
                clip-path: polygon(
                  0 2.4%,
                  82.5% 51.4%,
                  0 51.4%,
                  0 100%,
                  100% 100%,
                  100% 0%,
                  0 0%
                );
              "
            ></div>
            <!-- Bloco 3 -->
            <div :style="bgStyle" class="w-full flex-1"></div>
            <!-- Bloco 4 - Com corte diagonal -->
            <div
              :style="bgStyle"
              class="w-full md:h-[62px] h-[20px]"
              style="
                clip-path: polygon(
                  0 0%,
                  100% 0%,
                  100% 100%,
                  98.4% 100%,
                  0% 2.2%
                );
              "
            ></div>
          </div>
          <!--  Col Centro -->
          <div :style="bgStyle" class="py-8 flex-1 min-w-[210px]">
            <div class="flex flex-col gap-8">
              <div class="flex flex-col text-base-1000">
                <div class="flex flex-row gap-2 text-2xl mb-2">
                  <div v-if="balaPerdida"><SvgoAmmo /></div>
                  <div v-if="dentroDeCasa"><SvgoHouse /></div>
                  <div v-if="acaoPolicial"><SvgoCar /></div>
                </div>
                <div v-if="name && name !== 'null' && name !== 'undefined' && name !== 'Não identificado'" class="font-extrabold font-bigShoulders text-2xl">
                  {{ name }},
                </div>
                <div class="font-extrabold font-bigShoulders text-2xl">
                  <span v-if="genre">{{ mapaGeneroTooltip(genre, ageGroup) }}</span>
                  <span v-if="race">{{ mapaRacaTooltip(race, genre) }} </span>
                  <span v-if="age"> de {{ age }} ano{{ age > 1 ? 's' : '' }}</span>
                  <span v-if="ageGroup && !age">{{ ageGroup === 'Adolescente' ? ' entre 12 e 17 anos' : ' entre 0 e 11 anos' }}</span>
                </div>
                <div class="text-white">
                  {{ mapaSituacaoTooltip(situation, genre) }}
                  <span v-if="dentroDeCasa"> <b>dentro de casa</b></span>
                  <span v-if="balaPerdida"> por <b>bala perdida</b></span>
                  <span v-if="date"> em {{ dataFormatada }}</span>
                  <span v-if="acaoPolicial"> durante <b>ação policial</b></span>
                </div>
              </div>

              <div class="flex flex-row gap-2 items-center">
                <SvgoPin
                  class="w-[24px] h-6 text-base-1000 md:translate-y-0"
                  :fontControlled="false"
                />
                <span>{{ toTitleCasePtBR(localidadeCompleta) }}</span>
              </div>
            </div>
          </div>
          <!--  Col Direita -->
          <div class="md:min-w-11 min-w-5 flex flex-col">
            <!-- Bloco 1 - Com corte negativo -->
            <div
              :style="bgStyle"
              class="w-full md:h-[62px] h-[20px]"
              style="clip-path: polygon(0% 0%, 100% 61.3%, 100% 100%, 0% 100%)"
            ></div>
            <!-- Bloco 2 -->
            <div :style="bgStyle" class="w-full flex-1"></div>
            <!-- Bloco 3 - Com corte negativo -->
            <div
              :style="bgStyle"
              class="w-full md:h-[65px] h-[20px]"
              style="
                clip-path: polygon(
                  50% 0%,
                  100% 30%,
                  100% 30%,
                  0% 30%,
                  100% 90%,
                  100% 101%,
                  0% 101%,
                  0% 0%
                );
              "
            ></div>
            <!-- Bloco 4 -->
            <div :style="bgStyle" class="w-full flex-1"></div>
          </div>

          <!-- Fragmento 1 de SVG -->
          <div
            class="absolute bottom-0 left-0 w-[30px] h-[16px] md:w-[46px] md:h-[32px] translate-y-full -translate-x-1/3"
          >
            <svg
              class="w-full h-full"
              viewBox="0 0 59 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMinYMax slice"
            >
              <path
                d="M1.39876e-06 32L58.1818 0L0 2.54321e-06L1.39876e-06 32Z"
                :fill="pathFill"
              />
            </svg>
          </div>
          <!-- Fragmento 2 de SVG -->
          <div
            class="absolute top-0 right-0 w-[24px] h-[13px] md:w-[48px] md:h-[26px] -translate-y-full translate-x-1/3"
          >
            <svg
              class="w-full h-full"
              viewBox="0 0 48 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMaxYMin slice"
            >
              <path
                d="M47.2727 26L0 0L47.2727 2.05717e-06V26Z"
                :fill="pathFill"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="flex flex-row gap-6 justify-center max-w-screen w-full">
        <!-- Close Button -->
        <UiButton type="outline" size="big" @click="closeModal">
          Fechar
        </UiButton>
        <!-- Ver no mapa -->
        <NuxtLink :to="`/mapa?estado=${slugify(state)}&id=${id}`">
          <UiButton size="big" @click="closeModal"> Ver no mapa </UiButton>
        </NuxtLink>
      </div>
    </div>
    <FeatureTexturaSection :z-index="-10" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
const slugify = useSlugify();

// Props
const props = defineProps({
  id: String,
  isOpen: {
    type: Boolean,
    default: false,
  },
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
  image: {
    type: String,
    default: '/images/vitimas/default.png',
  },
  imageSize: {
    type: String,
    default: 'w-[400px] h-[600px]',
  },
  // Cores e estilos
  bgColor: {
    type: String,
    default: '#24195D',
  },
  pathFill: {
    type: String,
    default: '#24195D',
  },
  // Animações
  imageScale: {
    type: Number,
    default: 1,
  },
  imageRotation: {
    type: Number,
    default: 0,
  },
  imageTranslateX: {
    type: Number,
    default: 0,
  },
  imageTranslateY: {
    type: Number,
    default: 0,
  },
  imageBlur: {
    type: Number,
    default: 0,
  },
});

// Emits
const emit = defineEmits(['close', 'submit']);

// Computeds
const bgStyle = computed(() => ({
  backgroundColor: props.bgColor,
}));

const alignmentClasses = computed(() => 'items-center');

const imageTransformClasses = computed(() => 'w-full h-full');

const absolutePositionClasses = computed(
  () => 'absolute inset-0 flex items-center justify-center',
);

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
  const local= props.locality?props.locality: props.subNeighborhood?props.subNeighborhood: props.neighborhood?props.neighborhood:null;
  return [
    local,
    props.city,
  ]
    .filter(Boolean)
    .join(', ');
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


//Functions
function mapaGeneroTooltip(genero, grupo) {
  if (genero && genero !== 'Não identificado') {
    if (grupo == 'Criança') {
      if (genero === 'Homem cis' || genero === 'Homem trans') {
        return 'menino';
      } else if (genero === 'Mulher cis' || genero === 'Mulher trans e travesti') {
        return 'menina';
      }
    }else if (grupo == 'Adolescente') {
      return 'adolescente';
    }
  }else{
    return grupo;
  }
}

function mapaRacaTooltip(raca, genero) {
  if(genero === 'Homem cis' || genero === 'Homem trans') {
    if (raca === 'Negra') return ' negro';
    if (raca === 'Branca') return ' branco';
  } else if(genero === 'Mulher cis' || genero === 'Mulher trans e travesti') {
    if (raca === 'Negra') return ' negra';
    if (raca === 'Branca') return ' branca';
  } else if(genero === 'Não identificado') {
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
    } else if (genero === 'Mulher cis' || genero === 'Mulher trans e travesti') {
      return 'Ferida';
    }
    else if (genero === 'Não identificado') {
      return 'Ferido(a)';
    }
  } else if (situacao === 'Dead') {
    if (genero === 'Homem cis' || genero === 'Homem trans') {
      return 'Morto';
    } else if (genero === 'Mulher cis' || genero === 'Mulher trans e travesti') {
      return 'Morta';
    }
    else if (genero === 'Não identificado') {
      return 'Morto(a)';
    }
  }
}

// Scripts para normalizar texto da localidade
  const SMALL_WORDS = new Set([
    'a','o','as','os',
    'da','de','do','das','dos',
    'e','em','no','na','nos','nas',
    'ao','aos','à','às','ante','após','até','com',
  ]);

  const ALNUM = 'A-Za-zÀ-ÖØ-öø-ÿ0-9';

  function capitalizeWord(w) {
    return w.replace(
      new RegExp(`^[${ALNUM}]|([\'’][${ALNUM}])`, 'g'),
      m => m.toUpperCase()
    );
  }

  function capitalizeHyphenated(core, forceCap = false) {
    return core.split(/(-)/).map(part => {
      if (part === '-') return part;
      const bare = part.replace(new RegExp(`[^${ALNUM}'’]`, 'g'), '');
      if (!bare) return part;
      const isSmall = SMALL_WORDS.has(bare.toLowerCase());
      const shouldCap = forceCap || !isSmall;
      return shouldCap ? capitalizeWord(part) : part.toLowerCase();
    }).join('');
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
      if (space) { out += space[0]; i += space[0].length; continue; }

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

      const m = token.match(new RegExp(`^([^${ALNUM}'’-]*)([${ALNUM}'’-]+)([^${ALNUM}'’-]*)$`));
      let lead = '', core = token, tail = '';
      if (m) { lead = m[1]; core = m[2]; tail = m[3]; }

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

  // Close modal function
  const closeModal = () => {
    emit('close');
  };

  function handleImageError(event) {
    event.target.src = '/images/vitimas/default.png';
  }

// Watchs
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  },
);
</script>

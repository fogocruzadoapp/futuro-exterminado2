<script setup>
import { set } from '@vueuse/core';

const route = useRoute();
const router = useRouter();
const slugify = useSlugify();

const controleGeral = useState('controleGeral', () => false);
if (!controleGeral.value) navigateTo('/');


// Data
const vitimas = inject('vitimas');
const intro = inject('introStats');
const estados = inject('estados');
const porEstado = inject('porEstado');
const pageKey = ref(0);
const mapaCapitais = inject('mapaCapitais');

// Ref para o container da seção de estatísticas
const estatisticaContainerRef = ref(null);

// Ref para o container da seção do mapa
const mapSectionRef = ref(null);

// Estado do scroll progress para o mapa
const mapScrollProgress = ref(0);

// Tamanhos dos círculos proporcionais aos valores
const circleSizes = computed(() => {
  if (!intro.value)
    return {
      feridos: { mobile: 142, desktop: 288 },
      mortos: { mobile: 188, desktop: 366 },
    };

  const feridos = intro.value.feridosCount; // 840
  const mortos = intro.value.mortosCount; // 1053
  const total = feridos + mortos; // 1893

  // Tamanhos base (mínimo) e máximo
  const minSize = { mobile: 100, desktop: 200 };
  const maxSize = { mobile: 200, desktop: 400 };

  // Calcula proporção de cada valor
  const feridosRatio = feridos / total;
  const mortosRatio = mortos / total;

  // Aplica a proporção ao range de tamanhos
  const feridosMobile =
    minSize.mobile + feridosRatio * (maxSize.mobile - minSize.mobile);
  const feridosDesktop =
    minSize.desktop + feridosRatio * (maxSize.desktop - minSize.desktop);
  const mortosMobile =
    minSize.mobile + mortosRatio * (maxSize.mobile - minSize.mobile);
  const mortosDesktop =
    minSize.desktop + mortosRatio * (maxSize.desktop - minSize.desktop);

  return {
    feridos: {
      mobile: Math.round(feridosMobile),
      desktop: Math.round(feridosDesktop),
    },
    mortos: {
      mobile: Math.round(mortosMobile),
      desktop: Math.round(mortosDesktop),
    },
  };
});

// Animação do número
const animatedNumber = ref(0);
const targetNumber = intro.vitimasCount;
const hasAnimated = ref(false);
const numberElementRef = ref(null);

onBeforeMount(() => {
  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);
  animatedNumber.value = 0;
  hasAnimated.value = false;
});

// Função de animação do número
const animateNumber = () => {
  if (hasAnimated.value) return; // Não anima se já foi animada

  hasAnimated.value = true;
  const startValue = animatedNumber.value;
  const endValue = targetNumber;
  const duration = 4000; // 3 segundos
  const startTime = performance.now();

  // Define o incremento para pular de grupos
  const increment = 50; // Pula de 50 em 50

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);

    const currentValue = startValue + (endValue - startValue) * easeOut;

    // Arredonda para o próximo múltiplo do incremento
    let roundedValue = Math.floor(currentValue / increment) * increment;

    // Se estamos muito perto do final, vai direto para o valor exato
    if (progress > 0.9) {
      roundedValue = endValue;
    }

    // Garante que não passe do valor final
    animatedNumber.value = Math.min(roundedValue, endValue);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

// Função para calcular o scroll progress da seção do mapa
const handleMapScroll = () => {
  if (!mapSectionRef.value) return;

  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  // Obtém a posição real da seção do mapa
  const sectionRect = mapSectionRef.value.getBoundingClientRect();
  const sectionTop = scrollY + sectionRect.top;
  const sectionHeight = sectionRect.height;

  // Calcula o progresso do scroll na seção
  // A seção começa quando o topo dela entra na viewport
  const sectionStart = sectionTop;
  // A seção termina quando o topo dela sai da viewport (altura da viewport)
  const sectionEnd = sectionTop + windowHeight;

  const scrollProgress = Math.max(
    0,
    Math.min(1, (scrollY - sectionStart) / (sectionEnd - sectionStart)),
  );

  mapScrollProgress.value = scrollProgress;
};

const progress = ref(0);
const loaded = ref(false);
onMounted(() => {
  const images = Array.from(document.querySelectorAll('img,video'));
  const total = images.length;
  let loadedCount = 0;

  if (total === 0) {
    progress.value = 100;
    loaded.value = true;
    liberaPagina();
    return;
  }

  const updateProgress = (e) => {
    loadedCount++;
    progress.value = Math.round((loadedCount / total) * 100);
    if (loadedCount === total) {
      loaded.value = true;
      liberaPagina();
    }
  };

  images.forEach((img) => {
    img.addEventListener('load', updateProgress);
    img.addEventListener('loadeddata', updateProgress);
    img.addEventListener('error', updateProgress);
  });
});

const liberaPagina = () => {
  setTimeout(() => {
      document.body.style.overflow = '';
      document.querySelector('.hero').style.zIndex = '39';
    // Intersection Observer para animar quando o elemento ficar visível
    nextTick(() => {
      if (numberElementRef.value) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !hasAnimated.value) {
                animateNumber();
              }
            });
          },
          { threshold: 0.3 }, // Anima quando 30% do elemento estiver visível
        );

        observer.observe(numberElementRef.value);
      }
    });

    // Adiciona listener para o scroll do mapa
    window.addEventListener('scroll', handleMapScroll);

    // Cleanup do listener
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleMapScroll);
    });
  }, 2000);
};

</script>
<!-- pages/introducao.vue -->
<template>
  <LayoutHeader />
  <!-- AudioPlayer -->
  <FeatureAudioPlayer :play="loaded ? 2 : 1" />
  <main :key="pageKey">
    <!-- Seção Hero -->
    <section class="hero relative overflow-hidden min-h-screen z-[100]">
      <section
        class="absolute z-40 overflow-hidden h-screen w-screen pointer-events-none"
      >
        <!-- Animation Fragmentos -->
        <HeroComponentsAnimation :start="loaded" />

        <!-- Loading -->
        <HeroComponentsLoading :percentLoaded="progress" :loaded="loaded" />
      </section>
      <!-- Vídeo -->
      <HeroComponentsVideoPlayer
        video-src="/videos/intro.webm"
        :autoplay="loaded"
        :loop="true"
        :muted="true"
        :playsinline="true"
        :delay="1"
      />

      <!-- Logo e Texto -->
      <HeroComponentsConteudo :start="loaded" />

      <!-- Background Texture Pattern -->
      <FeatureTexturaSectionHero />

      <!--  Sinal Scroll -->
      <HeroComponentsScrollSinal />
    </section>

    <!-- Slider Vitimas -->
    <section class="bg-blue-600 relative">
      <div class="flex flex-col">
        <!-- Slider -->
        <div
          class="relative z-30 min-h-screen justify-center flex items-center flex-col md:pt-16"
        >
          <FeatureSlider
            :items="[
              {
                type: 1,
                nome: 'Darik Sampaio',
                descricao:
                  'Foi morto em 16 de março de 2024 quando voltava da escola. Conversava com duas amigas na calçada quando foi atingido por balas perdidas em uma operação policial.',
                localidade: 'Jordão, Recife - PE',
                thumbnail: '/vitimas/darik.png',
                videoUrl: '/vitimas/darik.webm',
              },
              {
                type: 2,
                nome: 'maria eduarda',
                descricao:
                  'Morta em 30 de março de 2017, dentro da própria escola, atingida por uma bala perdida durante um confronto entre policiais e criminosos próximo à unidade de ensino.',
                localidade: 'Acari, Rio de Janeiro - RJ',
                thumbnail: '/vitimas/maria.png',
                videoUrl: '/vitimas/maria.webm',
              },
              {
                type: 3,
                nome: 'Victor Kawan',
                descricao:
                  'Morto em 11 de dezembro de 2021. Estava em uma moto com um amigo quando foi abordado por policiais militares e atingido por um disparo.',
                localidade: 'Sítio dos Pintos, Recife - PE',
                thumbnail: '/vitimas/victor.png',
                videoUrl: '/vitimas/victor.webm',
              },
              {
                type: 4,
                nome: 'Marcus Vinícius',
                descricao:
                  'Morto em 20 de junho de 2018, atingido na barriga por uma bala perdida durante uma operação da Polícia Civil, quando estava a caminho da escola.',
                localidade:
                  'Vila do Pinheiro (Complexo da Maré), Rio de Janeiro - RJ',
                thumbnail: '/vitimas/marcus.png',
                videoUrl: '/vitimas/marcus.webm',
              },
            ]"
          />
          <!-- Texto de contribuição Desktop -->
          <div class="text-white px-5 gap-1 text-center md:flex hidden py-4">
            <span>
              Encontrou alguma inconsistência nos casos? Ajude-nos a corrigir as
              informações.
              <a
                href="#"
                class="text-yellow-300 font-bold underline cursor-pointer"
                >Contribua</a
              ></span
            >
          </div>
        </div>
        <!-- Texto de contribuição Mobile -->
        <div class="text-white px-5 text-center md:hidden inline-flex py-6">
          <span>
            Encontrou alguma inconsistência nos casos? Ajude-nos a corrigir as
            informações.
            <a
              href="#"
              class="text-yellow-300 font-bold underline cursor-pointer"
              >Contribua</a
            ></span
          >
        </div>
        <!-- Background Texture Pattern -->
        <FeatureTexturaSection />
      </div>
    </section>

    <!-- Dados Estatisticos -->
    <section class="relative max-h-[8200px] bg-blue-900">
      <!-- Dados -->
      <div
        class="flex flex-col container mx-auto min-h-screen pt-32 md:pt-16 md:pb-16 gap-12 md:gap-6 px-5 text-white relative z-10"
      >
        <!-- Bloco1 -->
        <div
          class="flex p-5 md:p-12 flex-col relative min-h-[262px] md:min-h-[400px] items-center justify-end"
        >
          <div
            class="text-center max-w-[684px] text-blue-200 text-xl md:text-4xl z-10"
          >
            Desde {{ intro.anoInicial }}, pelo menos
            {{ intro.vitimasCount }} crianças e adolescentes foram vítimas de
            armas de fogo nas regiões metropolitanas de
            <template v-for="(estado, index) in estados" :key="index">
              {{ mapaCapitais[slugify(estado)]
              }}{{
                index < estados.length - 2
                  ? ', '
                  : index == estados.length - 2
                  ? ' e '
                  : ''
              }}
            </template>.
          </div>
          <div
            ref="numberElementRef"
            class="text-[128px] md:text-[320px] absolute top-0 left-0 h-full w-full flex items-center justify-center text-blue-1000 font-bold font-bigShoulders"
          >
            <span class="md:translate-y-0 -translate-y-16">{{
              animatedNumber.toLocaleString('pt-BR')
            }}</span>
          </div>
        </div>
        <!-- Bloco2 -->
        <div
          class="flex flex-col md:flex-row px-5 items-center justify-between gap-6"
        >
          <!-- Feridas -->
          <div class="w-full flex flex-col">
            <div
              class="text-violet font-bigShoulders font-extrabold text-5xl lg:text-7xl"
            >
              {{
                intro.feridosPercent.toLocaleString('pt-BR', {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })
              }}%
            </div>
            <div class="md:text-4xl text-2xl">ficaram</div>
            <div
              class="text-violet font-bigShoulders font-extrabold text-5xl lg:text-7xl"
            >
              feridas
            </div>
          </div>
          <!-- Grafico -->
            <div class="relative w-full aspect-square">
              <div class="relative w-full h-full">

                <!-- FERIDOS -->
                <div
                  class="circle-feridos flex flex-col absolute rounded-full bg-violet/80 items-center justify-center z-10 transition-all duration-500"
                  :style="{
                    /* % baseadas no container: mobile assume base 288px, desktop 560px */
                    '--feridos-w-m': ((circleSizes.feridos.mobile  / 288) * 100) + '%',
                    '--feridos-h-m': ((circleSizes.feridos.mobile  / 288) * 100) + '%',
                    '--feridos-w-d': ((circleSizes.feridos.desktop / 560) * 100) + '%',
                    '--feridos-h-d': ((circleSizes.feridos.desktop / 560) * 100) + '%',

                    /* offsets 12px => % do container (12/288 e 12/560) */
                    '--feridos-off-m': ((12 / 288) * 100) + '%',
                    '--feridos-off-d': ((12 / 560) * 100) + '%',
                  }"
                >
                  <span class="circle-feridos-text font-bigShoulders font-extrabold transition-all duration-500">
                    {{ intro.feridosCount }}
                  </span>
                </div>

                <!-- MORTOS -->
                <div
                  class="circle-mortos flex flex-col absolute rounded-full bg-coral items-center justify-center transition-all duration-500"
                  :style="{
                    '--mortos-w-m': ((circleSizes.mortos.mobile  / 288) * 100) + '%',
                    '--mortos-h-m': ((circleSizes.mortos.mobile  / 288) * 100) + '%',
                    '--mortos-w-d': ((circleSizes.mortos.desktop / 560) * 100) + '%',
                    '--mortos-h-d': ((circleSizes.mortos.desktop / 560) * 100) + '%',

                    '--mortos-off-m': ((12 / 288) * 100) + '%',
                    '--mortos-off-d': ((12 / 560) * 100) + '%',
                  }"
                >
                  <span class="circle-mortos-text font-bigShoulders font-extrabold transition-all duration-500">
                    {{ intro.mortosCount }}
                  </span>
                </div>

              </div>
            </div>

          <!-- Mortas -->
          <div class="w-full flex flex-col text-right">
            <div
              class="text-coral font-bigShoulders font-extrabold text-5xl lg:text-7xl"
            >
              {{
                intro.mortosPercent.toLocaleString('pt-BR', {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })
              }}%
            </div>
            <div class="md:text-4xl text-2xl">foram</div>
            <div
              class="text-coral font-bigShoulders font-extrabold text-5xl lg:text-7xl"
            >
              mortas
            </div>
          </div>
        </div>
        <!-- Bloco3 -->
        <div
          class="flex p-5 md:p-12 flex-col relative min-h-[262px] md:min-h-[400px] items-center justify-end"
        >
          <div
            class="text-center max-w-[684px] text-blue-200 text-2xl md:text-4xl z-10"
          >
            Este é um mapeamento colaborativo feito pelo Instituto Fogo Cruzado.
            Registramos, em média, {{ intro.mediaGeral }} meninos e meninas
            baleados por mês.
          </div>
          <div
            class="text-[128px] md:text-[240px] lg:text-[320px] absolute top-0 left-0 h-full w-full flex items-center justify-center text-blue-1000 font-bold font-bigShoulders"
          >
            <span class="md:translate-y-0 -translate-y-16"
              >{{ intro.mediaGeral }}/mês</span
            >
          </div>
        </div>
      </div>
      <!-- Animação Section Estatistica + Vitimas -->
      <div
        ref="estatisticaContainerRef"
        class="relative w-full h-[6400px] md:-translate-y-0 z-10"
      >
        <!-- Grafico Estatistica -->
        <div class="sticky top-0 min-h-screen flex w-full my-40">
          <Estatistica
            :containerRef="estatisticaContainerRef"
            :stagesConfig="[
              { start: 0, end: 20, name: 'stage1' },
              { start: 20, end: 40, name: 'stage2' },
              { start: 40, end: 70, name: 'stage3' },
              { start: 70, end: 100, name: 'stage4' },
            ]"
          />
        </div>

        <!-- Animacao Cards Vitimas -->
        <div class="absolute top-0 left-0 w-full h-full z-20 overflow-hidden px-5">
          <div
            class="flex flex-col container mx-auto items-center justify-center px-5 pt-[700px] pb-[180px] md:pt-[800px] md:pb-[800px]"
          >
            <EstatisticaVitimas />
          </div>
        </div>
      </div>

      <!-- Background Texture Pattern -->
      <FeatureTexturaSection :z-index="0" />
    </section>

    <!-- Pointer Section Map -->
    <div ref="mapSectionRef">
      <FeatureMapSection :scroll-progress="mapScrollProgress">
        <div
          class="container mx-auto px-5 relative z-10 -translate-y-[500px] md:-translate-y-[400px] justify-center items-center flex"
        >
          <div
            class="max-w-[800px] text-2xl md:text-4xl flex flex-col gap-[380px] md:gap-[500px] text-center text-blue-200"
          >
            <div>
              As crianças e adolescentes brasileiros estão em risco, mas a
              violência armada não afeta todos da mesma maneira.
            </div>
            <div>
              Os dados ajudam a entender quem são as vítimas e como elas são
              atingidas.
            </div>
            <div>A vítima pode ter sido morta ou ficado ferida.</div>
            <div>
              Em todos os casos, cada ponto no mapa indica uma vida e uma
              família marcadas para sempre pela violência armada.
            </div>
          </div>
        </div>
      </FeatureMapSection>
    </div>

    <!-- Cards Maps -->
    <section class="min-h-screen relative">
      <div
        class="container mx-auto px-5 flex min-h-screen h-full items-center justify-center py-16"
      >
        <div class="flex flex-col items-center justify-center gap-24 w-full">
          <div
            class="text-white text-2xl max-w-[768px] md:text-4xl text-center"
          >
            Explore o mapa para saber mais sobre os dados e histórias de cada região.
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full"
          >
            <template v-for="(estado, index) in estados">
              <FeatureCardMap
                :cidade="porEstado[slugify(estado)].capital"
                :estado="porEstado[slugify(estado)].slug"
                :vitimas="porEstado[slugify(estado)].vitimas"
                :inicio="porEstado[slugify(estado)].inicio"
                :index="index"
              />
            </template>
          </div>
        </div>
      </div>
      <FeatureTexturaSection :z-index="-10" background-color="blue-900" />
    </section>

    <LayoutFooter :key="`footer-${pageKey}`" />
  </main>
</template>
<style scoped>
/* Círculo Feridos - Desktop */
.circle-feridos{
  /* mobile por padrão */
  top: var(--feridos-off-m);
  left: var(--feridos-off-m);
  width: var(--feridos-w-m);
  height: var(--feridos-h-m);
}
.circle-feridos .circle-feridos-text, .circle-mortos .circle-mortos-text{
  font-size: clamp(
    70px,
    calc(70px + (130 - 70) * ((100vw - 320px) / (768 - 320))),
    130px
  );
  line-height: 1;
}

.circle-mortos{
  bottom: var(--mortos-off-m);
  right: var(--mortos-off-m);
  width: var(--mortos-w-m);
  height: var(--mortos-h-m);
}

/* desktop (md: 768px por padrão no Tailwind) */
@media (min-width: 768px){
  .circle-feridos{
    top: var(--feridos-off-d);
    left: var(--feridos-off-d);
    width: var(--feridos-w-d);
    height: var(--feridos-h-d);
  }

  .circle-mortos{
    bottom: var(--mortos-off-d);
    right: var(--mortos-off-d);
    width: var(--mortos-w-d);
    height: var(--mortos-h-d);
  }
}
</style>

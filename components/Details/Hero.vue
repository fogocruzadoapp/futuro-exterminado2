<template>
  <!-- Seção Hero -->
  <section class="relative bg-blue-800 overflow-hidden">
    <!-- Background Texture Pattern -->
    <div class="absolute inset-0 opacity-100">
      <svg
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full"
      >
        <defs>
          <pattern
            id="texture-pattern-stats"
            patternUnits="userSpaceOnUse"
            width="1920"
            height="1080"
          >
            <image
              href="@/assets/images/texture/model1.png"
              x="0"
              y="0"
              width="1920"
              height="1080"
              preserveAspectRatio="none"
            />
          </pattern>
        </defs>
        <rect
          width="1920"
          height="1080"
          fill="url(#texture-pattern-stats)"
          opacity="0.3"
          style="mix-blend-mode: multiply"
        />
      </svg>
    </div>

    <!-- SVG 1 - Bottom Left (720x588 original) -->
    <div
      class="absolute bottom-0 left-0 w-48 h-36 sm:w-64 sm:h-48 md:w-80 md:h-60 lg:w-[720px] lg:h-[588px] z-10 translate-y-1"
    >
      <svg
        class="w-full h-full"
        viewBox="0 0 720 588"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMin slice"
      >
        <path
          d="M405 237.688H123.24L720 587.383H0V584.688L200.25 472.587H0V0L405 237.688Z"
          fill="#160F38"
        />
      </svg>
    </div>

    <!-- SVG 2 - Top Right (481x332 original) -->
    <div
      class="absolute top-0 right-0 w-36 h-24 sm:w-48 sm:h-32 md:w-60 md:h-40 lg:w-[481px] lg:h-[332px] z-10"
    >
      <svg
        class="w-full h-full"
        viewBox="0 0 481 332"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMin slice"
      >
        <path
          d="M0 0L287.055 168.34L188.303 168.34L480.395 331.442V281.722L480.396 281.723L480.396 4.19914e-05L0 0Z"
          fill="#160F38"
        />
      </svg>
    </div>

    <!-- SVG 3 - Bottom Right (242x135 original) -->
    <div
      class="absolute bottom-0 right-0 w-24 h-16 sm:w-32 sm:h-20 md:w-40 md:h-24 lg:w-[242px] lg:h-[135px] z-10 translate-y-1/2"
    >
      <svg
        class="w-full h-full"
        viewBox="0 0 242 135"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMaxYMax slice"
      >
        <path
          d="M241.995 135L0 0L241.995 3.17337e-05L241.995 135Z"
          fill="#160F38"
        />
      </svg>
    </div>

    <!-- Conteúdo -->
    <div
      class="container pt-28 pb-28 md:pt-40 md:pb-50 flex flex-col justify-center items-center mx-auto px-5 relative z-10 gap-32"
    >
      <!-- Header  -->
      <div class="relative z-10">
        <!-- Titulo -->
        <div
          class="flex flex-col items-center justify-center md:min-w-[560px] text-white gap-3"
        >
          <div
            class="relative font-extrabold z-10 text-5xl md:text-7xl font-bigShoulders leading-none drop-shadow-2xl"
          >
            {{ props.name }}
          </div>
          <div
            class="relative z-10 font-bold font-bigShouldersRegular md:text-5xl text-4xl drop-shadow-2xl"
          >
            {{ props.subtitle }}
          </div>
        </div>
      </div>
      <!-- Imagem -->
      <div
        class="absolute top-26 md:top-0 left-1/2 transform min-w-[335px] md:min-w-[560px] md:min-h-[476px] -translate-x-1/2 flex items-center justify-center z-0"
      >
        <figure>
          <img :src="props.image" :alt="props.name" class="w-full" />
        </figure>
      </div>
      <!-- Estatísticas -->
      <div class="flex flex-col gap-5">
        <div class="text-xs text-white">Desde {{minDate}}</div>
        <div class="flex lg:flex-row flex-col gap-12 items-center">
          <div class="flex flex-row justify-between gap-8 lg:gap-12 lg:w-2/3">
            <!-- Estatística 1 -->
            <div class="relative flex items-center md:flex-row flex-col gap-4">
              <!-- Circulos -->
              <div class="min-h-24 min-w-26 h-full block mx-4 relative">
                <span class="text-5xl font-bigShoulders font-extrabold text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40" >{{ props.stats.children }}</span>
                <!-- Graphic -->
                <MapChartCircle v-if="aMortos && aFeridos"
                  :anoMortos="aMortos"
                  :anoFeridos="aFeridos"
                  :situacaoMortos="aMortos"
                  :situacaoFeridos="aFeridos"
                  :semLegenda="true"
                />
              </div>

              <!-- Texto -->
              <UiTypography
                variant="h4"
                color="white"
                class="text-center md:text-left"
              >
                {{ props.stats.childrenLabel }}
              </UiTypography>
            </div>

            <!-- Estatística 2 -->
            <div class="relative flex items-center md:flex-row flex-col gap-4">
              <!-- Circulos -->
               
              <div class="min-h-24 min-w-28 h-full block mx-8 relative">
                <span class="text-5xl font-bigShoulders font-extrabold text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40" >{{ props.stats.police }}</span>
                <!-- Graphic -->
                <MapChartCircle v-if="aPMortos && aPFeridos"
                  :anoMortos="aMortos"
                  :anoFeridos="aFeridos"
                  :situacaoMortos="aPMortos"
                  :situacaoFeridos="aPFeridos"
                  :semLegenda="true"
                />
              </div>

              <!-- Texto -->
              <div
                class="text-white font-bigShoulders font-bold text-lg leading-tight"
              >
                <UiTypography
                  variant="h4"
                  color="white"
                  class="text-center md:text-left"
                >
                  {{ props.stats.policeLabel }}
                </UiTypography>
              </div>
            </div>
          </div>

          <!-- Texto Descritivo -->
          <div class="lg:col-span-1 lg:w-1/3">
            <UiTypography variant="body1" color="white" class="leading-relaxed">
              {{ props.description }}
            </UiTypography>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

  // Props
    const props = defineProps({
      name: { type: String, required: true },
      subtitle: { type: String, required: true },
      image: { type: String, required: true },
      data: { type: Array, required: true }, 
      minDate: { type: String, required: false },
      stats: {
        type: Object,
        required: false,
        default: () => ({
          children: 0,
          childrenLabel: '',
          police: 0,
          policeLabel: '',
        }),
      },
      description: { type: String, required: true },
    })

  // Computeds
    //// Lista segura (evita quebrar se passarem algo errado)
      const list = computed(() => Array.isArray(props.data) ? props.data : [])

    //// Apenas ocorrências com ação/ operação policial
      const listPolice = computed(() => list.value.filter(v => v?.policeAction === true))
      
    //// Contagens em UM único pass (evita vários .filter)
    const totals = computed(() => {
      let dead = 0, wounded = 0
      let policeDead = 0, policeWounded = 0

      for (const o of list.value) {
        const sit = o?.situation
        const isPolice = !!o?.policeAction

        if (sit === 'Dead') {
          dead++
          if (isPolice) policeDead++
        } else if (sit === 'Wounded') {
          wounded++
          if (isPolice) policeWounded++
        }
      }
      return { dead, wounded, policeDead, policeWounded }
    })

    // Variáveis individuais
    const aMortos   = computed(() => totals.value.dead)
    const aFeridos  = computed(() => totals.value.wounded)
    const aPMortos  = computed(() => totals.value.policeDead)
    const aPFeridos = computed(() => totals.value.policeWounded)

</script>


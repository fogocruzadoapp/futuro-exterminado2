<template>
  <div class="flex flex-col items-center justify-center">
    <!-- Se houver map ou details, o botão revela conteúdo -->
    <button
      v-if="hasExtras"
      class="cut-text"
      @click="handleClick"
      :class="{ active: isActive}"
    >
      <span class="invisible select-none">
        <slot />
      </span>
      <span class="cut-text-left">
        <slot />
      </span>
      <span class="cut-text-right">
        <slot />
      </span>
    </button>

    <!-- Se não houver extras, botão é um link normal -->
    <NuxtLink
      v-else
      :to="link"
      :class="['cut-text', { active: route.path === link }]"
    >
      <span class="invisible select-none">
        <slot />
      </span>
      <span class="cut-text-left">
        <slot />
      </span>
      <span class="cut-text-right">
        <slot />
      </span>
    </NuxtLink>

    <transition name="fade-expand">
      <!-- Área com detalhes visível só se showExtras for true -->
      <div
        v-if="isActive"
        class="extras-content flex gap-4 justify-center items-center mt-2"
      >
        <NuxtLink v-if="mapa" :to="mapa"  >
          <UiLabel :class="{ active: isMapaActive }"
            >Mapa
            <SvgoMap />
          </UiLabel>
        </NuxtLink>
        <NuxtLink v-if="details" :to="details">
          <UiLabel :class="{ active: isDetailsActive }">Detalhe <SvgoChart /></UiLabel>
        </NuxtLink>
      </div>
    </transition>
  </div>
</template>

<script setup>
// Configs
const route = useRoute();

// Data e Refs
const showExtras = ref(false);
const hasExtras = computed(() => props.mapa || props.details);

// Props
const props = defineProps({
  link: {
    type: String,
    required: false,
    default: null,
  },
  details: {
    type: String,
    required: false,
    default: null,
  },
  mapa: {
    type: String,
    required: false,
    default: null,
  },
  active: Boolean,
});

// Computed
const estadoFromMapa = computed(() => {
  if (!props.mapa) return null
  try {
    // suporta paths relativos
    const url = new URL(props.mapa, 'http://example.local')
    const q = url.searchParams.get('estado')
    if (q) return q
  } catch (_) { /* ignora */ }
  // fallback bem simples: última parte após '='
  return props.mapa.includes('=') ? props.mapa.split('=').pop() : null
})

const isMapaActive = computed(() =>
  route.path === '/mapa' &&
  estadoFromMapa.value &&
  route.query?.estado === estadoFromMapa.value
)

const isDetailsActive = computed(() =>
  !!props.details && route.path === props.details
)

const isActive = computed(() =>
  showExtras.value || isMapaActive.value || isDetailsActive.value || !!props.active
)

// Emits
const emit = defineEmits(['toggle']);

// Watchers
watch(() => props.active, v => { showExtras.value = !!v }, { immediate: true })

// Funções
function handleClick() {
  emit('toggle');
}
</script>

<style scoped>
@reference "@/assets/css/global.css";
.cut-text {
  @apply font-bigShoulders uppercase text-5xl leading-[1.3] w-fit hover:text-yellow-300 text-white relative inline-block cursor-pointer select-none transition-colors duration-1000 ease-[cubic-bezier(0.77,0,0.18,1)];

  /* Hover Stats */
  &:hover {
    .cut-text-left {
      transform: translateX(-4px);
      clip-path: polygon(0 0, 61% 1%, 41% 100%, 0 100%);
    }
    .cut-text-right {
      transform: translateX(4px);
      clip-path: polygon(61% 1%, 100% 0, 100% 100%, 41% 100%);
    }
  }

  /* Efeito ativo persistente */
  &.active {
    @apply text-black;
    .cut-text-left {
      transform: translateX(-4px) rotate(-4deg);
      clip-path: polygon(0 0, 62% 2%, 38% 100%, 0 100%);
    }
    .cut-text-right {
      transform: translateX(4px) rotate(4deg);
      clip-path: polygon(62% 2%, 100% 0, 100% 100%, 38% 100%);
    }
  }
}
.cut-text-left,
.cut-text-right {
  @apply absolute top-0 left-0 w-full h-full pointer-events-none transition-[transform,clip-path] duration-[600ms] ease-[cubic-bezier(0.77,0,0.18,1)] hover:rotate-6;
}
.cut-text-left {
  clip-path: polygon(0 0, 60% 0, 40% 100%, 0 100%);
  z-index: 2;
}
.cut-text-right {
  clip-path: polygon(60% 0, 100% 0, 100% 100%, 40% 100%);
  z-index: 1;
}

.fade-expand-enter-active,
.fade-expand-leave-active {
  transition: max-height 0.7s ease-in-out, opacity 0.7s ease-in-out;
  overflow: hidden;
}
.fade-expand-enter-from,
.fade-expand-leave-to {
  max-height: 0;
  opacity: 0;
}
.fade-expand-enter-to,
.fade-expand-leave-from {
  max-height: 1000px;
  opacity: 1;
}
.extras-content{
  .active{
    @apply text-yellow-300;
  }
}
</style>

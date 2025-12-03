<template>
  <div
    class="bottom-bar sticky bottom-0 left-0 w-full z-30 transition-transform duration-300 ease-in-out"
    :class="{ 'translate-y-full': shouldHide }"
  >
    <div class="container flex flex-col items-center justify-center mx-auto px-3 md:px-0 py-3 text-white">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useScrollDirection } from '@/composables/useScrollDirection'

const props = defineProps({
  footerSelector: { type: String, default: '#site-footer' },
})

/* Seu composable atual: “visível quando rolando para cima” */
const { isElementVisible: isVisibleByScroll } = useScrollDirection({ direction: 'down' })

/* Quando o footer (ou sua borda de cima) entra na viewport, não escondemos a barra */
const nearFooter = ref(false)
let io = null

onMounted(() => {
  const footer = document.querySelector('#footer')
  if (!footer) return
  io = new IntersectionObserver(
    (entries) => { nearFooter.value = entries.some(e => e.isIntersecting) },
    {
      root: null,
      // Ajuste fino: começe a “colar” um pouco antes do footer
      rootMargin: '0px 0px -1px 0px',
      threshold: [0, 0.01],
    }
  )
  io.observe(footer)
})

onBeforeUnmount(() => { if (io) io.disconnect() })

/* Esconde só quando: rolando p/ baixo E AINDA não estamos encostando no footer */
const shouldHide = computed(() => !isVisibleByScroll.value && !nearFooter.value)
</script>

<style scoped>
@reference "@/assets/css/global.css";
/* sticky resolve o “encostar acima do footer” automaticamente,
   desde que o componente esteja imediatamente antes do footer */
.bottom-bar { @apply bg-blue-600; }
</style>

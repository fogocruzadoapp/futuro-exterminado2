<template>
  <ClientOnly>
    <component
      :is="tag"
      ref="textEl"
      v-bind="$attrs"
      :class="[computedClasses, $attrs.class]"
      :style="computedStyle"
    >
      <slot />
    </component>

    <template #fallback>
      <component
        :is="tag"
        v-bind="$attrs"
        :class="[computedClasses, $attrs.class]"
        :style="{ ...computedStyle, fontSize: `${props.maxSize}px` }"
      >
        <slot />
      </component>
    </template>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

// 🔸 impede que attrs fiquem no <ClientOnly>
defineOptions({ inheritAttrs: false })

const props = defineProps({
  tag: { type: String, default: 'div' },
  minSize: { type: Number, default: 14 },
  maxSize: { type: Number, default: 40 },
  className: { type: String, default: '' },
  style: { type: Object, default: () => ({}) },
})

const textEl = ref(null)
const fontSize = ref(props.maxSize)

const computedClasses = computed(() => `whitespace-nowrap ${props.className}`)
const computedStyle = computed(() => ({ ...props.style }))

function fitText() {
  const el = textEl.value
  if (!el) return

  const parent = el.parentElement
  const parentWidth = parent?.getBoundingClientRect().width || 0

  if (parentWidth < 1) {
    cancelAnimationFrame(fitText._rafId)
    fitText._rafId = requestAnimationFrame(fitText)
    return
  }

  const MIN = props.minSize
  const MAX = props.maxSize
  const PRECISION = 0.25

  el.style.whiteSpace = 'nowrap'
  el.style.overflow = 'hidden'
  
  el.style.fontSize = `${MAX}px`
  void el.offsetWidth
  if (el.scrollWidth <= parentWidth) {
    fontSize.value = MAX
    return
  }

  const wide = el.scrollWidth
  let high = Math.max(MIN, Math.min(MAX, Math.floor(MAX * (parentWidth / wide))))
  if (high < MIN) high = MIN

  el.style.fontSize = `${high}px`
  void el.offsetWidth

  let low = MIN
  let best = low
  let iterations = 0
  const MAX_ITER = 25

  while (high - low > PRECISION && iterations < MAX_ITER) {
    const mid = (low + high) / 2
    el.style.fontSize = `${mid}px`
    void el.offsetWidth

    if (el.scrollWidth <= parentWidth) {
      best = mid
      low = mid
    } else {
      high = mid
    }
    iterations++
  }

  fontSize.value = Math.max(MIN, Math.min(MAX, best))
  el.style.fontSize = `${fontSize.value}px`
}


onMounted(() => {
  nextTick(() => fitText())
  window.addEventListener('resize', fitText, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', fitText)
})

watch(() => props, async () => {
  await nextTick()
  fitText()
}, { deep: true })

defineExpose({ fitText })
</script>

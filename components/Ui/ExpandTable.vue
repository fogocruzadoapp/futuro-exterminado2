<template>
  <div>
    <div class="flex justify-center items-center mb-4">
      <a v-if="showExtraBtn" href="#serie-historica">
        <UiButton class="m-1">
          Filtrar série histórica
          <SvgoFilter class="transition-transform" :class="isOpen ? 'rotate-45' : 'rotate-0'" />
        </UiButton>
      </a>
      <UiButton class="m-1"
        :disabled="!hasRows"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="panelId"
        @click="toggle"
      >
        {{ isOpen ? buttonLabels.open : buttonLabels.closed }}
        <SvgoPlus class="transition-transform" :class="isOpen ? 'rotate-45' : 'rotate-0'" />
      </UiButton>
    </div>

    <Transition @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
      <div v-show="isOpen" :id="panelId" class="overflow-hidden">
        <UiTable :data="table" :striped="striped" :hover="hover" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  table: { type: Object, required: true }, // { tableHeaders, tableRows }
  defaultOpen: { type: Boolean, default: false },
  id: { type: String, default: undefined },
  showExtraBtn: { type: Boolean, default: false },
  buttonLabels: {
    type: Object,
    default: () => ({
      closed: 'Ver tabela de dados',
      open: 'Ocultar tabela de dados'
    })
  },
  striped: { type: Boolean, default: true },
  hover:   { type: Boolean, default: true }
})

// estado
const isOpen = ref(props.defaultOpen)
watch(() => props.defaultOpen, v => { isOpen.value = v })

const panelId = props.id ?? `table-${Math.random().toString(36).slice(2, 9)}`

// derived
const hasRows = computed(() => {
  const rows = props.table?.tableRows
  return Array.isArray(rows) && rows.length > 0
})

// actions
function toggle () {
  if (hasRows.value) isOpen.value = !isOpen.value
}

// transitions
function onEnter (el) {
  el.style.height = '0px'
  el.style.opacity = '0'
  const h = el.scrollHeight
  requestAnimationFrame(() => {
    el.style.transition = 'height 200ms ease, opacity 200ms ease'
    el.style.height = h + 'px'
    el.style.opacity = '1'
  })
}
function onAfterEnter (el) {
  el.style.height = 'auto'
  el.style.transition = ''
}
function onLeave (el) {
  el.style.height = el.scrollHeight + 'px'
  el.style.opacity = '1'
  requestAnimationFrame(() => {
    el.style.transition = 'height 200ms ease, opacity 200ms ease'
    el.style.height = '0px'
    el.style.opacity = '0'
  })
}
</script>
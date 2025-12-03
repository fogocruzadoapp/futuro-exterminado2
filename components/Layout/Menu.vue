<script setup>
import { useSlugify } from '@/composables/useSlugify';

const slugify = useSlugify();
const estados = inject('estados');

const menuBase = [
  { id: 'intro', label: 'Introdução', link: '/introducao' },
  { id: 'sobre', label: 'Sobre', link: '/sobre' },
];

const menu = computed(() => {
  const estadosValidos = estados?.value || [];
  const estadosMenu = estadosValidos.map((id) => ({
    id: id,
    label: id,
    mapa: `/mapa?estado=${slugify(id)}`,
    details: `/detalhes/${slugify(id)}`,
  }))
  return [...menuBase, ...estadosMenu]
})

const activeId = ref(null);
function handleToggle(id) {
  activeId.value = activeId.value === id ? null : id;
}
</script>

<template>
  <div class="flex flex-col gap-4 justify-center items-center">
    <UiCutText
      v-for="item in menu"
      :key="item.id"
      v-bind="item"
      :active="activeId === item.id"
      @toggle="handleToggle(item.id)"
    >
      {{ item.label }}
    </UiCutText>
  </div>
</template>

<template>
  <header
    class="w-full fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out"
    :class="{ 'transform -translate-y-full': !isHeaderVisible }"
  >
    <!-- Gradient -->
    <Transition name="header-fade">
      <div
        v-if="!isOpen"
        class="absolute inset-0 pointer-events-none header-gradient"
        style="z-index: 1"
      ></div>
    </Transition>
    <!-- Nav -->
    <nav class="flex items-center justify-between mx-2 md:mx-8 h-14 relative z-50">
      <div class="flex flex-1 justify-center w-full">
        <Transition name="logo-fade">
          <SvgoLogo
            v-if="shouldShowLogo"
            class="w-[200px] md:w-[240px] text-white"
            :fontControlled="false"
          />
        </Transition>
      </div>
      <!-- Controllers -->
      <div
        class="absolute top-0 left-0 w-full flex items-center justify-between h-full"
      >
        <div class="">
          <SvgoBullet class="w-[40px] md:w-[50px] text-white" :fontControlled="false" />
        </div>
        <div class="flex w-fit justify-end">
          <HeaderMenuButton
            :isOpen="isOpen"
            @open="openMenu"
            @close="closeMenu"
          />
        </div>
      </div>
    </nav>
    <!-- Curtains -->
    <HeaderCurtains :isOpen="isOpen" :isAnimating="isAnimating" />
    <!-- Background -->
    <HeaderBackground :showMenuContent="showMenuContent" />
    <!-- Menu -->
    <HeaderMenu :isOpen="isOpen" :showMenuContent="showMenuContent" />
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useHeaderAnimation } from '@/composables/useHeaderAnimation';
import { useScrollDirection } from '@/composables/useScrollDirection';

import HeaderMenuButton from './HeaderMenuButton.vue';
import HeaderCurtains from './HeaderCurtains.vue';
import HeaderBackground from './HeaderBackground.vue';
import HeaderMenu from './HeaderMenu.vue';
import '@/assets/css/header-animations.css';

const { isOpen, isAnimating, showMenuContent, openMenu, closeMenu } =
  useHeaderAnimation();

const { isElementVisible: isHeaderVisible } = useScrollDirection({
  direction: 'up',
});

// Lógica específica para a página de introdução
const route = useRoute();
const scrollY = ref(0);
const isMounted = ref(false);

// Inicializa o scroll no mount
onMounted(() => {
  scrollY.value = window.scrollY;
  isMounted.value = true;
  window.addEventListener('scroll', handleScroll);
});

// Verifica se está na página de introdução
const isIntroPage = computed(() => {
  return route.path === '/introducao';
});

// Controla a visibilidade do logo baseado no scroll
const shouldShowLogo = computed(() => {
  if (isIntroPage.value) {
    // Na introdução, só mostra o logo após 400px de scroll
    // Só avalia após o componente estar montado
    if (!isMounted.value) {
      return false;
    }
    return scrollY.value > 400;
  }
  // Em outras páginas, sempre mostra o logo
  return true;
});

// Listener de scroll
const handleScroll = () => {
  scrollY.value = window.scrollY;
};

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="css">
@reference "@/assets/css/global.css";
.header-gradient {
  @apply w-full h-full;
  background: linear-gradient(180deg, #160f38 0%, rgba(22, 15, 56, 0) 100%);
}

nav {
  @apply flex items-center h-14;
}

/* Fade para o conteúdo do menu */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Fade para o menu/fechar */
.fade-menu-enter-active,
.fade-menu-leave-active {
  transition: opacity 0.3s;
}
.fade-menu-enter-from,
.fade-menu-leave-to {
  opacity: 0;
}
.fade-menu-enter-to,
.fade-menu-leave-from {
  opacity: 1;
}

/* Fade para o background */
.background-enter-active {
  transition: opacity 1s;
}
.background-leave-active {
  transition: opacity 3s;
}
.background-enter-from,
.background-leave-to {
  opacity: 0;
}
.background-enter-to,
.background-leave-from {
  opacity: 1;
}

.header-fade-enter-active,
.header-fade-leave-active {
  transition: opacity 0.3s;
}
.header-fade-enter-from,
.header-fade-leave-to {
  opacity: 0;
}
.header-fade-enter-to,
.header-fade-leave-from {
  opacity: 1;
}

.fade-menu-btn-enter-active,
.fade-menu-btn-leave-active {
  transition: opacity 0.3s;
}
.fade-menu-btn-enter-from,
.fade-menu-btn-leave-to {
  opacity: 0;
}
.fade-menu-btn-enter-to,
.fade-menu-btn-leave-from {
  opacity: 1;
}

/* Fade para o logo */
.logo-fade-enter-active,
.logo-fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.logo-fade-enter-from,
.logo-fade-leave-to {
  opacity: 0;
}
.logo-fade-enter-to,
.logo-fade-leave-from {
  opacity: 1;
}
</style>

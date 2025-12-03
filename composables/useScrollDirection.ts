import { ref, onMounted, onUnmounted } from 'vue';

interface ScrollDirectionOptions {
  direction?: 'up' | 'down';
  scrollThreshold?: number;
  hideAfter?: number;
}

export function useScrollDirection(options: ScrollDirectionOptions = {}) {
  const {
    direction = 'up', // 'up' para esconder para cima (header), 'down' para esconder para baixo (footer)
    scrollThreshold = 10, // pixels para considerar como scroll significativo
    hideAfter = 100, // pixels de scroll antes de começar a esconder
  } = options;

  const isScrollingDown = ref(false);
  const isElementVisible = ref(true);
  const lastScrollY = ref(0);

  function handleScroll() {
    const currentScrollY = window.scrollY;

    // Só processa se a diferença for maior que o threshold
    if (Math.abs(currentScrollY - lastScrollY.value) < scrollThreshold) {
      return;
    }

    // Detecta direção do scroll
    if (currentScrollY > lastScrollY.value && currentScrollY > hideAfter) {
      // Scroll para baixo e passou do limite
      isScrollingDown.value = true;

      if (direction === 'up') {
        // Header: esconde para cima quando scroll para baixo
        isElementVisible.value = false;
      } else if (direction === 'down') {
        // BottomBar: aparece quando scroll para baixo
        isElementVisible.value = true;
      }
    } else if (currentScrollY < lastScrollY.value) {
      // Scroll para cima
      isScrollingDown.value = false;

      if (direction === 'up') {
        // Header: aparece quando scroll para cima
        isElementVisible.value = true;
      } else if (direction === 'down') {
        // BottomBar: esconde quando scroll para cima
        isElementVisible.value = false;
      }
    }

    // Se estiver no topo da página
    if (currentScrollY <= hideAfter) {
      if (direction === 'up') {
        // Header: sempre visível no topo
        isElementVisible.value = true;
      } else if (direction === 'down') {
        // BottomBar: escondido no topo
        isElementVisible.value = false;
      }
    }

    lastScrollY.value = currentScrollY;
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return {
    isScrollingDown,
    isElementVisible,
    lastScrollY,
  };
}

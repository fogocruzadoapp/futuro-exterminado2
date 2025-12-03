import { ref, onMounted, onUnmounted } from 'vue';

export function useParallax(speed: number = 0.1) {
  const element = ref<HTMLElement | null>(null);
  const transform = ref('');

  const handleMouseMove = (e: MouseEvent) => {
    if (!element.value) return;

    // Calcula a posição do mouse em relação ao centro da tela
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Aplica o movimento parallax
    const moveX = mouseX * speed;
    const moveY = mouseY * speed;

    transform.value = `translate(${moveX}px, ${moveY}px)`;
  };

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
  });

  return {
    element,
    transform,
  };
}

// Composable específico para múltiplos elementos com speeds diferentes
export function useMultipleParallax() {
  const parallaxElements = ref<
    Map<
      string,
      { element: HTMLElement | null; speed: number; transform: string }
    >
  >(new Map());

  const transforms = ref<Map<string, string>>(new Map());
  let mouseMoveTimeout: NodeJS.Timeout | null = null;

  const resetToOriginalPosition = () => {
    parallaxElements.value.forEach((item, key) => {
      const transformValue = 'translate(0px, 0px)';
      item.transform = transformValue;
      transforms.value.set(key, transformValue);
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    // Limpa o timeout anterior
    if (mouseMoveTimeout) {
      clearTimeout(mouseMoveTimeout);
    }

    // Calcula a posição do mouse em relação ao centro da tela
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    parallaxElements.value.forEach((item, key) => {
      if (item.element) {
        // Aplica o movimento parallax com speed específico para cada elemento
        const moveX = mouseX * item.speed;
        const moveY = mouseY * item.speed;

        const transformValue = `translate(${moveX}px, ${moveY}px)`;
        item.transform = transformValue;
        transforms.value.set(key, transformValue);
      }
    });

    // Define um timeout para voltar à posição original quando o mouse parar
    mouseMoveTimeout = setTimeout(() => {
      resetToOriginalPosition();
    }, 200); // Volta à posição original após 200ms sem movimento
  };

  const addParallaxElement = (key: string, speed: number) => {
    parallaxElements.value.set(key, {
      element: null,
      speed,
      transform: '',
    });

    return {
      setElement: (el: HTMLElement | null) => {
        if (parallaxElements.value.has(key)) {
          parallaxElements.value.get(key)!.element = el;
        }
      },
    };
  };

  const getTransform = (key: string) => {
    return transforms.value.get(key) || '';
  };

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    if (mouseMoveTimeout) {
      clearTimeout(mouseMoveTimeout);
    }
  });

  return {
    addParallaxElement,
    getTransform,
  };
}

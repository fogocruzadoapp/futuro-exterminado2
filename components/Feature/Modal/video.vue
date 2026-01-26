<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  url: { type: String, required: true },
  autoplay: { type: Boolean, default: false },
});
const emit = defineEmits(['close']);

const modalOverlayRef = ref<HTMLElement | null>(null);
const modalContentRef = ref<HTMLElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);
const previousActiveElement = ref<HTMLElement | null>(null);

const closeModal = () => {
  emit('close');
};

const extractVideoId = (url: string): string | null => {
  try {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      return null;
    }

    const directMatch = trimmedUrl.match(
      /(?:youtube\.com\/(?:embed\/|shorts\/|v\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    );

    if (directMatch && directMatch[1]) {
      return directMatch[1];
    }

    const parsed = new URL(trimmedUrl);

    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1) || null;
    }

    if (parsed.searchParams.has('v')) {
      return parsed.searchParams.get('v');
    }

    return null;
  } catch (error) {
    console.warn('[VideoPlayerYoutube] URL inválida fornecida:', url, error);
    return null;
  }
};

const videoId = computed(() => extractVideoId(props.url));

const embedUrl = computed(() => {
  if (!videoId.value) return '';

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });

  if (props.autoplay) {
    params.set('autoplay', '1');
    params.set('mute', '1');
  }

  return `https://www.youtube.com/embed/${videoId.value}?${params.toString()}`;
});

// Função para capturar elementos focáveis dentro do modal
const getFocusableElements = (): HTMLElement[] => {
  if (!modalOverlayRef.value) return [];
  const focusableSelectors =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return Array.from(
    modalOverlayRef.value.querySelectorAll<HTMLElement>(focusableSelectors),
  ).filter(
    (el: HTMLElement) =>
      !el.hasAttribute('disabled') &&
      !el.hasAttribute('aria-hidden') &&
      el.offsetParent !== null && // Elemento visível
      !el.closest('[aria-hidden="true"]'), // Não está dentro de elemento oculto
  );
};

// Trap de foco - impede que Tab saia do modal
const handleTabKey = (event: KeyboardEvent) => {
  const focusableElements = getFocusableElements();
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
};

watch(
  () => props.isOpen,
  async (isOpen) => {
    if (!import.meta.client) return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Salvar elemento ativo anterior
      previousActiveElement.value = document.activeElement as HTMLElement;
      // Aguardar DOM estar pronto e focar no botão de fechar
      await nextTick();
      // Pequeno delay para garantir que o modal está totalmente renderizado
      setTimeout(() => {
        if (closeButtonRef.value) {
          closeButtonRef.value.focus();
        } else if (modalOverlayRef.value) {
          // Se o botão não estiver disponível, focar no overlay
          modalOverlayRef.value.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = '';
      // Retornar foco ao elemento anterior quando fechar
      if (
        previousActiveElement.value &&
        previousActiveElement.value instanceof HTMLElement
      ) {
        previousActiveElement.value.focus();
      }
    }
  },
);
</script>

<template>
  <!-- Modal Overlay -->
  <div
    v-if="isOpen"
    ref="modalOverlayRef"
    class="fixed max-h-screen max-w-screen inset-0 z-50 flex flex-col items-center justify-center bg-blue-900/90 bg-opacity-50"
    @click="closeModal()"
    role="dialog"
    aria-modal="true"
    aria-labelledby="video-modal-title"
    aria-describedby="video-modal-description"
    @keydown.escape="closeModal()"
    @keydown.tab="handleTabKey"
  >
    <h2 id="video-modal-title" class="sr-only">
      Reprodutor de vídeo do YouTube
    </h2>
    <p id="video-modal-description" class="sr-only">
      Use as setas do teclado para navegar pelos controles do vídeo. Pressione
      Escape para fechar o modal.
    </p>
    <!-- Modal Content -->
    <div
      ref="modalContentRef"
      class="relative w-full max-w-[640px] overflow-auto"
      @click.stop
    >
      <!-- Close Button -->
      <div class="flex justify-end pt-2 pr-2">
        <button
          ref="closeButtonRef"
          @click="closeModal()"
          class="flex align-middle mb-2 justify-end cursor-pointer border-none w-fit focus-visible:outline-2 focus-visible:outline-yellow-300 focus-visible:outline-offset-2 bg-transparent"
          aria-label="Fechar modal de vídeo"
        >
          <span
            class="font-bigShouldersRegular text-white flex items-center justify-center text-lg uppercase mr-2"
            aria-hidden="true"
            >Fechar</span
          >
          <span class="flex items-center justify-center" aria-hidden="true">
            <svg
              width="19"
              height="20"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M8.00098 7.31836L10.0225 5.29688L10.8662 6.81738L9.17871 8.50391L14.3975 13.7227L13.2197 14.9004L10.5156 12.2041L8.00098 7.66895V9.68164L2.77441 14.9004L1.59668 13.7227L6.81543 8.50391L1.59668 3.27734L2.77441 2.09961L8.00098 7.31836ZM14.3975 3.27734L11.3418 6.34082V3.97754L13.2197 2.09961L14.3975 3.27734Z"
                fill="#FFFFFF"
              />
            </svg>
          </span>
        </button>
      </div>
      <div class="relative aspect-video w-full">
        <iframe
          v-if="embedUrl"
          class="absolute inset-0 h-full w-full"
          :src="embedUrl"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          title="Reprodutor de vídeo do YouTube"
          :aria-label="`Vídeo do YouTube. ID do vídeo: ${
            videoId || 'desconhecido'
          }`"
        ></iframe>
        <p
          v-else
          class="absolute inset-0 flex h-full w-full items-center justify-center bg-blue-1000 text-center text-white"
          role="alert"
          aria-live="polite"
        >
          Vídeo indisponível
        </p>
      </div>
    </div>
    <FeatureTexturaSection :z-index="-10" />
  </div>
</template>

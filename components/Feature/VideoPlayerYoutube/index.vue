<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    url: string;
    title?: string;
    autoplay?: boolean;
  }>(),
  {
    title: 'YouTube video player',
    autoplay: false,
  },
);

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
  if (!videoId.value) {
    return '';
  }

  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  });

  if (props.autoplay) {
    params.set('autoplay', '1');
    params.set('mute', '1'); // autoplay em navegadores geralmente exige mute
  }

  return `https://www.youtube.com/embed/${videoId.value}?${params.toString()}`;
});
</script>

<template>
  <div class="relative w-full overflow-hidden bg-black">
    <div class="relative aspect-video w-full">
      <iframe
        v-if="embedUrl"
        class="absolute inset-0 h-full w-full"
        :src="embedUrl"
        :title="title"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
      <div
        v-else
        class="absolute inset-0 flex h-full w-full items-center justify-center bg-blue-1000 text-center text-white"
      >
        Vídeo indisponível
      </div>
    </div>
  </div>
</template>


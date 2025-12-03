<script setup>
const props = defineProps({
  play: {
    type: Number,
    default: 1, // 2 = roda sequência (crianças -> tiro -> música), senão ambiente
  },
});

const playercriancas = ref(null);
const playertiro = ref(null);
const playermusica = ref(null);
const isMuted = ref(false);

// NOVO: estado da jornada da intro
const hasIntroFinished = ref(false);

// NOVO: timers para poder cancelar quando mutar
let t1 = null;
let t2 = null;

watch(
  () => props.play,
  (newPlay) => controleAudio(newPlay),
);

onMounted(() => {
  // volumes/mute garantidos na montagem (opcional)
  [playercriancas.value, playertiro.value, playermusica.value].forEach((a) => {
    if (!a) return;
    a.muted = false;
    a.volume = 1;
  });

  controleAudio(props.play);
});

function clearTimers() {
  if (t1) { clearTimeout(t1); t1 = null; }
  if (t2) { clearTimeout(t2); t2 = null; }
}

function pauseAll() {
  [playercriancas.value, playertiro.value, playermusica.value].forEach((a) => {
    if (!a) return;
    a.pause();
    // opcional: resetar posição
    // a.currentTime = 0;
  });
}

function startMusicOnly() {
  if (playercriancas.value) {
    playercriancas.value.pause();
    playercriancas.value.currentTime = 0;
  }
  if (playertiro.value) {
    playertiro.value.pause();
    playertiro.value.currentTime = 0;
  }
  if (playermusica.value) {
    playermusica.value.loop = true;
    playermusica.value.play().catch(() => {});
  }
}

const controleAudio = (play) => {
  // SEMPRE limpamos timers antes de decidir o que tocar
  clearTimers();

  if (isMuted.value) {
    pauseAll();
    [playercriancas.value, playertiro.value, playermusica.value].forEach((a) => {
      if (a) a.muted = true;
    });
    return;
  }

  // desmutado
  [playercriancas.value, playertiro.value, playermusica.value].forEach((a) => {
    if (a) a.muted = false;
  });

  // Se a intro já terminou (ou foi marcada como concluída), toca só música
  if (hasIntroFinished.value) {
    startMusicOnly();
    return;
  }

  // Intro ainda não terminou
  if (play === 2) {
    // sequência: crianças (loop) -> tiro -> música -> marca finished
    if (!playercriancas.value || !playertiro.value || !playermusica.value) return;

    // começa com crianças
    playercriancas.value.currentTime = 0;
    playercriancas.value.loop = true;
    playercriancas.value.play().catch(() => {});

    // depois de 3.5s: pausa crianças e toca tiro
    t1 = setTimeout(() => {
      playercriancas.value.pause();

      playertiro.value.currentTime = 0;
      playertiro.value.play().catch(() => {});

      // 1.5s depois: música e finaliza
      t2 = setTimeout(() => {
        playermusica.value.currentTime = 0;
        playermusica.value.loop = true;
        playermusica.value.play().catch(() => {});
        hasIntroFinished.value = true; // <- a partir daqui, só música
      }, 1500);
    }, 3500);
  } else {
    // modo ambiente se quiser quando play != 2 (mantido do teu script)
    if (playercriancas.value) {
      playercriancas.value.loop = true;
      playercriancas.value.play().catch(() => {});
    }
  }
};

const toggleMute = () => {
  isMuted.value = !isMuted.value;

  if (isMuted.value) {
    // ao mutar, cancela quaisquer timers e interrompe tudo
    clearTimers();
    pauseAll();

    // Importante: se estava no meio da intro, marcamos como concluída
    // assim, ao desmutar, NÃO recomeça crianças/tiro — só a música
    if (props.play === 2) {
      hasIntroFinished.value = true;
    }

    [playercriancas.value, playertiro.value, playermusica.value].forEach((a) => {
      if (a) a.muted = true;
    });
  } else {
    // desmutar: respeita a lógica (se intro concluída -> só música)
    controleAudio(props.play);
  }
};

// Limpa o áudio quando o componente é desmontado
onUnmounted(() => {
  clearTimers();
  pauseAll();
});
</script>


<template>
  <div class="fixed z-40 bottom-8 left-8">
    <audio
      src="/audio/criancas.mp3"
      autoplay
      volume="1"
      loop="true"
      preload="auto"
      ref="playercriancas"
    ></audio>
    <audio
      src="/audio/tiro.mp3"
      volume="1"
      preload="auto"
      ref="playertiro"
    ></audio>
    <audio
      src="/audio/musica.mp3"
      volume="1"
      loop="true"
      preload="auto"
      ref="playermusica"
    ></audio>
    <!-- Botão de Som -->
    <button
      @click="toggleMute"
      class="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200 p-2 -m-2 focus:outline-none cursor-pointer"
    >
      <!-- Ícone que muda entre som normal e som mutado -->
      <div class="relative flex items-center justify-center">
        <!-- Equalizador -->
        <div v-if="!isMuted" class="equalizer">
          <svg
            width="33"
            height="33"
            viewBox="0 0 33 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Barra 1 (esquerda) - forma original com animação -->
            <path
              d="M3.2041 16.8001L0.804101 21.1201L0.804101 21.6001L2.0041 21.6001L0.804101 23.7601L0.804101 32.7961L3.2041 32.7961L3.2041 0.796143L0.804101 0.796142L0.804101 16.8001L3.2041 16.8001Z"
              fill="#FFAD33"
              class="bar bar-1"
            />
            <!-- Barra 2 -->
            <path
              d="M10.6035 32.7962L10.6035 12.7922L8.20352 12.7922L8.20352 32.7962L10.6035 32.7962Z"
              fill="#FFAD33"
              class="bar bar-2"
            />
            <!-- Barra 3 (centro) - forma original com animação -->
            <path
              d="M17.7998 28.8L15.6038 28.8L17.7998 24.84L17.7998 16.8L15.3998 16.8L15.3998 32.796L17.7998 32.796L17.7998 28.8Z"
              fill="#FFAD33"
              class="bar bar-3"
            />
            <!-- Barra 4 -->
            <path
              d="M24.7012 32.7962L24.7012 4.79224L22.3012 4.79224L22.3012 32.7962L24.7012 32.7962Z"
              fill="#FFAD33"
              class="bar bar-4"
            />
            <!-- Barra 5 (direita) - forma original com animação -->
            <path
              d="M32.1016 16.8001L29.7016 21.1201L29.7016 21.6001L30.9016 21.6001L29.7016 23.7601L29.7016 32.7961L32.1016 32.7961L32.1016 8.79614L29.7016 8.79614L29.7016 16.8001L32.1016 16.8001Z"
              fill="#FFAD33"
              class="bar bar-5"
            />
          </svg>
        </div>
        <!-- X sobreposto quando mutado -->
        <SvgoMutesom
          v-if="isMuted"
          :fontControlled="false"
          class="w-8 h-8 transition-all translate-y-1 duration-200 text-yellow-300"
        />
      </div>
    </button>
  </div>
</template>

<style scoped>
.equalizer {
  display: flex;
  align-items: flex-end;
  height: 33px;
}

.bar {
  transform-origin: bottom;
  animation-duration: 0.8s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.bar-1 {
  animation-name: equalizer-bar-1;
  animation-delay: 0s;
}

.bar-2 {
  animation-name: equalizer-bar-2;
  animation-delay: 0.15s;
}

.bar-3 {
  animation-name: equalizer-bar-3;
  animation-delay: 0.3s;
}

.bar-4 {
  animation-name: equalizer-bar-4;
  animation-delay: 0.45s;
}

.bar-5 {
  animation-name: equalizer-bar-5;
  animation-delay: 0.6s;
}

@keyframes equalizer-bar-1 {
  0% {
    transform: scaleY(0.2);
  }
  50% {
    transform: scaleY(0.8);
  }
  100% {
    transform: scaleY(0.4);
  }
}

@keyframes equalizer-bar-2 {
  0% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1.1);
  }
  100% {
    transform: scaleY(0.6);
  }
}

@keyframes equalizer-bar-3 {
  0% {
    transform: scaleY(0.4);
  }
  50% {
    transform: scaleY(0.9);
  }
  100% {
    transform: scaleY(0.5);
  }
}

@keyframes equalizer-bar-4 {
  0% {
    transform: scaleY(0.1);
  }
  50% {
    transform: scaleY(1.3);
  }
  100% {
    transform: scaleY(0.3);
  }
}

@keyframes equalizer-bar-5 {
  0% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0.7);
  }
}
</style>

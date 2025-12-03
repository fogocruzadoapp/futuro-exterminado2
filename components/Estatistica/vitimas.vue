<script setup>
import { ref } from 'vue';

// Ref para o container pai
const containerRef = ref(null);

// Configuração padrão para os cards
const configEsquerda = {
  scaleEntrada: 1, // Tamanho na entrada (grande)
  scaleMeio: 1.2, // Tamanho no meio (centro da tela)
  scaleSaida: 2.0, // Tamanho na saída (pequeno)
  // Blur (desfoque)
  blurEntrada: 0, // Blur na entrada (muito desfocado)
  blurMeio: 0, // Blur no meio (nítida)
  blurSaida: 10, // Blur na saída (nítida)
  // Rotação (graus)
  rotationEntrada: -10, // Rotação na entrada (20 graus)
  rotationMeio: 5, // Rotação no meio (5 graus)
  rotationSaida: 15, // Rotação na saída (sem rotação)
  // Translate Y (movimento vertical)
  translateYEntrada: -200, // Movimento para cima na entrada
  translateYMeio: -250, // Movimento para cima no meio
  translateYSaida: -300, // Movimento para baixo na saída
  // Translate X (movimento horizontal)
  translateXEntrada: 100, // Movimento para direita na entrada
  translateXMeio: 0, // Movimento para direita no meio
  translateXSaida: -150, // Movimento para direita na saída
};
const configDireita = {
  scaleEntrada: 1, // Tamanho na entrada (grande)
  scaleMeio: 1.2, // Tamanho no meio (centro da tela)
  scaleSaida: 2.0, // Tamanho na saída (pequeno)
  // Blur (desfoque)
  blurEntrada: 0, // Blur na entrada (muito desfocado)
  blurMeio: 0, // Blur no meio (nítida)
  blurSaida: 10, // Blur na saída (nítida)
  // Rotação (graus)
  rotationEntrada: 10, // Rotação na entrada (20 graus)
  rotationMeio: -5, // Rotação no meio (5 graus)
  rotationSaida: -15, // Rotação na saída (sem rotação)
  // Translate Y (movimento vertical)
  translateYEntrada: -200, // Movimento para cima na entrada
  translateYMeio: -250, // Movimento para cima no meio
  translateYSaida: -300, // Movimento para baixo na saída
  // Translate X (movimento horizontal)
  translateXEntrada: -100, // Movimento para direita na entrada
  translateXMeio: 0, // Movimento para direita no meio
  translateXSaida: 150, // Movimento para direita na saída
};

// Array de dados das vítimas
const vitimas = [
  {
    id: 1,
    image: '/images/cards/darik.png',
    imageSize: 'max-w-[400px] max-h-[400px]',
    nome: 'DARIK',
    localizacao: 'Jordão, Recife - PE',
    descricao:
      'Morto por bala perdida em 16 de março de 2024 durante ação policial',
    align: 'left',
    config: configEsquerda,
  },
  {
    id: 2,
    image: '/images/cards/maria.png',
    imageSize: 'max-w-[400px] max-h-[400px]',
    nome: 'Maria Eduarda',
    localizacao: 'Acari, Rio de Janeiro - RJ',
    descricao: 'Morta em 29 de março de 2017 durante ação policial',
    align: 'right',
    config: configDireita,
  },
  {
    id: 3,
    image: '/images/cards/samuel.png',
    imageSize: 'max-w-[400px] max-h-[400px]',
    nome: 'Samuel',
    localizacao: 'Itinga, Salvador - BA',
    descricao:
      'Morto dentro de casa por bala perdida em 18 de dezembro de 2024',
    align: 'left',
    config: configEsquerda,
  },
  {
    id: 4,
    image: '/images/cards/heloysa.png',
    imageSize: 'max-w-[400px] max-h-[400px]',
    nome: 'Heloysa',
    localizacao: 'Vila de Porto de Galinhas, Ipojuca - PE',
    descricao:
      'Morta dentro de casa por bala perdida em 30 de março de 2022 durante ação policial',
    align: 'right',
    config: configDireita,
  },
];
</script>

<template>
  <!-- Cards das vítimas renderizados com v-for -->
  <section
    ref="containerRef"
    class="min-h-screen gap-[400px] md:gap-0 flex flex-col w-full"
  >
    <FeatureCardVitima
      v-for="vitima in vitimas"
      :key="vitima.id"
      :image="vitima.image"
      :image-size="vitima.imageSize"
      :nome="vitima.nome"
      :localizacao="vitima.localizacao"
      :descricao="vitima.descricao"
      :align="vitima.align"
      :config="vitima.config"
      :container-ref="containerRef"
    />
  </section>
</template>

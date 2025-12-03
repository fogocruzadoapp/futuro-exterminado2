import { ref, computed } from 'vue';

// Lista fixa de imagens para evitar problemas de hidratação SSR
const availableImages = [
  '/images/vitimas/vitima1.png',
  '/images/vitimas/vitima2.png',
  '/images/vitimas/vitima3.png',
  '/images/vitimas/vitima4.png',
  '/images/vitimas/vitima5.png',
  '/images/vitimas/vitima6.png',
];

export function useRandomImages() {
  // Array local para controlar quais imagens já foram usadas nesta instância
  const usedImages = ref<string[]>([]);

  // Função para obter uma imagem aleatória não repetida
  const getRandomImage = (): string => {
    // Se todas as imagens já foram usadas, reseta o array
    if (usedImages.value.length >= availableImages.length) {
      usedImages.value = [];
    }

    // Filtra imagens não utilizadas
    const availableUnusedImages = availableImages.filter(
      (image) => !usedImages.value.includes(image),
    );

    // Verifica se há imagens disponíveis
    if (availableUnusedImages.length === 0) {
      return availableImages[0];
    }

    // Seleciona uma imagem aleatória
    const randomIndex = Math.floor(
      Math.random() * availableUnusedImages.length,
    );
    const selectedImage = availableUnusedImages[randomIndex];

    // Adiciona à lista de usadas
    usedImages.value.push(selectedImage);

    return selectedImage;
  };

  // Função para obter múltiplas imagens aleatórias SEM repetição
  const getRandomImages = (count: number): string[] => {
    // Se o número solicitado é maior que o disponível, ajusta
    const maxCount = Math.min(count, availableImages.length);

    // Cria uma cópia do array de imagens disponíveis
    const availableImagesCopy = [...availableImages];
    const selectedImages: string[] = [];

    // Seleciona imagens aleatórias sem repetição
    for (let i = 0; i < maxCount; i++) {
      const randomIndex = Math.floor(
        Math.random() * availableImagesCopy.length,
      );
      const selectedImage = availableImagesCopy[randomIndex];

      selectedImages.push(selectedImage);
      availableImagesCopy.splice(randomIndex, 1); // Remove a imagem selecionada
    }

    return selectedImages;
  };

  // Função para resetar as imagens usadas
  const resetUsedImages = () => {
    usedImages.value = [];
  };

  // Computed para verificar quantas imagens ainda estão disponíveis
  const remainingImages = computed(
    () => availableImages.length - usedImages.value.length,
  );

  return {
    getRandomImage,
    getRandomImages,
    resetUsedImages,
    remainingImages,
    availableImages,
  };
}

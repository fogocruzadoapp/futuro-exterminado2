<!-- pages/index.vue -->
<template>
  <main>
    <HeroCapa
      :controleGeral="controleGeral"
      @start-intro="startIntro"
    />
    <FeatureModalVitima
      v-if="modalData"
      :id="modalData.occurrenceId"
      :is-open="isModalOpen"
      :name="modalData.name"
      :genre="modalData.genre"
      :race="modalData.race"
      :age="modalData.age"
      :ageGroup="modalData.ageGroup"
      :situation="modalData.situation"
      :acaoPolicial="modalData.policeAction"
      :balaPerdida="modalData.circumstances.includes('Bala perdida')"
      :dentroDeCasa="modalData.place && modalData.place.includes('Residência')"
      :date="modalData.date"
      :locality="modalData.locality"
      :subNeighborhood="modalData.subNeighborhood"
      :neighborhood="modalData.neighborhood"
      :city="modalData.city"
      :state="modalData.state"
      :bgColor="modalData.bgColor"
      :pathFill="modalData.pathFill"
      :image="modalData.image"
      :imageSize="modalData.imageSize"
      backgroundColor
      @close="closeModal"
    />
  </main>
</template>

<script setup>
  // Imports e configs
    const route = useRoute();
    const router = useRouter();
    const slugify = useSlugify();

  // Data
    const vitimas = inject('vitimas');
    const controleGeral = useState('controleGeral', () => false)
    const isModalOpen = ref(false);
    const modalData = ref(false);

  //Mounted
  onMounted(() => {
    if (route.query.id) {
      openModal(route.query.id);
    }
  });

  // Functions
  const startIntro = () => {
    controleGeral.value = true
    navigateTo('/introducao');
  }

  function openModal(id) {
    const o = vitimas.value?.find((o) => o.occurrenceId === id);
    if (!o) return;
    o.bgColor = o.situation === 'Dead' ? '#EC6775' : '#A64DFF';
    o.pathFill = o.situation === 'Dead' ? '#EC6775' : '#A64DFF';
    o.image = `/images/destaques/${slugify(o.occurrenceId)}.png`;
    o.imageSize = 'w-[320px] h-[320px]';
    modalData.value = o;
    isModalOpen.value = true;
  }

  const closeModal = () => {
    isModalOpen.value = false;
  };

  // Watches
  watch(
    () => route.query.id,
    (newId) => {
      if (newId) openModal(newId);
    },
  );
// Redireciona para /introducao
//await navigateTo('/introducao');
</script>

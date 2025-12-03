<template>
  <aside
    class="min-w-full w-full md:min-w-100 md:w-96 h-fit md:max-h-[80vh] z-20 overflow-clip flex text-white relative"
  >
    <!-- Definição do clip-path SVG (invisível) -->
    <svg width="0" height="0" style="position: absolute">
      <defs>
        <clipPath id="clip-sidebar-inline" clipPathUnits="objectBoundingBox">
          <path
            d="M 0.0833 1 L 0 1 L 0 0.534 L 0.0833 0.441 L 0.0282 0.441 L 0.0417 0.426 L 0.0181 0.426 L 0.0521 0.387 L 0 0.387 L 0 0.138 L 0.0417 0.092 L 0 0.092 L 0.0833 0 L 0.0833 1 Z M 0 0.138 L 0 0.138 L 0 0.097 L 0 0.068 L 0 0.138 Z"
            fill="white"
          />
          <path d="M 0 0.045 L 0 0 L 0.0391 0 L 0 0.045 Z" fill="white" />
          <rect x="0.0833" y="0" width="0.833" height="1" fill="white" />
          <path
            d="M 0.9141 0.235 L 1 0.235 L 1 0.907 L 0.9141 1 L 0.9141 0.235 Z"
            fill="white"
          />
          <path
            d="M 1 0.107 L 0.9505 0.158 L 0.9839 0.158 L 0.9141 0.235 L 0.9141 0 L 1 0 L 1 0.107 Z"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>

    <!-- Fundo com blur e clip-path aplicado -->
    <div
      class="absolute inset-0 backdrop-blur-md bg-indigo/60 pointer-events-none z-0"
      style="
        clip-path: url(#clip-sidebar-inline);
        -webkit-clip-path: url(#clip-sidebar-inline);
      "
    ></div>

    <!-- Conteúdo -->
    <div class="py-8 px-10 flex flex-col gap-4 relative z-10 w-full">
      <!--  Title with select -->
      <div class="font-bigShoulders text-2xl uppercase z-40">
        <span>
          {{ vitimasDoAno.length }} crianças e adolescentes foram baleados na
          região metropolitana d{{estadoSelecionado === 'rio-de-janeiro' ? 'o' : 'e'}}
          {{ mapaCapitais[estadoSelecionado]}}
          {{ filtros.ano ? 'em ' : 'entre' }}
        </span>
        <span class="inline-block whitespace-nowrap ml-1">
          <UiSelect
            v-model="filtros.ano"
            :options="anosDisponiveis"
            :defaultOptionLabel="'Todos os períodos'"
            label="Ano"
            :placeholder="`${anosDisponiveis.at(-1)} - ${anosDisponiveis[0]}`"
            class="inline-block"
          >
            <template #label>
              <div class="flex items-center">
                {{
                  filtros.ano === '' || filtros.ano === undefined
                    ? `${anosDisponiveis.at(-1)} e ${anosDisponiveis[0]}`
                    : filtros.ano
                }}
                <span class="text-yellow-300"><SvgoDropdown /></span>
              </div>
            </template>
          </UiSelect>
        </span>
      </div>
      <!-- Wrapper -->
      <div class="md:overflow-y-auto hide-scrollbar flex flex-col gap-4">
        <!--  Subtitle with victim count -->
        <div>
          <div class="text-sm font-light leading-none text-violet-light mb-2">
            <span v-if="vitimasFiltradas.length !== vitimasDoAno.length">
              Sobre as
              <span class="font-bold text-white">{{
                vitimasFiltradas.length
              }}</span>
              de {{ vitimasDoAno.length }} vítimas
            </span>
            <span v-else>Sobre as {{ vitimasFiltradas.length }} vítimas</span>
          </div>
          <!-- Graphic -->
          <MapChartCircle
            :anoMortos="anoMortos"
            :anoFeridos="anoFeridos"
            :situacaoMortos="situacaoMortos"
            :situacaoFeridos="situacaoFeridos"
          />
        </div>
        <!-- Cards -->
        <div class="grid grid-cols-3 gap-1.5 my-3">
          <!-- Operação/Ação policial -->
          <CardCategoria
            categoria="acaoPolicial"
            :feridos="feridosOperacao"
            :mortos="mortosOperacao"
            titulo="Operação / Ação policial"
            :icone="SvgoCar1"
            :totalGeral="vitimasFiltradas.length"
          />
          <!-- Bala perdida -->
          <CardCategoria
            categoria="balaPerdida"
            :feridos="feridosBalaperdida"
            :mortos="mortosBalaperdida"
            titulo="Bala perdida"
            :icone="SvgoAmmo2"
            :totalGeral="vitimasFiltradas.length"
          />
          <!-- Dentro de casa -->
          <CardCategoria
            categoria="dentroDeCasa"
            :feridos="feridosResidencia"
            :mortos="mortosResidencia"
            titulo="Dentro de casa"
            :icone="SvgoHouse2"
            :totalGeral="vitimasFiltradas.length"
          />
        </div>
      </div>
      <!-- Estados -->
      <div class="flex justify-between items-center">
        <UiSelect
          v-model="estadoSelecionado"
          :options="estados"
          label="Estado"
          placeholder="Selecione o estado"
          dropdownDirection="up"
        >
          <template #label>
            <UiLink> Alterar região </UiLink>
          </template>
        </UiSelect>

        <NuxtLink :to="{ path: '/detalhes/' + slugify(estadoSelecionado) }">
          <UiButton> Ver detalhes da região </UiButton>
        </NuxtLink>
      </div>
    </div>
  </aside>
</template>
<script setup>
import { ref, computed, watchEffect } from 'vue';
import { UiSelect, SvgoAmmo2, SvgoCar1, SvgoHouse2 } from '#components';
import CardCategoria from './CardCategoria.vue';
const slugify = useSlugify();

// Data e Refs
const filtros = inject('filtros');
const vitimas = inject('vitimas');
const mapaCapitais = inject('mapaCapitais');
const estadoSelecionado = inject('estadoSelecionado');
const vitimasFiltradas = inject('vitimasFiltradas');
const vitimasDoEstado = inject('vitimasDoEstado');
const vitimasDoAno = inject('vitimasDoAno');
const anosDisponiveis = inject('anosDisponiveis');

// Computed
const anoMortos = computed(
  () => vitimasDoAno.value.filter((o) => o.situation === 'Dead').length,
);
const anoFeridos = computed(
  () => vitimasDoAno.value.filter((o) => o.situation === 'Wounded').length,
);
const situacaoMortos = computed(
  () => vitimasFiltradas.value.filter((o) => o.situation === 'Dead').length,
);
const situacaoFeridos = computed(
  () => vitimasFiltradas.value.filter((o) => o.situation === 'Wounded').length,
);
const mortosResidencia = computed(
  () =>
    vitimasFiltradas.value.filter(
      (o) =>
        o.situation === 'Dead' && o.place.toLowerCase().includes('residência'),
    ).length,
);
const feridosResidencia = computed(
  () =>
    vitimasFiltradas.value.filter(
      (o) =>
        o.situation === 'Wounded' &&
        o.place.toLowerCase().includes('residência'),
    ).length,
);
const mortosBalaperdida = computed(
  () =>
    vitimasFiltradas.value.filter(
      (o) =>
        o.situation === 'Dead' &&
        Array.isArray(o.circumstances) &&
        o.circumstances.includes('Bala perdida'),
    ).length,
);
const feridosBalaperdida = computed(
  () =>
    vitimasFiltradas.value.filter(
      (o) =>
        o.situation === 'Wounded' &&
        Array.isArray(o.circumstances) &&
        o.circumstances.includes('Bala perdida'),
    ).length,
);
const mortosOperacao = computed(
  () =>
    vitimasFiltradas.value.filter(
      (o) => o.situation === 'Dead' && o.policeAction,
    ).length,
);
const feridosOperacao = computed(
  () =>
    vitimasFiltradas.value.filter(
      (o) => o.situation === 'Wounded' && o.policeAction,
    ).length,
);

const estados = computed(() => {
  return [...new Set(vitimas.value.map((o) => o.state).filter(Boolean))].sort();
});

const vítimasSemCategoria = computed(() => {
  return vitimasFiltradas.value.filter((o) => {
    const temOperacao = o.policeAction;
    const temBalaPerdida =
      Array.isArray(o.circumstances) &&
      o.circumstances.includes('Bala perdida');
    const temResidencia = o.place.toLowerCase().includes('residência');

    return !temOperacao && !temBalaPerdida && !temResidencia;
  }).length;
});

// Log para debug
watchEffect(() => {
  // Análise detalhada das sobreposições
  const vitimasComSobreposicao = vitimasFiltradas.value.filter((o) => {
    const temOperacao = o.policeAction;
    const temBalaPerdida =
      Array.isArray(o.circumstances) &&
      o.circumstances.includes('Bala perdida');
    const temResidencia = o.place.toLowerCase().includes('residência');

    const categorias = [temOperacao, temBalaPerdida, temResidencia].filter(
      Boolean,
    );
    return categorias.length > 1;
  });

  // Vítimas sem categoria
  const vitimasSemCategoriaDetalhado = vitimasFiltradas.value.filter((o) => {
    const temOperacao = o.policeAction;
    const temBalaPerdida =
      Array.isArray(o.circumstances) &&
      o.circumstances.includes('Bala perdida');
    const temResidencia = o.place.toLowerCase().includes('residência');

    return !temOperacao && !temBalaPerdida && !temResidencia;
  });
});
</script>
<style scoped lang="css">
@reference "@/assets/css/global.css";

.state-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>

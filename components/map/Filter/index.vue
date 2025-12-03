<template>
  <Transition
  appear
  enter-from-class="opacity-0 md:-ml-[300px]"
  enter-active-class="[transition-property:transform,opacity,margin-left] duration-300 ease-out"
  enter-to-class="opacity-100 md:ml-0"
  leave-from-class="opacity-100 md:ml-0"
  leave-active-class="[transition-property:transform,opacity,margin-left] duration-200 ease-in"
  leave-to-class="opacity-0 md:-ml-[300px]"
>
  <aside
    v-if="showAside"
    class="md:min-w-72 w-72 h-[690px] overflow-clip max-h-[80vh] flex text-white relative z-15 "
  >
    <!-- Fundo com blur e máscara unificada -->
    <div
      class="absolute inset-0 backdrop-blur-md bg-indigo/60 pointer-events-none"
      style="
        -webkit-mask-image: url('#mask-sidebar-filtros');
        mask-image: url('#mask-sidebar-filtros');
        mask-size: cover;
        mask-repeat: no-repeat;
        -webkit-mask-size: cover;
        -webkit-mask-repeat: no-repeat;
      "
    >
      <svg width="0" height="0">
        <defs>
          <mask
            id="mask-sidebar-filtros"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="288"
            height="690"
          >
            <path
              d="M288 0V340L272 367.667H288L256 423H288V634L256 690H0V542L16 514H4.57129L24 480H0V56L32 0H288Z"
              fill="white"
            />
            <path d="M288 680H273L288 652V650Z" fill="white" />
          </mask>
        </defs>
      </svg>
    </div>
    <!-- Conteúdo -->
    <div class="py-4 mx-8 px-1 relative z-10 w-full">
      <!-- Filtro -->
      <div class="flex pt-2 pb-4 items-center justify-between">
        <span
          class="leading-7 tracking-tight text-white font-host font-semibold"
        >
          Filtros
        </span>
        <UiLink @click="limparFiltros"> Limpar </UiLink>
      </div>

      <div
        class="overflow-scroll relative w-full max-h-[calc(100%-60px)] scroll-smooth hide-scrollbar"
      >
        <!-- Sobre as Ocorrencias -->
        <div
          class="self-stretch inline-flex flex-col justify-start items-start gap-4"
        >
          <!--  Sobre as ocorrências -->
          <div class="self-stretch inline-flex justify-start items-start">
            <div
              class="flex-1 justify-start text-blue-300 text-sm font-light leading-none"
            >
              Sobre as ocorrências
            </div>
          </div>
          <!--  Opções Toogle -->
          <div class="flex flex-col gap-4">
            <!--   Operação/Ação policial -->
            <div>
              <div class="self-stretch flex justify-between items-center gap-2">
                <!-- Icon -->
                <SvgoCar class="w-6 h-6 text-white" :fontControlled="false" />
                <!-- Title -->
                <div
                  class="flex-1 justify-start text-blue-200 text-base font-normal leading-snug"
                >
                  Operação/Ação policial
                </div>
                <!-- Toogle -->
                <UiToggle v-model="filtros.acaoPolicial" />
              </div>
              <div class="text-blue-300 text-sm font-light leading-tight">
                Apenas vítimas em ocorrências que houveram operações/ações
                policiais
              </div>
            </div>
            <!--   Bala perdida -->
            <div>
              <div class="self-stretch flex justify-between items-center gap-2">
                <!-- Icon -->
                <SvgoAmmo class="w-6 h-6 text-white" :fontControlled="false" />
                <!-- Title -->
                <div
                  class="flex-1 justify-start text-blue-200 text-base font-normal leading-snug"
                >
                  Bala perdida
                </div>
                <!-- Toogle -->
                <UiToggle v-model="filtros.balaPerdida" />
              </div>
              <div class="text-blue-300 text-sm font-light leading-tight">
                Apenas vítimas em circunstância de bala perdida
              </div>
            </div>
            <!--     Dentro de Casa -->
            <div>
              <div class="self-stretch flex justify-between items-center gap-2">
                <!-- Icon -->
                <SvgoHouse class="w-6 h-6 text-white" :fontControlled="false" />
                <!-- Title -->
                <div
                  class="flex-1 justify-start text-blue-200 text-base font-normal leading-snug"
                >
                  Dentro de Casa
                </div>
                <!-- Toogle -->
                <UiToggle v-model="filtros.dentroDeCasa" />
              </div>
              <div class="text-blue-300 text-sm font-light leading-tight">
                Apenas vítimas baleadas em uma residência
              </div>
            </div>
          </div>
        </div>
        <!-- Separadador -->
        <hr class="self-stretch text-blue-300 my-4" />

        <!--  Sobre as vítimas -->
        <div class="flex flex-col gap-4">
          <div
            class="self-stretch justify-start text-blue-300 text-sm font-light leading-none"
          >
            Sobre as vítimas
          </div>
          <!-- Situação -->
          <div class="flex flex-col gap-4">
            <div
              class="self-stretch justify-start text-white text-sm font-normal leading-none"
            >
              Situação
            </div>

            <div class="flex gap-3 flex-col">
              <UiCheckbox v-model="filtros.situacao" value="Dead"
                >Mortas</UiCheckbox
              >
              <UiCheckbox v-model="filtros.situacao" value="Wounded"
                >Feridas</UiCheckbox
              >
            </div>
          </div>
          <!-- Faixa etária -->
          <div class="flex flex-col gap-4">
            <div
              class="self-stretch justify-start text-white text-sm font-normal leading-none"
            >
              Faixa etária
            </div>

            <div class="flex gap-3 flex-col">
              <UiCheckbox v-model="filtros.faixaEtaria" value="Criança"
                >Crianças</UiCheckbox
              >
              <UiCheckbox v-model="filtros.faixaEtaria" value="Adolescente"
                >Adolescentes</UiCheckbox
              >
            </div>
          </div>
          <!-- Raça/Cor -->
          <div class="flex flex-col gap-4">
            <div
              class="self-stretch justify-start text-white text-sm font-normal leading-none"
            >
              Raça/Cor
            </div>

            <div class="flex gap-3 flex-col">
              <UiCheckbox v-model="filtros.raca" value="Branca"
                >Branca</UiCheckbox
              >
              <UiCheckbox v-model="filtros.raca" value="Negra"
                >Negra</UiCheckbox
              >
              <UiCheckbox v-model="filtros.raca" value="Não identificado"
                >Não identificado</UiCheckbox
              >
            </div>
          </div>
          <!-- Gênero-->
          <div class="flex flex-col gap-4">
            <div
              class="self-stretch justify-start text-white text-sm font-normal leading-none"
            >
              Gênero
            </div>

            <div class="flex gap-3 flex-col">
              <UiCheckbox v-model="filtros.genero" value="Meninos"
                >Meninos</UiCheckbox
              >
              <UiCheckbox v-model="filtros.genero" value="Meninas"
                >Meninas</UiCheckbox
              >
              <UiCheckbox v-model="filtros.genero" value="Não identificado"
                >Não Identificado</UiCheckbox
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
  </Transition>
</template>

<script setup>
import { inject, defineProps, defineEmits } from 'vue';
import UiIcon from '../../Ui/Button.vue';
import UiCheckbox from '../../Ui/CheckBox.vue';
import SvgoClose from '~/assets/icons/close.svg';

const props = defineProps({
  showAside: Boolean,
});

const emit = defineEmits(['close']);

const filtros = inject('filtros');

function limparFiltros() {
  filtros.acaoPolicial = false;
  filtros.balaPerdida = false;
  filtros.dentroDeCasa = false;
  filtros.ano = '';
  filtros.situacao = [];
  filtros.faixaEtaria = [];
  filtros.raca = [];
  filtros.genero = [];
}
</script>

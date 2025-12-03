<!-- pages/details.vue -->
<template>
  <LayoutHeader />
  <main>
    <DetailsHero
      name="RIO DE JANEIRO"
      subtitle="E REGIÃO METROPOLITANA"
      image="/images/cidades/riodejaneiro.png"
      :stats="{
        children: 687,
        childrenLabel: 'CRIANÇAS E ADOLESCENTES BALEADAS',
        police: 311,
        policeLabel: 'DURANTE OPERAÇÃO/AÇÃO POLICIAL',
      }"
      description="Parágrafo curto com alguma análise específica da região do Rio de Janeiro lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod illum dolore eu feugiat nulla facilisis at"
    />

    <!-- Paineis -->
    <section class="relative min-h-screen flex flex-col md:gap-12">
      <!-- Painel 1 -->
      <section>
        <div class="container flex flex-col mx-auto px-3 md:px-0 py-10">
          <FeaturePainel color="#F6F2F7">
            <UiTypography variant="h6" color="blue" uppercase class="mb-8">
              Perfil das vítimas
            </UiTypography>

            <FeatureTabs
              colors="default"
              :tab-labels="{
                modelo0: 'Modelo Grafico 0',
                modelo1: 'Modelo Grafico 1',
                modelo2: 'Modelo Grafico 2',
              }"
            >
              <!--0 Tab-->
              <template #tab-modelo0>
                <div class="flex flex-col gap-10 md:gap-12">
                  <!-- Header -->
                  <div
                    class="flex justify-between flex-col md:flex-row w-full gap-6"
                  >
                    <!-- Title -->
                    <div class="max-w-[560px] flex flex-col gap-4">
                      <div class="text-3xl text-blue-900">
                        Em &lt;<span class="text-blue-600 font-extrabold"
                          >2024</span
                        >&gt; das vítimas baleadas, &lt;<span
                          class="text-blue-600 font-extrabold"
                          >81,4%</span
                        >&gt; eram &lt;<span
                          class="text-blue-600 font-extrabold"
                          >adolescentes</span
                        >&gt;.
                      </div>
                      <!-- Legenda -->
                      <ChartLegenda
                        label="Situação das vítimas"
                        :items="[
                          {
                            key: 'feridas',
                            label: 'feridas',
                            color: 'bg-violet/85',
                          },
                          {
                            key: 'mortas',
                            label: 'mortas',
                            color: 'bg-coral/85',
                          },
                        ]"
                      />
                    </div>
                    <!-- Options -->
                    <div
                      class="flex w-full flex-1 md:w-fit gap-4 md:gap-2 flex-col md:flex-row md:items-center md:justify-end h-fit flex-wrap"
                    >
                      <!-- Toggle -->
                      <UiToggle v-model="menoresDe12">
                        <span>Apenas menores de 12 anos</span>
                      </UiToggle>
                      <!-- Select -->
                      <UiSelect
                        v-model="anoSelecionado"
                        :options="[2024, 2023, 2022, 2021, 2020, 2019]"
                        :defaultOptionLabel="'Todos os anos'"
                        label="Ano"
                        :placeholder="'2000 - 2024'"
                        type="yellow"
                        class="inline-block"
                      >
                        <template #label>
                          <div
                            class="flex items-center gap-2 text-blue-900 transition-all duration-300 ease-in-out"
                          >
                            {{
                              anoSelecionado === '' ||
                              anoSelecionado === undefined
                                ? 'Selecionar ano'
                                : anoSelecionado
                            }}
                            <span class="text-blue-900"><SvgoDropdown /></span>
                          </div>
                        </template>
                      </UiSelect>
                    </div>
                  </div>
                  <!-- Content -->
                  <figure class="flex flex-col gap-4">
                    <figcaption class="text-right text-xs text-base-600">
                      As ocorrências podem ter mais de uma causa
                    </figcaption>
                    <img
                      src="/assets/images/model/chart2.png"
                      alt="Faixa etária"
                    />
                  </figure>
                  <!-- Button -->
                  <div class="flex justify-center items-center">
                    <UiButton
                      >Ver detalhes
                      <SvgoPlus />
                    </UiButton>
                  </div>
                </div>
              </template>
              <!--1 Tab-->
              <template #tab-modelo1>
                <div class="flex flex-col gap-10 md:gap-12">
                  <!-- Header -->
                  <div
                    class="flex justify-between flex-col md:flex-row w-full gap-6"
                  >
                    <!-- Title -->
                    <div class="max-w-[560px] flex flex-col gap-4">
                      <div class="text-3xl text-blue-900">
                        Em &lt;<span class="text-blue-600 font-extrabold"
                          >2024</span
                        >&gt; das vítimas baleadas, &lt;<span
                          class="text-blue-600 font-extrabold"
                          >81,4%</span
                        >&gt; eram &lt;<span
                          class="text-blue-600 font-extrabold"
                          >adolescentes</span
                        >&gt;.
                      </div>
                      <!-- Legenda -->
                      <ChartLegenda
                        label="Situação das vítimas"
                        :items="[
                          {
                            key: 'feridas',
                            label: 'feridas',
                            color: 'bg-violet/85',
                          },
                          {
                            key: 'mortas',
                            label: 'mortas',
                            color: 'bg-coral/85',
                          },
                        ]"
                      />
                    </div>
                    <!-- Options -->
                    <div
                      class="flex w-full flex-1 md:w-fit gap-4 md:gap-2 flex-col md:flex-row md:items-center md:justify-end h-fit flex-wrap"
                    >
                      <!-- Toggle -->
                      <UiToggle v-model="menoresDe12">
                        <span>Apenas menores de 12 anos</span>
                      </UiToggle>
                      <!-- Select -->
                      <UiSelect
                        v-model="anoSelecionado"
                        :options="[2024, 2023, 2022, 2021, 2020, 2019]"
                        :defaultOptionLabel="'Todos os anos'"
                        label="Ano"
                        :placeholder="'2000 - 2024'"
                        type="yellow"
                        class="inline-block"
                      >
                        <template #label>
                          <div class="flex items-center gap-2 text-blue-900">
                            {{
                              anoSelecionado === '' ||
                              anoSelecionado === undefined
                                ? 'Selecionar ano'
                                : anoSelecionado
                            }}
                            <span class="text-blue-900"><SvgoDropdown /></span>
                          </div>
                        </template>
                      </UiSelect>
                    </div>
                  </div>
                  <!-- Content -->
                  <figure class="flex flex-col gap-4">
                    <figcaption class="text-right text-xs text-base-600">
                      As ocorrências podem ter mais de uma causa
                    </figcaption>
                    <img
                      src="/assets/images/model/chart1.png"
                      alt="Faixa etária"
                    />
                  </figure>
                  <!-- Button -->
                  <div class="flex justify-center items-center">
                    <UiButton
                      >Ver detalhes
                      <SvgoPlus />
                    </UiButton>
                  </div>
                </div>
              </template>
              <!--2 Tab-->
              <template #tab-modelo2>
                <div class="flex flex-col gap-10 md:gap-12">
                  <!-- Header -->
                  <div
                    class="flex justify-between flex-col md:flex-row w-full gap-6"
                  >
                    <!-- Title -->
                    <div class="max-w-[560px] flex flex-col gap-4">
                      <div class="text-3xl text-blue-900">
                        Em &lt;<span class="text-blue-600 font-extrabold"
                          >2024</span
                        >&gt; das vítimas baleadas, &lt;<span
                          class="text-blue-600 font-extrabold"
                          >81,4%</span
                        >&gt; eram &lt;<span
                          class="text-blue-600 font-extrabold"
                          >adolescentes</span
                        >&gt;.
                      </div>
                      <!-- Legenda -->
                      <ChartLegenda
                        label="Situação das vítimas"
                        :items="[
                          {
                            key: 'feridas',
                            label: 'feridas',
                            color: 'bg-violet/85',
                          },
                          {
                            key: 'mortas',
                            label: 'mortas',
                            color: 'bg-coral/85',
                          },
                        ]"
                      />
                    </div>
                    <!-- Options -->
                    <div
                      class="flex w-full flex-1 md:w-fit gap-4 md:gap-2 flex-col md:flex-row md:items-center md:justify-end h-fit flex-wrap"
                    >
                      <!-- Toggle -->
                      <UiToggle v-model="menoresDe12">
                        <span>Apenas menores de 12 anos</span>
                      </UiToggle>
                      <!-- Select -->
                      <UiSelect
                        v-model="anoSelecionado"
                        :options="[2024, 2023, 2022, 2021, 2020, 2019]"
                        :defaultOptionLabel="'Todos os anos'"
                        label="Ano"
                        :placeholder="'2000 - 2024'"
                        type="yellow"
                        class="inline-block"
                      >
                        <template #label>
                          <div class="flex items-center gap-2 text-blue-900">
                            {{
                              anoSelecionado === '' ||
                              anoSelecionado === undefined
                                ? 'Selecionar ano'
                                : anoSelecionado
                            }}
                            <span class="text-blue-900"><SvgoDropdown /></span>
                          </div>
                        </template>
                      </UiSelect>
                    </div>
                  </div>
                  <!-- Content -->
                  <ChartBar
                    :data="[
                      {
                        label: 'Adolescentes',
                        value: 22,
                        colorClass: 'bg-blue-600',
                      },
                      {
                        label: 'Lutas',
                        value: 10,
                        colorClass: 'bg-blue-300',
                      },
                      {
                        label: 'Crianças',
                        value: 6,
                        colorClass: 'bg-blue-400',
                      },
                    ]"
                  />
                  <div
                    class="flex flex-col md:flex-row gap-4 divide-x divide-base-300"
                  >
                    <div class="md:w-1/2">
                      <figure class="flex flex-col">
                        <ChartCircle
                          :situacaoFeridos="500"
                          :situacaoMortos="1000"
                        />
                        <figcaption class="text-blue-900 text-center font-bold">
                          Adolescentes
                        </figcaption>
                      </figure>
                    </div>
                    <div class="md:w-1/2">
                      <figure class="flex flex-col">
                        <ChartCircle
                          :situacaoFeridos="500"
                          :situacaoMortos="1000"
                        />
                        <figcaption class="text-blue-900 text-center font-bold">
                          Crianças
                        </figcaption>
                      </figure>
                    </div>
                  </div>

                  <!-- Button -->
                  <div class="flex justify-center items-center">
                    <UiButton
                      >Ver tabela de dados
                      <SvgoPlus />
                    </UiButton>
                  </div>
                </div>
              </template>
            </FeatureTabs>
          </FeaturePainel>
        </div>
      </section>
      <!-- Painel 2 -->
      <section>
        <div class="container flex flex-col mx-auto px-3 md:px-0 py-10">
          <FeaturePainel color="#F6F2F7">
            <UiTypography variant="h6" color="blue" uppercase class="mb-8">
              Perfil das vítimas
            </UiTypography>

            <FeatureTabs
              colors="default"
              :tab-labels="{
                modelo1: 'Modelo Grafico 1',
                modelo2: 'Modelo Grafico 2',
              }"
            >
              <!--1 Tab-->
              <template #tab-modelo1>
                <div class="flex flex-col gap-10 md:gap-12">
                  <!-- Header -->
                  <div
                    class="flex justify-between flex-col md:flex-row w-full gap-6"
                  >
                    <!-- Title -->
                    <div class="max-w-[560px] flex flex-col gap-4">
                      <div class="text-3xl text-blue-900">
                        Em &lt;<span class="text-blue-600 font-extrabold"
                          >2024</span
                        >&gt; das vítimas baleadas, &lt;<span
                          class="text-blue-600 font-extrabold"
                          >81,4%</span
                        >&gt; eram &lt;<span
                          class="text-blue-600 font-extrabold"
                          >adolescentes</span
                        >&gt;.
                      </div>
                      <!-- Legenda -->
                      <ChartLegenda
                        label="Situação das vítimas"
                        :items="[
                          {
                            key: 'feridas',
                            label: 'feridas',
                            color: 'bg-violet/85',
                          },
                          {
                            key: 'mortas',
                            label: 'mortas',
                            color: 'bg-coral/85',
                          },
                        ]"
                      />
                    </div>
                    <!-- Options -->
                    <div
                      class="flex w-full flex-1 md:w-fit gap-4 md:gap-2 flex-col md:flex-row md:items-center md:justify-end h-fit flex-wrap"
                    >
                      <!-- Toggle -->
                      <UiToggle v-model="menoresDe12">
                        <span>Apenas menores de 12 anos</span>
                      </UiToggle>
                      <!-- Select -->
                      <UiSelect
                        v-model="anoSelecionado"
                        :options="[2024, 2023, 2022, 2021, 2020, 2019]"
                        :defaultOptionLabel="'Todos os anos'"
                        label="Ano"
                        :placeholder="'2000 - 2024'"
                        type="yellow"
                        class="inline-block"
                      >
                        <template #label>
                          <div class="flex items-center gap-2 text-blue-900">
                            {{
                              anoSelecionado === '' ||
                              anoSelecionado === undefined
                                ? 'Selecionar ano'
                                : anoSelecionado
                            }}
                            <span class="text-blue-900"><SvgoDropdown /></span>
                          </div>
                        </template>
                      </UiSelect>
                    </div>
                  </div>
                  <!-- Content -->
                  <figure class="flex flex-col gap-4">
                    <figcaption class="text-right text-xs text-base-600">
                      As ocorrências podem ter mais de uma causa
                    </figcaption>
                    <img
                      src="/assets/images/model/chart1.png"
                      alt="Faixa etária"
                    />
                  </figure>
                  <!-- Button -->
                  <div class="flex justify-center items-center">
                    <UiButton
                      >Ver detalhes
                      <SvgoPlus />
                    </UiButton>
                  </div>
                </div>
              </template>
              <!--2 Tab-->
              <template #tab-modelo2>
                <div class="flex flex-col gap-10 md:gap-12">
                  <!-- Header -->
                  <div
                    class="flex justify-between flex-col md:flex-row w-full gap-6"
                  >
                    <!-- Title -->
                    <div class="max-w-[560px] flex flex-col gap-4">
                      <div class="text-3xl text-blue-900">
                        Em &lt;<span class="text-blue-600 font-extrabold"
                          >2024</span
                        >&gt; das vítimas baleadas, &lt;<span
                          class="text-blue-600 font-extrabold"
                          >81,4%</span
                        >&gt; eram &lt;<span
                          class="text-blue-600 font-extrabold"
                          >adolescentes</span
                        >&gt;.
                      </div>
                      <!-- Legenda -->
                      <ChartLegenda
                        label="Situação das vítimas"
                        :items="[
                          {
                            key: 'feridas',
                            label: 'feridas',
                            color: 'bg-violet/85',
                          },
                          {
                            key: 'mortas',
                            label: 'mortas',
                            color: 'bg-coral/85',
                          },
                        ]"
                      />
                    </div>
                    <!-- Options -->
                    <div
                      class="flex w-full flex-1 md:w-fit gap-4 md:gap-2 flex-col md:flex-row md:items-center md:justify-end h-fit flex-wrap"
                    >
                      <!-- Toggle -->
                      <UiToggle v-model="menoresDe12">
                        <span>Apenas menores de 12 anos</span>
                      </UiToggle>
                      <!-- Select -->
                      <UiSelect
                        v-model="anoSelecionado"
                        :options="[2024, 2023, 2022, 2021, 2020, 2019]"
                        :defaultOptionLabel="'Todos os anos'"
                        label="Ano"
                        :placeholder="'2000 - 2024'"
                        type="yellow"
                        class="inline-block"
                      >
                        <template #label>
                          <div class="flex items-center gap-2 text-blue-900">
                            {{
                              anoSelecionado === '' ||
                              anoSelecionado === undefined
                                ? 'Selecionar ano'
                                : anoSelecionado
                            }}
                            <span class="text-blue-900"><SvgoDropdown /></span>
                          </div>
                        </template>
                      </UiSelect>
                    </div>
                  </div>
                  <!-- Content -->
                  <ChartBar
                    :data="[
                      {
                        label: 'Adolescentes',
                        value: 22,
                        colorClass: 'bg-blue-600',
                      },
                      {
                        label: 'Lutas',
                        value: 10,
                        colorClass: 'bg-blue-300',
                      },
                      {
                        label: 'Crianças',
                        value: 6,
                        colorClass: 'bg-blue-400',
                      },
                    ]"
                  />
                  <div
                    class="flex flex-col md:flex-row gap-4 divide-x divide-base-300"
                  >
                    <div class="md:w-1/2">
                      <figure class="flex flex-col">
                        <ChartCircle
                          :situacaoFeridos="500"
                          :situacaoMortos="1000"
                        />
                        <figcaption class="text-blue-900 text-center font-bold">
                          Adolescentes
                        </figcaption>
                      </figure>
                    </div>
                    <div class="md:w-1/2">
                      <figure class="flex flex-col">
                        <ChartCircle
                          :situacaoFeridos="500"
                          :situacaoMortos="1000"
                        />
                        <figcaption class="text-blue-900 text-center font-bold">
                          Crianças
                        </figcaption>
                      </figure>
                    </div>
                  </div>

                  <!-- Button -->
                  <div class="flex justify-center items-center">
                    <UiButton
                      >Ver tabela de dados
                      <SvgoPlus />
                    </UiButton>
                  </div>
                </div>
              </template>
            </FeatureTabs>
          </FeaturePainel>
        </div>
      </section>
      <!-- Painel 3 -->
      <section>
        <div class="container flex flex-col mx-auto px-3 md:px-0 py-10">
          <FeaturePainel color="#F6F2F7">
            <UiTypography variant="h6" color="blue" uppercase class="mb-8">
              Perfil das vítimas
            </UiTypography>
            <div class="flex flex-col gap-10 md:gap-12">
              <!-- Header -->
              <div
                class="flex justify-between flex-col md:flex-row w-full gap-6"
              >
                <!-- Title -->
                <div class="max-w-[560px] flex flex-col gap-4">
                  <div class="text-3xl text-blue-900">
                    Em &lt;<span class="text-blue-600 font-extrabold">2024</span
                    >&gt; das vítimas baleadas, &lt;<span
                      class="text-blue-600 font-extrabold"
                      >81,4%</span
                    >&gt; eram &lt;<span class="text-blue-600 font-extrabold"
                      >adolescentes</span
                    >&gt;.
                  </div>
                </div>
                <!-- Options -->
                <div
                  class="flex w-full flex-1 md:w-fit gap-4 md:gap-2 flex-col md:flex-row md:items-center md:justify-end h-fit flex-wrap"
                >
                  <!-- Select -->
                  <UiSelect
                    v-model="anoSelecionado"
                    :options="[2024, 2023, 2022, 2021, 2020, 2019]"
                    :defaultOptionLabel="'Todos os anos'"
                    label="Ano"
                    :placeholder="'2000 - 2024'"
                    type="yellow"
                    class="inline-block"
                  >
                    <template #label>
                      <div class="flex items-center gap-2 text-blue-900">
                        {{
                          anoSelecionado === '' || anoSelecionado === undefined
                            ? 'Selecionar ano'
                            : anoSelecionado
                        }}
                        <span class="text-blue-900"><SvgoDropdown /></span>
                      </div>
                    </template>
                  </UiSelect>
                </div>
              </div>
              <!-- ChartBar -->
              <ChartBar
                :data="[
                  {
                    label: 'Adolescentes',
                    value: 22,
                    colorClass: 'bg-blue-600',
                  },
                  {
                    label: 'Lutas',
                    value: 10,
                    colorClass: 'bg-yellow-500',
                  },
                  {
                    label: 'Crianças',
                    value: 6,
                    colorClass: 'bg-blue-400',
                  },
                ]"
              />
              <!-- Legenda -->
              <ChartLegenda
                label="Situação das vítimas"
                :items="[
                  {
                    key: 'feridas',
                    label: 'feridas',
                    color: 'bg-violet/85',
                  },
                  {
                    key: 'mortas',
                    label: 'mortas',
                    color: 'bg-coral/85',
                  },
                ]"
              />
              <!-- Content -->
              <div
                class="flex flex-col md:flex-row gap-4 divide-x divide-base-300"
              >
                <div class="md:w-1/2">
                  <figure class="flex flex-col">
                    <ChartCircle
                      :situacaoFeridos="500"
                      :situacaoMortos="1000"
                    />
                    <figcaption class="text-blue-900 text-center font-bold">
                      Adolescentes
                    </figcaption>
                  </figure>
                </div>
                <div class="md:w-1/2">
                  <figure class="flex flex-col">
                    <ChartCircle
                      :situacaoFeridos="500"
                      :situacaoMortos="1000"
                    />
                    <figcaption class="text-blue-900 text-center font-bold">
                      Crianças
                    </figcaption>
                  </figure>
                </div>
              </div>

              <!-- Button -->
              <div class="flex justify-center items-center">
                <UiButton
                  >Ver tabela de dados
                  <SvgoPlus />
                </UiButton>
              </div>
            </div>
          </FeaturePainel>
        </div>
      </section>

      <!-- Barra inferior -->
      <LayoutBottomBar>
        <div class="flex flex-row gap-4 items-center justify-center">
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

          <UiButton size="small"> Ver Detalhes da Regiao </UiButton>
        </div>
      </LayoutBottomBar>
      <!--  Corte Svg-->
      <div
        class="absolute bottom-0 translate-y-[1px] -z-10 left-0 w-full h-fit"
      >
        <svg
          class="w-full h-auto"
          viewBox="0 0 1440 844"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M1440 -1.71739e-05L1.00646e-05 844L1440 844L1440 -1.71739e-05Z"
            fill="#E9E1EB"
          />
        </svg>
      </div>
    </section>

    <!-- Casos por tipo de ocorrência e perfil da vítima -->
    <section class="bg-base-200">
      <div class="container flex flex-col mx-auto px-3 md:px-0 py-10 md:py-20">
        <UiTypography variant="h2" uppercase>
          Casos por tipo de ocorrência e perfil da vítima
        </UiTypography>
        <ChartLegenda
          :items="[
            {
              key: 'feridas',
              label: 'feridas',
              color: 'bg-violet/85',
            },
            {
              key: 'mortas',
              label: 'mortas',
              color: 'bg-coral/85',
            },
          ]"
        />
        <!-- Filtro -->
        <FeatureFiltro />
        <!-- Content -->
        <figure class="flex flex-col gap-4 py-5">
          <img src="/assets/images/model/chart2.png" alt="Faixa etária" />
          <figcaption class="text-right text-xs text-base-600">
            Dados coletados de 21/07/2016 até o dia 01/08/2025
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- Explore o mapa para conhecer as vítimas -->
    <section
      style="
        background-image: url('/images/template/bg-map.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      "
    >
      <!-- Svg Top-->
      <div class="w-full -translate-y-[1px]">
        <svg
          class="w-full h-auto"
          viewBox="0 0 1440 224"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M455.79 113.523L381 70.2432V224.009L0 0.00878906H259.631L259.616 0H455.79V113.523ZM240 95L394 5H240V95Z"
            fill="#E9E1EB"
          />
          <path
            d="M984.211 210.526L646.315 12.3477V111.588L455.789 0.00878906H625.277L625.263 0H984.211V210.526Z"
            fill="#E9E1EB"
          />
          <path
            d="M1440 113.523L1316.75 42.1992V195.456L984.211 0.00878906H1243.84L1243.83 0H1440V113.523Z"
            fill="#E9E1EB"
          />
        </svg>
      </div>
      <!-- Content -->
      <div
        class="container flex flex-col mx-auto px-3 md:px-0 text-center justify-center items-center text-white md:gap-24 pb-24 pt-8"
      >
        <div class="w-full">
          <UiTypography variant="h2" uppercase>
            Explore o mapa para conhecer as vítimas
          </UiTypography>
          <div class="flex justify-center items-center">
            <UiButton>Ver mapa</UiButton>
          </div>
        </div>
        <div class="w-full flex flex-col gap-8">
          <UiTypography variant="h4" class="font-bigShouldersRegular" uppercase>
            ou acesse os detalhes de outras regiões
          </UiTypography>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <UiCard :variation="1">
              <div class="flex flex-col gap-6 items-center justify-center">
                <figure class="flex items-center justify-center">
                  <img src="/assets/images/cidades/icon-belem.png" alt="Icon" />
                </figure>
                <div class="flex flex-col">
                  <UiTypography variant="h2" class="mb-0" uppercase>
                    Belem
                  </UiTypography>
                  <div class="font-bigShouldersRegular text-3xl uppercase">
                    e Região metropolitana
                  </div>
                </div>
                <div class="w-fit">
                  <UiLink>Ver detalhes</UiLink>
                </div>
              </div>
            </UiCard>
            <UiCard :variation="2">
              <div class="flex flex-col gap-6 items-center justify-center">
                <figure class="flex items-center justify-center">
                  <img
                    src="/assets/images/cidades/icon-salvador.png"
                    alt="Icon"
                  />
                </figure>
                <div class="flex flex-col">
                  <UiTypography variant="h2" class="mb-0" uppercase>
                    Salvador
                  </UiTypography>
                  <div class="font-bigShouldersRegular text-3xl uppercase">
                    e Região metropolitana
                  </div>
                </div>
                <div class="w-fit">
                  <UiLink>Ver detalhes</UiLink>
                </div>
              </div></UiCard
            >
            <UiCard :variation="3" color="bg-yellow-500">
              <div class="flex flex-col gap-6 items-center justify-center">
                <figure class="flex items-center justify-center">
                  <img
                    src="/assets/images/cidades/icon-recife.png"
                    alt="Icon"
                  />
                </figure>
                <div class="flex flex-col">
                  <UiTypography variant="h2" class="mb-0" uppercase>
                    Recife
                  </UiTypography>
                  <div class="font-bigShouldersRegular text-3xl uppercase">
                    e Região metropolitana
                  </div>
                </div>
                <div class="w-fit">
                  <UiLink>Ver detalhes</UiLink>
                </div>
              </div></UiCard
            >
          </div>
        </div>
      </div>
    </section>

    <!--  Não encontrou o que procurava ou quer acessar mais dados? -->
    <section
      class="bg-base-100"
      style="
        background-image: url('/images/texture/model2.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      "
    >
      <div
        class="container flex flex-col md:flex-row mx-auto px-3 md:px-0 md:py-16 py-10 justify-center md:justify-between items-center md:items-start text-center md:text-left gap-6"
      >
        <UiTypography variant="h4" class="text-blue-1000" uppercase>
          Não encontrou o que procurava ou quer acessar mais dados?
        </UiTypography>
        <div>
          <UiButton @click="openReportModal"
            >Entre em contato <SvgoArrow
          /></UiButton>
        </div>
      </div>
    </section>
  </main>
  <LayoutFooter />

  <!-- Modal de Reportar Inconsistência -->
  <FeatureModalReport
    :is-open="isReportModalOpen"
    @close="closeReportModal"
    @submit="handleReportSubmit"
  />
</template>

<script setup>
import { ref, watch } from 'vue';

// Variável reativa para o ano selecionado
const anoSelecionado = ref('');

// Variável reativa para o toggle de menores de 12 anos
const menoresDe12 = ref(false);

// Estado do modal de reportar inconsistência
const isReportModalOpen = ref(false);

// Função para abrir o modal
const openReportModal = () => {
  isReportModalOpen.value = true;
};

// Função para fechar o modal
const closeReportModal = () => {
  isReportModalOpen.value = false;
};

// Função para lidar com o envio do formulário
const handleReportSubmit = (formData) => {
  /*   console.log('Dados do formulário:', formData); */
  // Aqui você pode adicionar a lógica para enviar os dados
  // Por exemplo, fazer uma requisição para uma API

  // Por enquanto, apenas mostra um alerta
  alert('Obrigado pelo seu feedback! Entraremos em contato em breve.');
};

// Debug: observar mudanças na variável
watch(menoresDe12, (newValue) => {
  /* console.log('menoresDe12 changed:', newValue); */
});
</script>

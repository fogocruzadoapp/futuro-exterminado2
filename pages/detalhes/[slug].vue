<!-- pages/detalhes/[slug].vue -->
<template>
<LayoutHeader />
  <main>
    <DetailsHero
    v-if="minDate"
      :name="mapaCapitais[slug]"
      subtitle="E REGIÃO METROPOLITANA"
      :image="`/images/cidades/${slug}.png`"
      :data="vitimas"
      :minDate="minDate"
      :stats="{
        children: vitimasTotais,
        childrenLabel: 'CRIANÇAS E ADOLESCENTES BALEADAS',
        police: vitimasPorPolicia,
        policeLabel: 'DURANTE OPERAÇÃO/AÇÃO POLICIAL',
      }"
      :description="textoAbertura"
    />
  </main>
  <section class="relative min-h-screen flex flex-col md:gap-12">
    <!-- Evolução -->
    <section class="container flex flex-col mx-auto px-3 md:px-0">
      <FeaturePainel>
        <UiTypography variant="h6" color="blue" uppercase class="mb-8">
          Série Histórica
        </UiTypography>

        <div class="flex flex-col gap-10 md:gap-12">
          <!-- Header -->
          <div class="flex justify-between flex-col md:flex-row w-full gap-6">
            <!-- Title -->
            <div class="max-w-[560px] flex flex-col gap-4">
              <div class="text-3xl text-blue-900">
                Evolução do número de
                <span class="text-blue-600 font-extrabold">{{
                  isCriancaEvolucao ? 'crianças' : 'crianças e adolescentes'
                }}</span>
                baleadas.
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
              <UiToggle
                v-model="isCriancaEvolucao"
              >
                <span>Apenas menores de 12 anos</span>
              </UiToggle>
            </div>
          </div>
          <!-- Content -->
          <figure class="flex flex-col gap-4">
            <ChartEvolucao
              v-if="vitimasEvolucaoSimplificada.grafico"
              :data="vitimasEvolucaoSimplificada.grafico"
              :palette="['bg-violet/85', 'bg-coral/85']"
            />
          <figcaption class="text-right text-xs text-base-600 mt-4">
            Dados coletados de {{ minDate }} à {{ maxDate }}
          </figcaption>
          </figure>
          <UiExpandTable
            v-if="vitimasEvolucaoSimplificada.grafico.length > 0"
            :table="vitimasEvolucaoSimplificada.tabela"
            :showExtraBtn="true"
          />
        </div>
      </FeaturePainel>
    </section>

    <!-- Perfil -->
    <section>
      <div class="container flex flex-col mx-auto px-3 md:px-0 py-10">
        <FeaturePainel color="#F6F2F7">
          <UiTypography variant="h6" color="blue" uppercase class="mb-8">
            Perfil das vítimas
          </UiTypography>

          <FeatureTabs
            colors="default"
            :tab-labels="{
              modelo0: 'Faixa Etária',
              modelo1: 'Raça/Cor',
              modelo2: 'Gênero',
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
                    <div
                      class="text-3xl text-blue-900"
                      v-if="
                        vitimasPerfilFaixaEtaria.grafico.length > 0 &&
                        vitimasPerfilFaixaEtaria.grafico[0].label !=
                          'Não identificado'
                      "
                    >
                      {{ anoFaixaEtaria ? 'Em ' : 'De '
                      }}<span class="text-blue-600 font-extrabold">{{
                        anoFaixaEtaria
                          ? anoFaixaEtaria
                          : anosDisponiveis[anosDisponiveis.length - 1] +
                            ' a ' +
                            anosDisponiveis[0]
                      }}</span>,
                      <span class="text-blue-600 font-extrabold"
                        >{{
                          vitimasPerfilFaixaEtaria.grafico[0]?.percent.toLocaleString('pt-BR', { style: 'decimal', maximumFractionDigits: 1 })
                        }}%</span>
                      das vítimas baleadas eram
                      <span class="text-blue-600 font-extrabold lowercase"
                        >{{ vitimasPerfilFaixaEtaria.grafico[0].label }}s</span
                      >.
                    </div>
                    <div class="text-3xl text-blue-900" v-else>
                      {{ anoFaixaEtaria ? 'Em ' : 'De '
                      }}<span class="text-blue-600 font-extrabold">{{
                        anoFaixaEtaria
                          ? anoFaixaEtaria
                          : anosDisponiveis[anosDisponiveis.length - 1] +
                            ' a ' +
                            anosDisponiveis[0]
                      }}</span>
                      baleadas, não houveram vitimas com informação de faixa
                      etária.
                    </div>
                  </div>
                  <!-- Options -->
                  <div
                    class="flex w-full flex-1 md:w-fit gap-4 md:gap-2 flex-col md:flex-row md:items-center md:justify-end h-fit flex-wrap"
                  >
                    <!-- Select -->
                    <UiSelect
                      v-model="anoFaixaEtaria"
                      :options="anosDisponiveis"
                      :defaultOptionLabel="'Todos os anos'"
                      label="Ano"
                      :placeholder="'2000 - 2024'"
                      type="yellow"
                      class="inline-block"
                    >
                      <template #label>
                        <div class="flex items-center gap-2 text-blue-900">
                          {{
                            anoFaixaEtaria === '' ||
                            anoFaixaEtaria === undefined
                              ? 'Selecionar ano'
                              : anoFaixaEtaria
                          }}
                          <span class="text-blue-900"><SvgoDropdown /></span>
                        </div>
                      </template>
                    </UiSelect>
                  </div>
                </div>
                <!-- Content -->
                <ChartBar
                  :title="'Faixa Etária'"
                  v-if="vitimasPerfilFaixaEtaria.grafico.length > 0"
                  :data="vitimasPerfilFaixaEtaria.grafico"
                />
                <p v-else class="text-blue-900 text-center font-bold">
                  Não existem dados para estas combinações de filtros
                </p>
                <!-- Legenda -->
                <ChartLegenda
                  v-if="vitimasPerfilFaixaEtaria.grafico.length > 0"
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
                <div
                  class="flex flex-col md:flex-row gap-4 divide-y md:divide-y-0 md:divide-x divide-base-300"
                >
                  <div
                    v-for="item in vitimasPerfilFaixaEtaria.grafico"
                    class="md:w-full justify-center flex"
                    v-if="vitimasPerfilFaixaEtaria.grafico.length > 0"
                  >
                    <figure class="flex flex-col w-2/3">
                      <MapChartCircle
                        :anoMortos="item.totalMortas"
                        :anoFeridos="item.totalFeridas"
                        :situacaoMortos="item.mortas"
                        :situacaoFeridos="item.feridas"
                        :detalhes="true"
                        :title="item.label"
                        :big="true"
                      />
                      <figcaption class="text-blue-900 text-center font-bold">
                        {{ item.label }}
                      </figcaption>
                    </figure>
                  </div>
                </div>
                <UiExpandTable
                  v-if="vitimasPerfilFaixaEtaria.grafico.length > 0"
                  :table="vitimasPerfilFaixaEtaria.tabela"
                />
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
                    <div
                      class="text-3xl text-blue-900"
                      v-if="
                        vitimasPerfilRaca.grafico.length > 0 &&
                        vitimasPerfilRaca.grafico[0].label != 'Não identificado'
                      "
                    >
                      {{ anoRaca ? 'Em ' : 'De '
                      }}<span class="text-blue-600 font-extrabold">{{
                        anoRaca
                          ? anoRaca
                          : anosDisponiveis[anosDisponiveis.length - 1] +
                            ' a ' +
                            anosDisponiveis[0]
                      }}</span
                      >, das
                      <span class="text-blue-600 font-extrabold">{{
                        isCriancaRaca ? 'crianças' : 'crianças e adolescentes'
                      }}</span>
                      baleadas com informação de raça/cor,
                      <span class="text-blue-600 font-extrabold"
                        >{{
                          vitimasPerfilRaca.grafico[0]?.percent.toLocaleString('pt-BR', { style: 'decimal', maximumFractionDigits: 1 })
                        }}%</span
                      >
                      eram
                      <span class="text-blue-600 font-extrabold lowercase"
                        >{{ vitimasPerfilRaca.grafico[0].label }}s</span
                      >.
                    </div>
                    <div class="text-3xl text-blue-900" v-else>
                      {{ anoRaca ? 'Em ' : 'De ' }}
                      <span class="text-blue-600 font-extrabold">{{
                        anoRaca
                          ? anoRaca
                          : anosDisponiveis[anosDisponiveis.length - 1] +
                            ' a ' +
                            anosDisponiveis[0]
                      }}</span
                      >, das
                      <span class="text-blue-600 font-extrabold">{{
                        isCriancaRaca ? 'crianças' : 'crianças e adolescentes'
                      }}</span>
                      baleadas, não houveram vitimas com informação de raça/cor.
                    </div>
                  </div>
                  <!-- Options -->
                  <div
                    class="flex w-full flex-1 md:w-fit gap-4 md:gap-2 flex-col md:flex-row md:items-center md:justify-end h-fit flex-wrap"
                  >
                    <!-- Toggle -->
                    <UiToggle v-model="isCriancaRaca">
                      <span>Apenas menores de 12 anos</span>
                    </UiToggle>
                    <!-- Select -->
                    <UiSelect
                      v-model="anoRaca"
                      :options="anosDisponiveis"
                      :defaultOptionLabel="'Todos os anos'"
                      label="Ano"
                      :placeholder="'2000 - 2024'"
                      type="yellow"
                      class="inline-block"
                    >
                      <template #label>
                        <div class="flex items-center gap-2 text-blue-900">
                          {{
                            anoRaca === '' || anoRaca === undefined
                              ? 'Selecionar ano'
                              : anoRaca
                          }}
                          <span class="text-blue-900"><SvgoDropdown /></span>
                        </div>
                      </template>
                    </UiSelect>
                  </div>
                </div>
                <div>
                  <!-- Toggle -->
                  <UiToggle v-model="racaNI" class="mb-2">
                    <span>não identificados</span>
                  </UiToggle>
                  <!-- Content -->
                  <ChartBar
                    :title="'Raça/Cor'"
                    v-if="vitimasPerfilRaca.grafico.length > 0"
                    :data="vitimasPerfilRaca.grafico"
                  />
                  <p v-else class="text-blue-900 text-center font-bold">
                    Não existem dados para estas combinações de filtros
                  </p>
                </div>
                <!-- Legenda -->
                <ChartLegenda
                  v-if="vitimasPerfilRaca.grafico.length > 0"
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
                <div
                  class="flex flex-col md:flex-row gap-4 divide-y md:divide-y-0 md:divide-x divide-base-300 justify-center"
                >
                  <div
                    v-for="item in vitimasPerfilRaca.grafico"
                    class="md:w-full justify-center flex"
                    v-if="vitimasPerfilRaca.grafico.length > 0"
                  >
                    <figure class="flex flex-col w-2/3">
                      <MapChartCircle
                        :anoMortos="item.totalMortas"
                        :anoFeridos="item.totalFeridas"
                        :situacaoMortos="item.mortas"
                        :situacaoFeridos="item.feridas"
                        :detalhes="true"
                        :title="item.label"
                        :big="true"
                      />
                      <figcaption class="text-blue-900 text-center font-bold">
                        {{ item.label }}
                      </figcaption>
                    </figure>
                  </div>
                </div>
                <UiExpandTable
                  v-if="vitimasPerfilRaca.grafico.length > 0"
                  :table="vitimasPerfilRaca.tabela"
                />
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
                    <div
                      class="text-3xl text-blue-900"
                      v-if="
                        vitimasPerfilGenero.grafico.length > 0 &&
                        vitimasPerfilGenero.grafico[0].label !=
                          'Não identificado'
                      "
                    >
                      {{ anoGenero ? 'Em ' : 'De '
                      }}<span class="text-blue-600 font-extrabold">{{
                        anoGenero
                          ? anoGenero
                          : anosDisponiveis[anosDisponiveis.length - 1] +
                            ' a ' +
                            anosDisponiveis[0]
                      }}</span
                      >, das
                      <span class="text-blue-600 font-extrabold">{{
                        isCriancaGenero ? 'crianças' : 'crianças e adolescentes'
                      }}</span>
                      baleadas com gênero identificado,
                      <span class="text-blue-600 font-extrabold"
                        >{{
                          vitimasPerfilGenero.grafico[0]?.percent.toLocaleString('pt-BR', { style: 'decimal', maximumFractionDigits: 1 })
                        }}%</span
                      >
                      eram
                      <span class="text-blue-600 font-extrabold lowercase"
                        >{{ vitimasPerfilGenero.grafico[0].label }}s</span
                      >.
                    </div>
                    <div class="text-3xl text-blue-900" v-else>
                      {{ anoGenero ? 'Em ' : 'De '
                      }}<span class="text-blue-600 font-extrabold">{{
                        anoGenero
                          ? anoGenero
                          : anosDisponiveis[anosDisponiveis.length - 1] +
                            ' a ' +
                            anosDisponiveis[0]
                      }}</span
                      >, das
                      <span class="text-blue-600 font-extrabold">{{
                        isCriancaGenero ? 'crianças' : 'crianças e adolescentes'
                      }}</span>
                      baleadas, não houveram vitimas com informação de gênero.
                    </div>
                  </div>
                  <!-- Options -->
                  <div
                    class="flex w-full flex-1 md:w-fit gap-4 md:gap-2 flex-col md:flex-row md:items-center md:justify-end h-fit flex-wrap"
                  >
                    <!-- Toggle -->
                    <UiToggle v-model="isCriancaGenero">
                      <span>Apenas menores de 12 anos</span>
                    </UiToggle>
                    <!-- Select -->
                    <UiSelect
                      v-model="anoGenero"
                      :options="anosDisponiveis"
                      :defaultOptionLabel="'Todos os anos'"
                      label="Ano"
                      :placeholder="'2000 - 2024'"
                      type="yellow"
                      class="inline-block"
                    >
                      <template #label>
                        <div class="flex items-center gap-2 text-blue-900">
                          {{
                            anoGenero === '' || anoGenero === undefined
                              ? 'Selecionar ano'
                              : anoGenero
                          }}
                          <span class="text-blue-900"><SvgoDropdown /></span>
                        </div>
                      </template>
                    </UiSelect>
                  </div>
                </div>
                <div>
                  <!-- Toggle -->
                  <UiToggle v-model="generoNI" class="mb-2">
                    <span>não identificados</span>
                  </UiToggle>
                  <!-- Content -->
                  <ChartBar
                    :title="'Gênero'"
                    v-if="vitimasPerfilGenero.grafico.length > 0"
                    :data="vitimasPerfilGenero.grafico"
                  />
                  <p v-else class="text-blue-900 text-center font-bold">
                    Não existem dados para estas combinações de filtros
                  </p>
                </div>
                <!-- Legenda -->
                <ChartLegenda
                  v-if="vitimasPerfilGenero.grafico.length > 0"
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
                <div
                  class="flex flex-col md:flex-row gap-4 divide-y md:divide-y-0 md:divide-x divide-base-300 justify-center"
                >
                  <div
                    v-for="item in vitimasPerfilGenero.grafico"
                    class="md:w-full justify-center flex"
                    v-if="vitimasPerfilGenero.grafico.length > 0"
                  >
                    <figure class="flex flex-col w-2/3">
                      <MapChartCircle
                        :anoMortos="item.totalMortas"
                        :anoFeridos="item.totalFeridas"
                        :situacaoMortos="item.mortas"
                        :situacaoFeridos="item.feridas"
                        :detalhes="true"
                        :title="item.label"
                        :big="true"
                      />
                      <figcaption class="text-blue-900 text-center font-bold">
                        {{ item.label }}
                      </figcaption>
                    </figure>
                  </div>
                </div>
                <UiExpandTable
                  v-if="vitimasPerfilGenero.grafico.length > 0"
                  :table="vitimasPerfilGenero.tabela"
                />
              </div>
            </template>
          </FeatureTabs>
        </FeaturePainel>
      </div>
    </section>

    <!-- Ocorrências -->
    <section>
      <div class="container flex flex-col mx-auto px-3 md:px-0 py-10">
        <FeaturePainel color="#F6F2F7">
          <UiTypography variant="h6" color="blue" uppercase class="mb-8">
            Ocorrências
          </UiTypography>

          <FeatureTabs
            colors="default"
            :tab-labels="{
              modelo1: 'Causas',
              modelo2: 'Circunstâncias Especiais',
              modelo3: 'Local',
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
                    <div
                      class="text-3xl text-blue-900"
                      v-if="
                        vitimasOcorrenciasCausas.grafico.length > 0 &&
                        vitimasOcorrenciasCausas.grafico[0].label !=
                          'Não identificado'
                      "
                    >
                      {{ anoCausas ? 'Em ' : 'De '
                      }}<span class="text-blue-600 font-extrabold">{{
                        anoCausas
                          ? anoCausas
                          : anosDisponiveis[anosDisponiveis.length - 1] +
                            ' a ' +
                            anosDisponiveis[0]
                      }}</span
                      >, dos casos registrados,
                      <span class="text-blue-600 font-extrabold"
                        >{{
                          vitimasOcorrenciasCausas.grafico[0]?.percent.toLocaleString('pt-BR', { style: 'decimal', maximumFractionDigits: 1 })
                        }}%</span
                      >
                      das
                      <span class="text-blue-600 font-extrabold">{{
                        isCriancaCausas ? 'crianças' : 'crianças e adolescentes'
                      }}</span>
                      foram baleadas durante
                      <span class="text-blue-600 font-extrabold lowercase">{{
                        vitimasOcorrenciasCausas.grafico[0].label
                      }}</span
                      >.
                    </div>
                    <div class="text-3xl text-blue-900" v-else>
                      {{ anoCausas ? 'Em ' : 'De '
                      }}<span class="text-blue-600 font-extrabold">{{
                        anoCausas
                          ? anoCausas
                          : anosDisponiveis[anosDisponiveis.length - 1] +
                            ' a ' +
                            anosDisponiveis[0]
                      }}</span
                      >, dos casos registrados, das
                      <span class="text-blue-600 font-extrabold">{{
                        isCriancaCausas ? 'crianças' : 'crianças e adolescentes'
                      }}</span>
                      baleadas, não houveram vitimas com informação da causa.
                    </div>
                    <!-- Legenda -->
                    <ChartLegenda
                      v-if="vitimasOcorrenciasCausas.grafico.length > 0"
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
                    <UiToggle v-model="isCriancaCausas">
                      <span>Apenas menores de 12 anos</span>
                    </UiToggle>
                    <!-- Select -->
                    <UiSelect
                      v-model="anoCausas"
                      :options="anosDisponiveis"
                      :defaultOptionLabel="'Todos os anos'"
                      label="Ano"
                      :placeholder="'2000 - 2024'"
                      type="yellow"
                      class="inline-block"
                    >
                      <template #label>
                        <div class="flex items-center gap-2 text-blue-900">
                          {{
                            anoCausas === '' || anoCausas === undefined
                              ? 'Selecionar ano'
                              : anoCausas
                          }}
                          <span class="text-blue-900"><SvgoDropdown /></span>
                        </div>
                      </template>
                    </UiSelect>
                  </div>
                </div>
                <!-- Content -->
                <figure
                  class="flex flex-col gap-4"
                  v-if="vitimasOcorrenciasCausas.grafico.length > 0"
                >
                  <figcaption class="text-right text-xs text-base-600">
                    As ocorrências podem ter mais de uma causa
                  </figcaption>
                  <ChartStacked
                    v-if="vitimasOcorrenciasCausas.grafico"
                    :data="vitimasOcorrenciasCausas.grafico"
                  />
                </figure>
                <p v-else class="text-blue-900 text-center font-bold">
                  Não existem dados para estas combinações de filtros
                </p>
                <UiExpandTable
                  v-if="vitimasOcorrenciasCausas.grafico.length > 0"
                  :table="vitimasOcorrenciasCausas.tabela"
                />
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
                    <div
                      class="text-3xl text-blue-900"
                      v-if="
                        vitimasOcorrenciasCirc.grafico.length > 0 &&
                        vitimasOcorrenciasCirc.grafico[0].label !=
                          'Sem identificação'
                      "
                    >
                      {{ anoCirc ? 'Em ' : 'De '
                      }}<span class="text-blue-600 font-extrabold">{{
                        anoCirc
                          ? anoCirc
                          : anosDisponiveis[anosDisponiveis.length - 1] +
                            ' a ' +
                            anosDisponiveis[0]
                      }}</span
                      >, dos casos registrados,
                      <span class="text-blue-600 font-extrabold"
                        >{{
                          vitimasOcorrenciasCirc.grafico[0]?.percent.toLocaleString('pt-BR', { style: 'decimal', maximumFractionDigits: 1 })
                        }}%</span
                      >
                      das
                      <span class="text-blue-600 font-extrabold">{{
                        isCriancaCirc ? 'crianças' : 'crianças e adolescentes'
                      }}</span>
                      foram vítimas de
                      <span class="text-blue-600 font-extrabold lowercase">{{
                        vitimasOcorrenciasCirc.grafico[0].label
                      }}</span
                      >.
                    </div>
                    <div class="text-3xl text-blue-900" v-else>
                      {{ anoCirc ? 'Em ' : 'De '
                      }}<span class="text-blue-600 font-extrabold">{{
                        anoCirc
                          ? anoCirc
                          : anosDisponiveis[anosDisponiveis.length - 1] +
                            ' a ' +
                            anosDisponiveis[0]
                      }}</span
                      >, dos casos registrados, das
                      <span class="text-blue-600 font-extrabold">{{
                        isCriancaCirc ? 'crianças' : 'crianças e adolescentes'
                      }}</span>
                      baleadas, não houveram vitimas com informação das
                      circunstâncias.
                    </div>
                    <!-- Legenda -->
                    <ChartLegenda
                      v-if="vitimasOcorrenciasCirc.grafico.length > 0"
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
                    <UiToggle v-model="isCriancaCirc">
                      <span>Apenas menores de 12 anos</span>
                    </UiToggle>
                    <!-- Select -->
                    <UiSelect
                      v-model="anoCirc"
                      :options="anosDisponiveis"
                      :defaultOptionLabel="'Todos os anos'"
                      label="Ano"
                      :placeholder="'2000 - 2024'"
                      type="yellow"
                      class="inline-block"
                    >
                      <template #label>
                        <div class="flex items-center gap-2 text-blue-900">
                          {{
                            anoCausas === '' || anoCausas === undefined
                              ? 'Selecionar ano'
                              : anoCausas
                          }}
                          <span class="text-blue-900"><SvgoDropdown /></span>
                        </div>
                      </template>
                    </UiSelect>
                  </div>
                </div>
                <!-- Content -->
                <figure
                  class="flex flex-col gap-4"
                  v-if="vitimasOcorrenciasCirc.grafico.length > 0"
                >
                  <figcaption class="text-right text-xs text-base-600">
                    As ocorrências podem ter mais de uma circunstância
                  </figcaption>
                  <ChartStacked :data="vitimasOcorrenciasCirc.grafico" />
                </figure>
                <p v-else class="text-blue-900 text-center font-bold">
                  Não existem dados para estas combinações de filtros
                </p>
                <UiExpandTable
                  v-if="vitimasOcorrenciasCirc.grafico.length > 0"
                  :table="vitimasOcorrenciasCirc.tabela"
                />
              </div>
            </template>
            <!--3 Tab-->
            <template #tab-modelo3>
              <div class="flex flex-col gap-10 md:gap-12">
                <!-- Header -->
                <div
                  class="flex justify-between flex-col md:flex-row w-full gap-6"
                >
                  <!-- Title -->
                  <div class="max-w-[560px] flex flex-col gap-4">
                    <div
                      class="text-3xl text-blue-900"
                      v-if="
                        vitimasOcorrenciasLocal.grafico.length > 0 &&
                        vitimasOcorrenciasLocal.grafico[0].label !=
                          'Não identificado'
                      "
                    >
                      {{ anoLocal ? 'Em ' : 'De '
                      }}<span class="text-blue-600 font-extrabold">{{
                        anoLocal
                          ? anoLocal
                          : anosDisponiveis[anosDisponiveis.length - 1] +
                            ' a ' +
                            anosDisponiveis[0]
                      }}</span
                      >, dos casos registrados,
                      <span class="text-blue-600 font-extrabold"
                        >{{
                          vitimasOcorrenciasLocal.grafico[0]?.percent.toLocaleString('pt-BR', { style: 'decimal', maximumFractionDigits: 1 })
                        }}%</span
                      >
                      das
                      <span class="text-blue-600 font-extrabold">{{
                        isCriancaLocal ? 'crianças' : 'crianças e adolescentes'
                      }}</span>
                      foram baleadas dentro de
                      <span class="text-blue-600 font-extrabold lowercase">{{
                        vitimasOcorrenciasLocal.grafico[0].label
                      }}</span
                      >.
                    </div>
                    <div class="text-3xl text-blue-900" v-else>
                      {{ anoLocal ? 'Em ' : 'De '
                      }}<span class="text-blue-600 font-extrabold">{{
                        anoLocal
                          ? anoLocal
                          : anosDisponiveis[anosDisponiveis.length - 1] +
                            ' a ' +
                            anosDisponiveis[0]
                      }}</span
                      >, dos casos registrados, das
                      <span class="text-blue-600 font-extrabold">{{
                        isCriancaLocal ? 'crianças' : 'crianças e adolescentes'
                      }}</span>
                      baleadas, não houveram vitimas com informação do local.
                    </div>
                    <!-- Legenda -->
                    <ChartLegenda
                      v-if="vitimasOcorrenciasLocal.grafico.length > 0"
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
                    <UiToggle v-model="isCriancaLocal">
                      <span>Apenas menores de 12 anos</span>
                    </UiToggle>
                    <!-- Select -->
                    <UiSelect
                      v-model="anoLocal"
                      :options="anosDisponiveis"
                      :defaultOptionLabel="'Todos os anos'"
                      label="Ano"
                      :placeholder="'2000 - 2024'"
                      type="yellow"
                      class="inline-block"
                    >
                      <template #label>
                        <div class="flex items-center gap-2 text-blue-900">
                          {{
                            anoLocal === '' || anoLocal === undefined
                              ? 'Selecionar ano'
                              : anoLocal
                          }}
                          <span class="text-blue-900"><SvgoDropdown /></span>
                        </div>
                      </template>
                    </UiSelect>
                  </div>
                </div>
                <!-- Content -->
                <figure
                  class="flex flex-col gap-4"
                  v-if="vitimasOcorrenciasLocal.grafico.length > 0"
                >
                  <ChartStacked :data="vitimasOcorrenciasLocal.grafico" />
                </figure>
                <p v-else class="text-blue-900 text-center font-bold">
                  Não existem dados para estas combinações de filtros
                </p>
                <UiExpandTable
                  v-if="vitimasOcorrenciasLocal.grafico.length > 0"
                  :table="vitimasOcorrenciasLocal.tabela"
                />
              </div>
            </template>
          </FeatureTabs>
        </FeaturePainel>
      </div>
    </section>

    <!--  Corte Svg-->
    <aside
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
    </aside>
  </section>

  <!-- Casos por tipo de ocorrência e perfil da vítima -->
  <section class="bg-base-200" id="serie-historica">
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
      <FeatureFiltro v-model="filtrosEvolucao" />
      <!-- Content -->
      <figure class="flex flex-col gap-4 py-5">
        <ChartEvolucao
          v-if="vitimasEvolucao.grafico"
          :data="vitimasEvolucao.grafico"
          :palette="['bg-violet/85', 'bg-coral/85']"
        />
        <figcaption class="text-right text-xs text-base-600 mt-4">
          Dados coletados de {{ minDate }} à {{ maxDate }}
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
          <NuxtLink :to="{ path: '/mapa', query: { estado: slugify(slug) } }">
            <UiButton>Ver mapa</UiButton>
          </NuxtLink>
        </div>
      </div>
      <div class="w-full flex flex-col gap-8">
        <UiTypography variant="h4" class="font-bigShouldersRegular" uppercase>
          ou acesse os detalhes de outras regiões
        </UiTypography>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <template v-for="(estado, index) in estados">
            <UiCard :variation="index + 1" v-if="slugify(estado) !== slug">
              <div class="flex flex-col gap-6 items-center justify-center">
                <figure class="flex items-center justify-center">
                  <img
                    :src="`/images/cidades/icon-${slugify(
                      mapaCapitais[slugify(estado)],
                    )}.png`"
                    alt="Icon"
                  />
                </figure>
                <div class="flex flex-col">
                  <UiTypography variant="h2" class="mb-0" uppercase>
                    {{ mapaCapitais[slugify(estado)] }}
                  </UiTypography>
                  <div class="font-bigShouldersRegular text-3xl uppercase">
                    e Região metropolitana
                  </div>
                </div>
                <div class="w-fit">
                  <NuxtLink :to="{ path: '/detalhes/' + slugify(estado) }">
                    <UiLink>Ver detalhes</UiLink>
                  </NuxtLink>
                </div>
              </div>
            </UiCard>
          </template>
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

  <!-- Barra inferior -->
  <LayoutBottomBar>
    <div class="flex flex-row gap-4 items-center justify-center">
      <UiSelect
        :modelValue="estadoSelecionado"
        :options="estados"
        placeholder="Selecione o estado"
        dropdownDirection="up"
        @update:modelValue="
          (val) => {
            const slug = slugify(val);
            if (route.params.slug !== slug) {
              router.replace({ name: 'detalhes-slug', params: { slug } });
            }
          }
        "
      >
        <template #label>
          <UiLink> Alterar região </UiLink>
        </template>
      </UiSelect>

      <NuxtLink :to="{ path: '/mapa', query: { estado: slugify(slug) } }">
        <UiButton size="small"> Ver Mapa da Regiao </UiButton>
      </NuxtLink>
    </div>
  </LayoutBottomBar>

  <LayoutFooter />

  <!-- Modal de Reportar Inconsistência -->
  <FeatureModalReport
    :is-open="isReportModalOpen"
    @close="closeReportModal"
    @submit="handleReportSubmit"
  />
</template>

<script setup>
// Importações e configurações
const route = useRoute();
const router = useRouter();
const slugify = useSlugify();

// Data e Refs
const vitimasRaw = inject('vitimas');
const estadoSelecionado = inject('estadoSelecionado');
const estados = inject('estados');
const complementar = inject('complementar');
const slug = computed(() => String(route.params.slug || ''));
const isCriancaEvolucao = ref(false);
const isCriancaRaca = ref(false);
const isCriancaGenero = ref(false);
const isCriancaCausas = ref(false);
const isCriancaCirc = ref(false);
const isCriancaLocal = ref(false);
const anoFaixaEtaria = ref('');
const anoRaca = ref('');
const anoGenero = ref('');
const anoCausas = ref('');
const anoCirc = ref('');
const anoLocal = ref('');
const racaNI = ref(false);
const generoNI = ref(false);
const filtrosEvolucao = ref({
  operacaoAcaoPolicial: '',
  balaPerdida: '',
  dentroCasa: '',
  situacao: '',
  faixaEtaria: '',
  racaCor: '',
  genero: '',
});

// Estado do modal de reportar inconsistência
const isReportModalOpen = ref(false);
const mapaCapitais = inject('mapaCapitais');
const mapaGenero = inject('mapaGenero');

// Paleta de cores
const palette = [
  'bg-blue-600',
  'bg-blue-400',
  'bg-blue-200',
  'bg-black-100',
  'bg-violet-600',
  'bg-rose-500',
  'bg-cyan-600',
  'bg-lime-600',
];

// Situation
const situation_to_key = { Wounded: 'feridas', Dead: 'mortas' };

// Funções
// Validador de ano
const yearOf = (v) => {
  if (v?.year) return Number(v.year);
  if (v?.date && typeof v.date === 'string') return Number(v.date.slice(0, 4)); // yyyy-MM-dd
  return NaN;
};

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
  /*       console.log('Dados do formulário:', formData); */
  // Aqui você pode adicionar a lógica para enviar os dados
  // Por exemplo, fazer uma requisição para uma API

  // Por enquanto, apenas mostra um alerta
  alert('Obrigado pelo seu feedback! Entraremos em contato em breve.');
};

// Computeds
const vitimas = computed(() =>
  (vitimasRaw.value || []).filter(
    (v) => v?.state && slugify(v.state) === slug.value,
  ),
);

const vitimasTotais = computed(() => vitimas.value.length);
const vitimasPorPolicia = computed(
  () => vitimas.value.filter((v) => v.policeAction === true).length,
);

const anosDisponiveis = computed(() => {
  const anos = new Set();
  vitimas.value.forEach((v) => {
    const ano =
      Number(v?.year) || (v?.date ? new Date(v.date).getFullYear() : NaN);
    if (!Number.isFinite(ano)) return;
    anos.add(ano);
  });
  return Array.from(anos).sort((a, b) => b - a);
});

const minDate = computed(() => {
  let min = Infinity
  for (const item of vitimas.value) {
    const t = Date.parse(item?.date ?? '')
    if (Number.isFinite(t) && t < min) min = t
  }
  if (min === Infinity) return null
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(min))
})

const maxDate = computed(() => {
  let max = -Infinity
  for (const item of vitimas.value) {
    const t = Date.parse(item?.date ?? '')
    if (Number.isFinite(t) && t > max) max = t
  }
  if (max === -Infinity) return null
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(max))
})

const textoAbertura = computed(() => {
  const c = complementar.value.find(o => slugify(o.nome) === slug.value)
  return c.texto
});

// Dados do gráfico de evolução
const vitimasEvolucaoSimplificada = computed(() => {
  const src = (vitimas.value || []).filter((v) => {
    const ageOk = isCriancaEvolucao.value ? v?.ageGroup === 'Criança' : true;
    return ageOk;
  });

  const srcPorAno = Object.create(null);

  anosDisponiveis.value.forEach((ano) => {
    srcPorAno[ano] = { ano, feridas: 0, mortas: 0, total: 0 };
  });

  for (let i = 0; i < src.length; i++) {
    const v = src[i];
    const ano = yearOf(v);
    if (!Number.isFinite(ano)) continue;

    const key = situation_to_key[v?.situation];
    if (!key) continue;

    const rec = srcPorAno[ano];
    rec[key] += 1;
    rec.total += 1;
  }

  const rows = Object.values(srcPorAno).sort((a, b) => a.ano - b.ano);

  let filledRows = rows;
  if (rows.length > 1) {
    const filled = [];
    const min = rows[0].ano;
    const max = rows[rows.length - 1].ano;
    let i = 0;
    for (let y = min; y <= max; y++) {
      if (i < rows.length && rows[i].ano === y) filled.push(rows[i++]);
      else filled.push({ ano: y, feridas: 0, mortas: 0, total: 0 });
    }
    filledRows = filled;
  }

  const grafico = filledRows.map((r) => ({
    ano: r.ano,
    crimes: { feridas: r.feridas, mortas: r.mortas },
  }));

  const tabela = {
    tableHeaders: ['Ano', 'Feridos', 'Mortos', 'Total'],
    tableRows: filledRows.map((r) => [r.ano, r.feridas, r.mortas, r.total]),
  };

  return { grafico, tabela };
});

// Dados dos gráficos de faixa etária
const vitimasPerfilFaixaEtaria = computed(() => {
  const selected = anoFaixaEtaria.value;

  const src = (vitimas.value || []).filter((v) => {
    if (selected === '' || selected == null) return true;
    const y = yearOf(v);
    return Number.isFinite(y) && String(y) === String(selected);
  });

  const byAge = Object.create(null);
  let total = 0,
    totalFeridas = 0,
    totalMortas = 0;

  for (let i = 0; i < src.length; i++) {
    const v = src[i];
    const label = v?.ageGroup || 'Não identificado';
    const key = situation_to_key[v?.situation];
    if (!key) continue;

    const rec =
      byAge[label] ||
      (byAge[label] = { label, value: 0, feridas: 0, mortas: 0 });
    rec.value += 1;
    rec[key] += 1;

    total += 1;
    if (key === 'feridas') totalFeridas += 1;
    if (key === 'mortas') totalMortas += 1;
  }

  const arr = Object.values(byAge).sort((a, b) => {
    const aNA = a.label === 'Não identificado';
    const bNA = b.label === 'Não identificado';
    if (aNA !== bNA) return aNA ? 1 : -1;
    if (b.value !== a.value) return b.value - a.value;
    return a.label.localeCompare(b.label);
  });

  const grafico = arr.map((it, i) => ({
    label: it.label,
    value: it.value,
    feridas: it.feridas,
    mortas: it.mortas,
    colorClass: palette[i % palette.length],
    percent: total ? (it.value / total) * 100 : 0,
    totalMortas,
    totalFeridas,
  }));

  const tabela = {
    tableHeaders: ['Faixa etária', 'Feridos', 'Mortos', 'Total'],
    tableRows: arr.map((r) => [r.label, r.feridas, r.mortas, r.value]),
  };

  return { grafico, tabela };
});

// Dados dos gráficos de raça
const vitimasPerfilRaca = computed(() => {
  const selected = anoRaca.value;

  const vitimasFiltradas = (vitimas.value || []).filter((v) => {
    const y =
      Number(v?.year) || (v?.date ? new Date(v.date).getFullYear() : NaN);
    const yearOk = !(selected === '' || selected == null)
      ? Number.isFinite(y) && String(y) === String(selected)
      : true;
    const ageOk = isCriancaRaca.value ? v?.ageGroup === 'Criança' : true;
    const niOk = !racaNI.value ? v?.race !== 'Não identificado' : true;
    return yearOk && ageOk && niOk;
  });

  const arr = [];
  let total = 0;
  let totalMortas = 0;
  let totalFeridas = 0;

  for (const v of vitimasFiltradas) {
    const label = v?.race || 'Não identificado';
    const idx = arr.findIndex((it) => it.label === label);

    total += 1;
    const isDead = v.situation === 'Dead';
    const isWounded = v.situation === 'Wounded';
    if (isDead) totalMortas += 1;
    if (isWounded) totalFeridas += 1;

    if (idx === -1) {
      arr.push({
        label,
        value: 1,
        feridas: isWounded ? 1 : 0,
        mortas: isDead ? 1 : 0,
      });
    } else {
      const it = arr[idx];
      it.value += 1;
      if (isWounded) it.feridas += 1;
      if (isDead) it.mortas += 1;
    }
  }

  arr.sort((a, b) => {
    const aNA = a.label === 'Não identificado';
    const bNA = b.label === 'Não identificado';
    if (aNA && !bNA) return 1;
    if (!aNA && bNA) return -1;
    if (b.value !== a.value) return b.value - a.value;
    return a.label.localeCompare(b.label);
  });

  const grafico = arr.map((it, i) => ({
    label: it.label,
    value: it.value,
    feridas: it.feridas,
    mortas: it.mortas,
    colorClass: palette[i % palette.length],
    percent: total ? (it.value / total) * 100 : 0,
    totalMortas,
    totalFeridas,
  }));

  const tabela = {
    tableHeaders: ['Raça/Cor', 'Feridos', 'Mortos', 'Total'],
    tableRows: arr.map((r) => [r.label, r.feridas, r.mortas, r.value]),
  };

  return { grafico, tabela };
});

// Dados dos gráficos de gênero
const vitimasPerfilGenero = computed(() => {
  const selected = anoGenero.value;

  const vitimasFiltradas = (vitimas.value || []).filter((v) => {
    const y =
      Number(v?.year) || (v?.date ? new Date(v.date).getFullYear() : NaN);
    const yearOk = !(selected === '' || selected == null)
      ? Number.isFinite(y) && String(y) === String(selected)
      : true;
    const ageOk = isCriancaGenero.value ? v?.ageGroup === 'Criança' : true;
    const niOk = !generoNI.value ? v?.genre !== 'Não identificado' : true;
    return yearOk && ageOk && niOk;
  });

  const arr = [];
  let total = 0;
  let totalFeridas = 0;
  let totalMortas = 0;

  for (const v of vitimasFiltradas) {
    const raw = v?.genre;
    const mapped = mapaGenero?.[raw];
    const label = mapped || raw || 'Não identificado';

    const idx = arr.findIndex((it) => it.label === label);

    total += 1;
    const isDead = v.situation === 'Dead';
    const isWounded = v.situation === 'Wounded';
    if (isWounded) totalFeridas += 1;
    if (isDead) totalMortas += 1;

    if (idx === -1) {
      arr.push({
        label,
        value: 1,
        feridas: isWounded ? 1 : 0,
        mortas: isDead ? 1 : 0,
      });
    } else {
      const it = arr[idx];
      it.value += 1;
      if (isWounded) it.feridas += 1;
      if (isDead) it.mortas += 1;
    }
  }

  arr.sort((a, b) => {
    const aNA = a.label === 'Não identificado';
    const bNA = b.label === 'Não identificado';
    if (aNA && !bNA) return 1;
    if (!aNA && bNA) return -1;
    if (b.value !== a.value) return b.value - a.value;
    return a.label.localeCompare(b.label);
  });

  const grafico = arr.map((it, i) => ({
    label: it.label,
    value: it.value,
    feridas: it.feridas,
    mortas: it.mortas,
    colorClass: palette[i % palette.length],
    percent: total ? (it.value / total) * 100 : 0,
    totalMortas,
    totalFeridas,
  }));

  const tabela = {
    tableHeaders: ['Gênero', 'Feridos', 'Mortos', 'Total'],
    tableRows: arr.map((r) => [r.label, r.feridas, r.mortas, r.value]),
  };

  return { grafico, tabela };
});

// Dados dos gráficos de causas
const vitimasOcorrenciasCausas = computed(() => {
  const selected = anoCausas.value;

  const src = (vitimas.value || []).filter((v) => {
    const y =
      Number(v?.year) || (v?.date ? new Date(v.date).getFullYear() : NaN);
    const yearOk = !(selected === '' || selected == null)
      ? Number.isFinite(y) && String(y) === String(selected)
      : true;
    const ageOk = isCriancaCausas.value ? v?.ageGroup === 'Criança' : true;
    return yearOk && ageOk;
  });

  const byReason = Object.create(null);
  let total = 0,
    totalFeridas = 0,
    totalMortas = 0;

  for (let i = 0; i < src.length; i++) {
    const v = src[i];
    const label = v?.mainReason || 'Não identificado';

    const rec =
      byReason[label] ||
      (byReason[label] = {
        label,
        value: 0,
        crimes: { feridas: 0, mortas: 0 },
      });

    rec.value += 1;
    total += 1;

    if (v.situation === 'Wounded') {
      rec.crimes.feridas += 1;
      totalFeridas += 1;
    } else if (v.situation === 'Dead') {
      rec.crimes.mortas += 1;
      totalMortas += 1;
    }
  }

  const arr = Object.values(byReason).sort((a, b) => {
    const aNA = a.label === 'Não identificado';
    const bNA = b.label === 'Não identificado';
    if (aNA && !bNA) return 1;
    if (!aNA && bNA) return -1;
    if (b.value !== a.value) return b.value - a.value;
    return a.label.localeCompare(b.label);
  });

  arr.forEach((it) => {
    it.percent = total ? (it.value / total) * 100 : 0;
  });

  const grafico = arr.map((it) => ({
    label: it.label,
    value: it.value,
    crimes: { ...it.crimes },
    percent: it.percent,
  }));

  const tabela = {
    tableHeaders: ['Causa', 'Feridos', 'Mortos', 'Total'],
    tableRows: arr.map((it) => [
      it.label,
      it.crimes.feridas,
      it.crimes.mortas,
      it.value,
    ]),
  };

  return { grafico, tabela };
});

// Dados dos gráficos de faixa etária
const vitimasOcorrenciasCirc = computed(() => {
  const selected = anoCirc.value;

  const src = (vitimas.value || []).filter((v) => {
    const y =
      Number(v?.year) || (v?.date ? new Date(v.date).getFullYear() : NaN);
    const yearOk = !(selected === '' || selected == null)
      ? Number.isFinite(y) && String(y) === String(selected)
      : true;
    const ageOk = isCriancaCirc.value ? v?.ageGroup === 'Criança' : true;
    return yearOk && ageOk;
  });

  const byLabel = Object.create(null);
  let total = 0,
    totalFeridas = 0,
    totalMortas = 0;

  for (let i = 0; i < src.length; i++) {
    const v = src[i];
    const labels = Array.isArray(v.circumstances) ? v.circumstances : [];

    for (let j = 0; j < labels.length; j++) {
      const label = labels[j] || 'Sem identificação';

      const rec =
        byLabel[label] ||
        (byLabel[label] = {
          label,
          value: 0,
          crimes: { feridas: 0, mortas: 0 },
        });

      rec.value += 1;
      total += 1;

      if (v.situation === 'Wounded') {
        rec.crimes.feridas += 1;
        totalFeridas += 1;
      } else if (v.situation === 'Dead') {
        rec.crimes.mortas += 1;
        totalMortas += 1;
      }
    }
  }

  const arr = Object.values(byLabel).sort((a, b) => {
    const aNA = a.label === 'Sem identificação';
    const bNA = b.label === 'Sem identificação';
    if (aNA !== bNA) return aNA ? 1 : -1;
    if (b.value !== a.value) return b.value - a.value;
    return a.label.localeCompare(b.label);
  });

  arr.forEach((it) => {
    it.percent = total ? (it.value / total) * 100 : 0;
  });

  const grafico = arr.map((it) => ({
    label: it.label,
    value: it.value,
    crimes: { ...it.crimes },
    percent: it.percent,
  }));

  const tabela = {
    tableHeaders: ['Circunstância', 'Feridos', 'Mortos', 'Total'],
    tableRows: arr.map((it) => [
      it.label,
      it.crimes.feridas,
      it.crimes.mortas,
      it.value,
    ]),
  };

  return { grafico, tabela };
});

// Dados dos gráficos de faixa etária
const vitimasOcorrenciasLocal = computed(() => {
  const selected = anoLocal.value;

  const src = (vitimas.value || []).filter((v) => {
    const y =
      Number(v?.year) || (v?.date ? new Date(v.date).getFullYear() : NaN);
    const yearOk = !(selected === '' || selected == null)
      ? Number.isFinite(y) && String(y) === String(selected)
      : true;
    const ageOk = isCriancaLocal.value ? v?.ageGroup === 'Criança' : true;
    return yearOk && ageOk;
  });

  const byPlace = Object.create(null);
  let total = 0,
    totalFeridas = 0,
    totalMortas = 0;

  for (let i = 0; i < src.length; i++) {
    const v = src[i];
    const label = v?.place || 'Sem identificação';

    const rec =
      byPlace[label] ||
      (byPlace[label] = {
        label,
        value: 0,
        crimes: { feridas: 0, mortas: 0 },
      });

    rec.value += 1;
    total += 1;

    if (v.situation === 'Wounded') {
      rec.crimes.feridas += 1;
      totalFeridas += 1;
    } else if (v.situation === 'Dead') {
      rec.crimes.mortas += 1;
      totalMortas += 1;
    }
  }

  const arr = Object.values(byPlace).sort((a, b) => {
    const aNA = a.label === 'Sem identificação';
    const bNA = b.label === 'Sem identificação';
    if (aNA !== bNA) return aNA ? 1 : -1;
    if (b.value !== a.value) return b.value - a.value;
    return a.label.localeCompare(b.label);
  });

  arr.forEach((it) => {
    it.percent = total ? (it.value / total) * 100 : 0;
  });

  const grafico = arr.map((it) => ({
    label: it.label,
    value: it.value,
    crimes: { ...it.crimes },
    percent: it.percent,
  }));

  const tabela = {
    tableHeaders: ['Local', 'Feridos', 'Mortos', 'Total'],
    tableRows: arr.map((it) => [
      it.label,
      it.crimes.feridas,
      it.crimes.mortas,
      it.value,
    ]),
  };

  return { grafico, tabela };
});

// Watchers
const vitimasEvolucao = computed(() => {
  const src = (vitimas.value || []).filter((v) => {
    const f = filtrosEvolucao.value || {};

    // Operação/Ação Policial
    if (f.operacaoAcaoPolicial === 'Sim') {
      if (v.policeAction !== true) return false;
    } else if (f.operacaoAcaoPolicial === 'Não') {
      if (v.policeAction !== false) return false;
    }

    // Bala perdida
    if (f.balaPerdida === 'Sim') {
      if (!v.circumstances.includes('Bala perdida')) return false;
    } else if (f.balaPerdida === 'Não') {
      if (v.circumstances.includes('Bala perdida')) return false;
    }

    // Dentro de casa
    if (f.dentroCasa === 'Sim') {
      if (!v.place.includes('Residência')) return false;
    } else if (f.dentroCasa === 'Não') {
      if (v.place.includes('Residência')) return false;
    }

    // Situação (rótulo)
    if (f.situacao === 'Morto') {
      if (v.situation !== 'Dead') return false;
    } else if (f.situacao === 'Ferido') {
      if (v.situation !== 'Wounded') return false;
    }

    // Faixa etária
    if (f.faixaEtaria === 'Criança (0-12)') {
      if (v.ageGroup !== 'Criança') return false;
    } else if (f.faixaEtaria === 'Adolescente (13-17)') {
      if (v.ageGroup !== 'Adolescente') return false;
    }

    // Raça/cor (rótulo direto)
    if (f.racaCor && f.racaCor !== '') {
      if ((v.race ?? 'Não identificado') !== f.racaCor) return false;
    }

    // Gênero
    if (f.genero && f.genero !== '') {
      const generoLabel =
        mapaGenero?.[v.genre] ?? v.genre ?? 'Não identificado';
      if (generoLabel !== f.genero) return false;
    }
    return true;
  });

  const srcPorAno = Object.create(null);

  anosDisponiveis.value.forEach((ano) => {
    srcPorAno[ano] = { ano, feridas: 0, mortas: 0, total: 0 };
  });

  for (let i = 0; i < src.length; i++) {
    const v = src[i];
    const ano = yearOf(v);
    if (!Number.isFinite(ano)) continue;

    const key = situation_to_key[v?.situation];
    if (!key) continue;

    const rec = srcPorAno[ano];
    rec[key] += 1;
    rec.total += 1;
  }

  const rows = Object.values(srcPorAno).sort((a, b) => a.ano - b.ano);

  let filledRows = rows;
  if (rows.length > 1) {
    const filled = [];
    const min = rows[0].ano;
    const max = rows[rows.length - 1].ano;
    let i = 0;
    for (let y = min; y <= max; y++) {
      if (i < rows.length && rows[i].ano === y) filled.push(rows[i++]);
      else filled.push({ ano: y, feridas: 0, mortas: 0, total: 0 });
    }
    filledRows = filled;
  }

  const grafico = filledRows.map((r) => ({
    ano: r.ano,
    crimes: { feridas: r.feridas, mortas: r.mortas },
  }));

  const tabela = {
    tableHeaders: ['Ano', 'Feridos', 'Mortos', 'Total'],
    tableRows: filledRows.map((r) => [r.ano, r.feridas, r.mortas, r.total]),
  };

  return { grafico, tabela };
});

</script>

<!-- pages/sobre.vue -->
<template>
  <LayoutHeader />
  <main class="pt-14">
    <!-- Seção Sobre -->
    <section class="relative bg-blue-800">
      <div
        class="container mx-auto px-5 md:px-0 pb-6 pt-10 md:pt-12 md:pb-6 gap-10 flex flex-col text-white relative z-10 min-h-screen"
      >
        <FeatureTabs
          colors="sobre"
          :tab-labels="{
            sobre: 'SOBRE',
            'fogo-cruzado': 'FOGO CRUZADO',
            glossario: 'GLOSSÁRIO',
            'ficha-tecnica': 'FICHA TÉCNICA',
          }"
        >
          <!--1 Tab: SOBRE -->
          <template #tab-sobre>
            <div class="flex flex-col md:flex-row gap-10 md:gap-8">
              <!-- Titulo -->
              <div class="md:w-4/12">
                <UiTypography variant="h2" color="purple" uppercase>
                  Sobre o Futuro Exterminado 
                </UiTypography>
              </div>

              <!-- Conteúdo -->
              <div class="space-y-4 text-white md:w-8/12">
                <UiTypography variant="body3" color="inherit">
                  Futuro Exterminado é uma iniciativa do
                  <a
                    href="https://fogocruzado.org.br"
                    target="_blank"
                    class="text-yellow-300"
                    >Instituto Fogo Cruzado</a
                  >
                  que aborda um tema urgente e doloroso: a violência armada
                  contra crianças e adolescentes nas regiões metropolitanas de
                  Belém, Recife, Rio de Janeiro e Salvador. As informações
                  apresentadas fazem parte do banco de dados do Fogo Cruzado, o
                  maior da América Latina — um acervo de livre acesso, que pode
                  ser reproduzido gratuitamente e é continuamente atualizado, de
                  forma colaborativa com a participação de usuários dos 57
                  municípios onde a organização atua. 
                </UiTypography>

                <UiTypography variant="body3" color="inherit">
                  Na plataforma Futuro Exterminado é possível consultar
                  informações detalhadas sobre as vítimas, como faixa etária,
                  gênero, local em que foram atingidas e as circunstâncias em
                  que foram baleadas. Entre os indicadores balas perdidas, chacinas ou
                  operações policiais. Cada região metropolitana tem um período
                  específico de cobertura: Rio de Janeiro, desde julho de 2016;
                  Recife, desde abril de 2018; Salvador, desde julho de 2022 e
                  Belém, desde novembro de 2023.
                </UiTypography>
              </div>
            </div>
          </template>

          <!--2 Tab: FOGO CRUZADO -->
          <template #tab-fogo-cruzado>
            <div class="flex flex-col md:flex-row gap-10 md:gap-8">
              <!-- Titulo -->
              <div class="md:w-4/12">
                <UiTypography variant="h2" color="purple" uppercase>
                  o fogo cruzado
                </UiTypography>
              </div>

              <!-- Conteúdo -->
              <div class="space-y-4 text-white md:w-8/12">
                <UiTypography variant="body3" color="inherit">
                  O Instituto Fogo Cruzado criou, em 2016, uma metodologia
                  pioneira para o registro colaborativo e sistemático de
                  episódios de violência armada e suas consequências. Com uma
                  sólida série histórica, essa iniciativa desponta no cenário
                  brasileiro por inovar na combinação de duas estratégias
                  bem-sucedidas:
                </UiTypography>

                <UiList
                  :items="[
                    'Promoção de autonomia da sociedade no registro da violência armada (em suas diversas circunstâncias);',
                    'Curadoria, análise e divulgação responsável das informações, com mecanismos de checagem adequados que garantem confiabilidade aos dados.',
                  ]"
                  item-variant="body3"
                  item-color="inherit"
                  bullet-size="w-1 h-1"
                  bullet-color="bg-yellow-300"
                />

                <UiTypography variant="body3" color="inherit">
                  A rotina do serviço prestado é baseada no tripé: coleta de
                  dados sobre tiroteios e disparos de arma de fogo,
                  sistematização das informações em base de dados própria e
                  disseminação do conhecimento produzido. Para isso, o Instituto
                  disponibiliza um aplicativo gratuito, site, API e mantém forte
                  presença nas redes sociais. 
                </UiTypography>
                <UiTypography variant="body3" color="inherit">
                  Cada região metropolitana onde o Fogo Cruzado atua tem uma
                  equipe responsável por monitorar, diariamente, casos de
                  tiroteios através das nossas fontes e checar cuidadosamente
                  estas informações antes de publicá-las e as adicionar em nosso
                  banco de dados. 
                </UiTypography>
                <UiTypography variant="body3" color="inherit">
                  Os dados produzidos podem ser acessados por meio de uma API,
                  de um aplicativo ou em projetos especiais como Futuro
                  Exterminado. Se você tem dúvidas ou encontrou alguma
                  inconsistência em nossos dados, entre em contato conosco.
                </UiTypography>
              </div>
            </div>
          </template>

          <!--3 Tab: GLOSSÁRIO -->
          <template #tab-glossario>
            <div class="flex flex-col md:flex-row gap-10 md:gap-8">
              <!-- Titulo -->
              <div class="md:w-4/12">
                <UiTypography variant="h2" color="purple" uppercase>
                  glossário
                </UiTypography>
              </div>

              <!-- Conteúdo -->
              <div class="flex flex-col gap-10 text-white md:w-8/12">
                <div>
                  <UiTypography variant="h5" class="mb-2">
                    Ação ou operação policial
                  </UiTypography>
                  <UiTypography variant="body3" color="inherit">
                    Atividades executadas pelas forças de segurança, em serviço.
                    As ações policiais incluem procedimentos de rotina como
                    abordagens, rondas, patrulhamento e blitz, realizados
                    diariamente pelos agentes. Já as operações policiais são
                    intervenções previamente planejadas, com objetivos
                    específicos, que podem envolver a participação coordenada de
                    múltiplas unidades policiais.
                  </UiTypography>
                </div>

                <div>
                  <UiTypography variant="h5" class="mb-2">
                    Adolescente
                  </UiTypography>
                  <UiTypography variant="body3" color="inherit">
                    Pessoas com idades entre 12 e 17 anos (Unicef e Estatuto da
                    Criança e do Adolescente).
                  </UiTypography>
                </div>

                <div>
                  <UiTypography variant="h5" class="mb-2">
                    Bala perdida
                  </UiTypography>
                  <UiTypography variant="body3" color="inherit">
                    Pessoa atingida por projétil de arma de fogo, sem ter
                    qualquer ligação, participação ou influência sobre o evento
                    que originou o disparo, estando alheia à situação que
                    provocou o uso da arma e encontrando-se no local por
                    circunstâncias independentes daquela que gerou os disparos.
                  </UiTypography>
                </div>

                <div>
                  <UiTypography variant="h5" class="mb-2">
                    Chacina
                  </UiTypography>
                  <UiTypography variant="body3" color="inherit">
                    Eventos onde há 3 ou mais mortos civis em uma mesma situação
                    — independente do motivo dos disparos: assalto, ataque,
                    operação etc.
                  </UiTypography>
                </div>

                <div>
                  <UiTypography variant="h5" class="mb-2">
                    Criança
                  </UiTypography>
                  <UiTypography variant="body3" color="inherit">
                    Pessoas com idade inferior a 12 anos (Unicef e Estatuto da
                    Criança e do Adolescente).
                  </UiTypography>
                </div>

                <div>
                  <UiTypography variant="h5" class="mb-2">
                    Tiroteio
                  </UiTypography>
                  <UiTypography variant="body3" color="inherit">
                    Disparos sucessivos, troca de tiros.
                  </UiTypography>
                </div>

                <div>
                  <UiTypography variant="h5" class="mb-2">
                    Tiros dentro de residência
                  </UiTypography>
                  <UiTypography variant="body3" color="inherit">
                    Toda situação com disparos de arma de fogo na área de uma
                    residência. Aqui não importa se a vítima estava dentro da
                    sua residência ou residência alheia. Quintais, terraços e
                    lajes contam como residência, contanto que estejam do portão
                    para o interior da casa. Casos em que as vítimas foram
                    arrastadas de dentro de casa para serem atingidas ou
                    tentaram fugir do invasor, sendo mortas na rua, também são
                    considerados no marcador de residências.
                  </UiTypography>
                </div>
              </div>
            </div>
          </template>

          <!--4 Tab: FICHA TÉCNICA -->
          <template #tab-ficha-tecnica>
            <div class="flex flex-col md:flex-row gap-10 md:gap-8">
              <!-- Titulo -->
              <div class="md:w-4/12">
                <UiTypography variant="h2" color="purple" uppercase>
                  ficha técnica
                </UiTypography>
              </div>
              <!-- Conteúdo -->
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-8 text-white md:w-8/12"
              >
                <!-- Coluna 1 -->
                <div class="space-y-6">
                  <div>
                    <UiTypography variant="h5" class="mb-2">
                      FOGO CRUZADO
                    </UiTypography>
                    <div class="space-y-3">
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Cecília Olliveira
                        </UiTypography>
                        <UiTypography variant="body3" color="inherit">
                          Diretora executiva
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Maria Isabel Couto
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Diretora de dados e transparência
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Marianna Araujo
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Diretora de comunicação e inovação
                        </UiTypography>
                      </div>
                    </div>
                  </div>

                  <div>
                    <UiTypography variant="h5" class="mb-2">
                      GESTÃO
                    </UiTypography>
                    <div class="space-y-3">
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Davi Arloy
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Gerente de gestão
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Davi Santos
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Coordenador de TI
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Letícia Wolowski
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista Financeira
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Elisangela Lopes
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Assistente Executiva
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Layla Santos
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Assistente Administrativo Financeiro
                        </UiTypography>
                      </div>
                    </div>
                  </div>

                  <div>
                    <UiTypography variant="h5" class="mb-2">
                      COMUNICAÇÃO E INOVAÇÃO
                    </UiTypography>
                    <div class="space-y-3">
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Diogo Santos
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Gerente de comunicação e inovação
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Renata Sena
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Redatora
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Juliana Aguiar
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de redes
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Gabrielli Thomaz
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Assessora de imprensa
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Gaby Pereira
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Designer
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Yann Waise
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Produtor de vídeo
                        </UiTypography>
                      </div>
                    </div>
                  </div>

                  <div>
                    <UiTypography variant="h5" class="mb-2">
                      DADOS E PESQUISA
                    </UiTypography>
                    <div class="space-y-3">
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Terine Coelho
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Gerente de pesquisa
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Íris Rosa
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Pesquisadora
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Rafael Coletto
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Leandro Silva
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados junior
                        </UiTypography>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Coluna 2 -->
                <div class="space-y-6">
                  <div>
                    <UiTypography variant="h5" class="mb-2">
                      EQUIPE BA
                    </UiTypography>
                    <div class="space-y-3">
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Tailane Muniz
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Coordenadora
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Brigitte Barreiro
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Ominlandê Onawale
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Paulo Aguiar
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Vanessa Rocha
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                    </div>
                  </div>

                  <div>
                    <UiTypography variant="h5" class="mb-2">
                      EQUIPE PE
                    </UiTypography>
                    <div class="space-y-3">
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Ana Maria Franca
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Coordenadora
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Joan Kleber Amorim
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Lara Pirro
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                    </div>
                  </div>

                  <div>
                    <UiTypography variant="h5" class="mb-2">
                      EQUIPE RJ
                    </UiTypography>
                    <div class="space-y-3">
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Carlos Nhanga
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Coordenador
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Laerte Breno
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Mayara Mangifeste
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Michel Rosa
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Rodrigo Raimundo
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                    </div>
                  </div>

                  <div>
                    <UiTypography variant="h5" class="mb-2">
                      EQUIPE PA
                    </UiTypography>
                    <div class="space-y-3">
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Eryck Batalha
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Coordenador
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Raquel Freitas
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Leandro Sarrazin
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Thayana Campos
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados
                        </UiTypography>
                      </div>
                      <div>
                        <UiTypography variant="body3" color="inherit">
                          Lucas Patrick
                        </UiTypography>
                        <UiTypography variant="body3" class="text-white/70">
                          Analista de dados volante
                        </UiTypography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </FeatureTabs>
      </div>

      <!-- Svg -->
      <div class="absolute translate-y-0.5 bottom-0 left-0 w-9/12 md:w-auto">
        <svg
          class="w-full h-auto md:w-[482px] md:h-[282px]"
          viewBox="0 0 482 282"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M-0.000611226 5.89949e-05L481.238 282L-0.000648224 282L-0.000611226 5.89949e-05Z"
            fill="#160F38"
          />
        </svg>
      </div>
    </section>
  </main>
  <LayoutFooter />
</template>

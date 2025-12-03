<template>
  <footer id="footer">
    <!-- Seção Principal -->
    <section class="bg-blue-1000 text-white">
      <div
        class="container mx-auto px-5 pb-6 pt-10 md:pt-12 md:pb-6 gap-10 flex flex-col"
      >
        <div
          class="flex flex-col md:flex-row justify-between items-start gap-12"
        >
          <!-- Lado Esquerdo -->
          <div class="flex flex-col gap-12 md:w-6/12 w-full">
            <!-- Logo Principal -->
            <div>
              <SvgoLogoVertical
                class="w-[200px] text-white"
                :fontControlled="false"
              />
            </div>

            <!-- Seção Mover-se na Web -->
            <div
              class="flex md:gap-8 gap-6 md:flex-row flex-col md:items-center"
            >
              <figure>
                <img
                  src="~/assets/images/logo-moverse.png"
                  class="w-[144.55px]"
                />
              </figure>
              <UiTypography
                variant="body2"
                color="inherit"
                class="max-w-[355px]"
              >
                Este projeto tem o apoio do Mover-se na Web iniciativa do
                NIC.br. Saiba mais em:
                <a
                  href="https://moverse.ceweb.br"
                  class="text-yellow-300 hover:underline"
                  target="_blank"
                  rel="noopener"
                >
                  moverse.ceweb.br
                </a>
              </UiTypography>
            </div>
          </div>

          <!-- Lado Direito - Navegação -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 md:w-6/12 w-full">
            <!-- INTRODUÇÃO -->

            <NuxtLink to="/introducao">
              <UiTypography
                variant="h6"
                color="inherit"
                uppercase
                class="hover:text-yellow-300 transition-colors cursor-pointer"
              >
                INTRODUÇÃO
              </UiTypography>
            </NuxtLink>

            <!-- SOBRE -->
            <NuxtLink to="/sobre">
              <UiTypography
                variant="h6"
                color="inherit"
                uppercase
                class="hover:text-yellow-300 transition-colors cursor-pointer"
              >
                SOBRE
              </UiTypography>
              <!-- Sem itens específicos conforme a imagem -->
            </NuxtLink>

            <!-- MAPA -->
            <div class="flex flex-col gap-4">
              <NuxtLink to="/mapa">
                <UiTypography
                  variant="h6"
                  color="inherit"
                  uppercase
                  class="hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  MAPA
                </UiTypography>
              </NuxtLink>
              <ul class="flex flex-col gap-6 text-sm">
                <li v-for="estado in estados">
                  <NuxtLink
                    :to="`/mapa?estado=${slugfy(estado)}`"
                    class="hover:text-yellow-300 transition-colors"
                    >{{ estado }}</NuxtLink
                  >
                </li>
              </ul>
            </div>

            <!-- ESTATÍSTICAS -->
            <div class="flex flex-col gap-4">
              <NuxtLink to="/estatisticas">
                <UiTypography
                  variant="h6"
                  color="inherit"
                  uppercase
                  class="hover:text-yellow-300 transition-colors cursor-pointer"
                >
                  ESTATÍSTICAS
                </UiTypography>
              </NuxtLink>
              <ul class="flex flex-col gap-6 text-sm">
                <li v-for="estado in estados">
                  <NuxtLink
                    :to="`/detalhes/${slugfy(estado)}`"
                    class="hover:text-yellow-300 transition-colors"
                    >{{ estado }}</NuxtLink
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          class="flex flex-col md:flex-row justify-between md:items-center gap-6"
        >
          <!-- Logo Fogo Cruzado -->
           <a href="https://fogocruzado.org.br/" target="_blank">
            <figure>
              <img
                src="~/assets/images/logo-fogo-cruzado.png"
                class="w-[172px]"
              />
            </figure>
           </a>

          <!-- Redes Sociais  -->
          <div class="flex flex-col md:flex-row md:items-center gap-6">
            <div class="flex items-center gap-4">
              <span class="text-sm">Nossas redes</span>
              <div class="flex gap-4">
                <!-- Facebook -->
                <a
                  href="https://www.facebook.com/fogocruzadobr"
                  class="text-white hover:text-yellow-300 transition-colors"
                  target="_blank"
                  rel="noopener"
                  aria-label="Facebook"
                >
                  <SvgoFacebook
                    class="w-[20px] h-[20px]"
                    :fontControlled="false"
                  />
                </a>

                <!-- X (Twitter) -->
                <a
                  href="https://x.com/fogocruzado"
                  class="text-white hover:text-yellow-300 transition-colors"
                  target="_blank"
                  rel="noopener"
                  aria-label="X (Twitter)"
                >
                  <SvgoXsocial
                    class="w-[20px] h-[20px]"
                    :fontControlled="false"
                  />
                </a>

                <!-- Instagram -->
                <a
                  href="https://www.instagram.com/fogocruzadobr"
                  class="text-white hover:text-yellow-300 transition-colors"
                  target="_blank"
                  rel="noopener"
                  aria-label="Instagram"
                >
                  <SvgoInstagram
                    class="w-[20px] h-[20px]"
                    :fontControlled="false"
                  />
                </a>

                <!-- YouTube -->
                <a
                  href="https://www.youtube.com/fogocruzado"
                  class="text-white hover:text-yellow-300 transition-colors"
                  target="_blank"
                  rel="noopener"
                  aria-label="YouTube"
                >
                  <SvgoYoutube
                    class="w-[20px] h-[20px]"
                    :fontControlled="false"
                  />
                </a>

                <!-- LinkedIn -->
                <a
                  href="https://www.linkedin.com/company/fogo-cruzado"
                  class="text-white hover:text-yellow-300 transition-colors"
                  target="_blank"
                  rel="noopener"
                  aria-label="LinkedIn"
                >
                  <SvgoLinkedin
                    class="w-[20px] h-[20px]"
                    :fontControlled="false"
                  />
                </a>
              </div>
            </div>
          </div>

          <!-- App Download -->
          <div class="text-sm">
            Baixe o app
            <a
              href="https://play.google.com/store/search?q=fogo+cruzado&c=apps"
              class="text-yellow-300 hover:underline font-medium"
              target="_blank"
              rel="noopener"
            >
              Fogo cruzado
            </a>
          </div>
        </div>
      </div>
    </section>
    <!-- Seção Copyright -->
    <section class="bg-base-1000 text-base-300">
      <div class="container mx-auto px-5 py-4">
        <div
          class="flex flex-col md:flex-row justify-between md:items-center text-sm"
        >
          <div class="flex items-center gap-1">
            2025
            <span
              ><SvgoCc class="w-[14px] h-[14px]" :fontControlled="false"
            /></span>
            Fogo Cruzado
          </div>
          <div>
            Design e creative code por
            <a
              href="https://cafe.art.br"
              class="text-base-300 hover:underline hover:text-yellow-300"
              target="_blank"
              rel="noopener"
              >Cafe.art.br</a
            >
          </div>
        </div>
      </div>
    </section>
  </footer>
</template>
<script setup>
  const slugfy = useSlugify();
  const estados = inject("estados");
</script>   

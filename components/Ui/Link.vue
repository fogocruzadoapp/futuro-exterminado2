<template>
  <button class="ui-link">
    <slot />
  </button>
</template>

<style scoped>
@reference "@/assets/css/global.css";
.ui-link {
  @apply text-yellow-300 hover:text-yellow-300/90 cursor-pointer relative transition-colors duration-200;
  /* Remove o underline padrão do Tailwind */
  text-decoration: none;
}

.ui-link::after {
  @apply content-[''] absolute left-0 bottom-0 w-full h-[1px] bg-yellow-300 transition-all duration-200 ease-in-out;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease-in-out;
}

.ui-link:hover::after,
.ui-link:focus-visible::after {
  transform: scaleX(1);
  transform-origin: right;
}
</style>

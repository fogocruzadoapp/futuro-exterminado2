import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router'

export function useHeaderAnimation() {
  const isOpen = ref(false);
  const isAnimating = ref(false);
  const showMenuContent = ref(false);
  const activeId = ref(null);
  const router = useRouter()

  function handleToggle(id: any) {
    activeId.value = activeId.value === id ? null : id;
  }

  async function openMenu() {
    isOpen.value = true;
    isAnimating.value = false;
    showMenuContent.value = false;
    await nextTick();
    requestAnimationFrame(() => {
      isAnimating.value = true;
    });
    setTimeout(() => {
      showMenuContent.value = true;
    }, 400);
  }

  function closeMenu() {
    showMenuContent.value = false;
    isAnimating.value = false;
    setTimeout(() => {
      isOpen.value = false;
    }, 300);
  }

  let listenerAttached = false

  if (!listenerAttached) {
    router.afterEach(() => {
      closeMenu()
    })
    listenerAttached = true
  }

  return {
    isOpen,
    isAnimating,
    showMenuContent,
    activeId,
    handleToggle,
    openMenu,
    closeMenu,
  };
}

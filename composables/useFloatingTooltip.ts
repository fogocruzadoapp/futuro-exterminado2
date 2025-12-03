import { reactive, ref, nextTick, onBeforeUnmount } from 'vue'

type TipState = {
  show: boolean
  x: number
  y: number
  html: string
}

export function useFloatingTooltip(width = 280, estLineH = 22) {
  const tip = reactive<TipState>({
    show: false,
    x: 0,
    y: 0,
    html: '',
  })

  // NOVO: largura medida do tooltip (fallback no width do argumento)
  const widthRef = ref<number>(width)

  // NOVO: helper para obter o elemento real do tooltip de gráficos
  // (usa a classe .tooltip-content, presente no teu UiTooltip no bloco "html")
  function _getTooltipEl(): HTMLElement | null {
    if (!process.client) return null
    return document.querySelector('.tooltip-content') as HTMLElement | null
  }

  // NOVO: medir largura real, mesmo se estiver oculto inicialmente
  function _measureWidth() {
    if (!process.client) return
    const el = _getTooltipEl()
    if (!el) return

    const cs = getComputedStyle(el)
    const wasHidden =
      cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0

    // snapshot inline styles para medir sem piscar
    const prev = {
      position: el.style.position,
      left: el.style.left,
      top: el.style.top,
      display: el.style.display,
      visibility: el.style.visibility,
      zIndex: el.style.zIndex,
    }

    if (wasHidden) {
      el.style.position = 'absolute'
      el.style.left = '-99999px'
      el.style.top = '-99999px'
      el.style.visibility = 'hidden'
      el.style.display = 'block'
      el.style.zIndex = '-1'
    }

    const w = Math.ceil(el.offsetWidth || el.getBoundingClientRect().width || widthRef.value)

    // restaura
    if (wasHidden) {
      el.style.position = prev.position
      el.style.left = prev.left
      el.style.top = prev.top
      el.style.display = prev.display
      el.style.visibility = prev.visibility
      el.style.zIndex = prev.zIndex
    }

    // só atualiza se mudou (evita reflows desnecessários)
    if (w && w !== widthRef.value) {
      widthRef.value = w
    }
  }

  // OPCIONAL: observar mudanças do conteúdo para atualizar a largura
  let ro: ResizeObserver | null = null
  function _observe() {
    if (!process.client) return
    const el = _getTooltipEl()
    if (!el) return
    if (!ro) {
      ro = new ResizeObserver(() => _measureWidth())
    }
    ro.observe(el)
  }
  function _unobserve() {
    if (ro) {
      try { ro.disconnect() } catch {}
      ro = null
    }
  }
  onBeforeUnmount(_unobserve)

  function _clampToViewport(x: number, y: number) {
    const pad = 12
    const h = 120
    const vw = process.client ? window.innerWidth  : 1920
    const vh = process.client ? window.innerHeight : 1080

    // usa a largura medida (fallback para width do argumento)
    const w = widthRef.value || width

    // mantém tua lógica original (centrando pelo width no X e no Y)
    let nx = x + pad
    let ny = y + pad

    // vira pra esquerda/para cima quando estourar
    if (nx + w > vw) nx = x - w - pad
    if (ny + h > vh) ny = y - h - pad

    // pequenos clamps para não “colar” fora da tela
    if (nx < pad) nx = pad
    if (ny < pad) ny = pad

    return { x: Math.round(nx), y: Math.round(ny) }
  }

  async function showAtEvent(e: MouseEvent, html?: string) {
    tip.html = html ?? ''
    tip.show = true
    // mede após injetar o HTML no UiTooltip
    await nextTick()
    _measureWidth()
    _observe()
    moveWithEvent(e)
  }

  function moveWithEvent(e: MouseEvent) {
    // se precisar garantir em movimentos rápidos:
    // _measureWidth()
    const { x, y } = _clampToViewport(e.clientX, e.clientY)
    tip.x = x
    tip.y = y
  }

  function hide() {
    tip.show = false
    tip.html = ''
    _unobserve()
  }

  // mantém a API de retorno original e expõe a largura para debug/uso
  return { tip, showAtEvent, moveWithEvent, hide, width: widthRef }
}

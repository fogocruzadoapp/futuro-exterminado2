<template>
  <NuxtPage />
</template>

<script setup>
// Imports e configs
import { markRaw, provide, computed } from 'vue'
const route = useRoute()
const router = useRouter()
const slugify = useSlugify()

// Mapas fixos
const mapaCapitais = {
  acre: 'Rio Branco',
  alagoas: 'Maceió',
  amapa: 'Macapá',
  amazonas: 'Manaus',
  bahia: 'Salvador',
  ceara: 'Fortaleza',
  'espirito-santo': 'Vitória',
  goias: 'Goiânia',
  maranhao: 'São Luís',
  'mato-grosso': 'Cuiabá',
  'mato-grosso-do-sul': 'Campo Grande',
  'minas-gerais': 'Belo Horizonte',
  para: 'Belém',
  paraiba: 'João Pessoa',
  parana: 'Curitiba',
  pernambuco: 'Recife',
  piaui: 'Teresina',
  'rio-de-janeiro': 'Rio de Janeiro',
  'rio-grande-do-norte': 'Natal',
  'rio-grande-do-sul': 'Porto Alegre',
  rondonia: 'Porto Velho',
  roraima: 'Boa Vista',
  'santa-catarina': 'Florianópolis',
  'sao-paulo': 'São Paulo',
  sergipe: 'Aracaju',
  tocantins: 'Palmas',
  'distrito-federal': 'Brasília',
}
const mapaGenero = {
  'Homem cis': 'Menino',
  'Homem trans': 'Menino',
  'Mulher cis': 'Menina',
  'Mulher trans e travesti': 'Menina',
  'Não identificado': 'Não identificado',
}
provide('mapaCapitais', mapaCapitais)
provide('mapaGenero', mapaGenero)

// Carrega ocorrências
const { data: vitimas } = await useFetch('/api/fogo-cruzado', {
  server: true,
  lazy: false,
  default: () => [],
})
provide('vitimas', vitimas) // mantém como ref global; se quiser estático, use markRaw(vitimas.value)

// Estados únicos
const estados = computed(() => {
  const arr = vitimas.value || []
  return Array.from(new Set(arr.map(o => o.state).filter(Boolean))).sort()
})
provide('estados', estados)

// Carrega informações complementares
const { data: complementar } = await useFetch('/api/informacoes-complementares', {
  server: true,
  lazy: false,
  default: () => [],
})
provide('complementar', complementar)

// Helpers
const pct = (num, den) => (den ? (num / den) * 100 : 0)
const mesesEntre = (minTs) => (minTs ? (Date.now() - minTs) / (1000 * 60 * 60 * 24) / 30.44 : 0)

// Janela móvel de 30 dias (sem ponderar)
const cutoff30d = Date.now() - 30 * 24 * 60 * 60 * 1000
const recentes30d = (vitimas.value || []).filter(v => {
  const ts = Date.parse(v.date)
  return Number.isFinite(ts) && ts >= cutoff30d
})

// Agregação numa passada usando campos brutos
function computeStats(arr) {
  const res = {
    total: arr.length,
    wounded: 0,
    dead: 0,
    minTs: Infinity,
    menino: { total: 0, dead: 0, wounded: 0 },
    operacao: { total: 0, dead: 0, wounded: 0 },
    balaPerdida: { total: 0, dead: 0, wounded: 0 },
    casa: { total: 0, dead: 0, wounded: 0 },
  }

  for (const v of arr) {
    // datas
    const ts = Date.parse(v.date)
    if (Number.isFinite(ts) && ts < res.minTs) res.minTs = ts

    // totais por situação
    if (v.situation === 'Wounded') res.wounded++
    else if (v.situation === 'Dead') res.dead++

    // normalizações no ato
    const genreNorm = mapaGenero[v.genre] || 'Não identificado'
    const isOp = !!v.policeAction

    const hasBalaPerdida = Array.isArray(v.circumstances)
      ? v.circumstances.includes('Bala perdida')
      : String(v.circumstances || '').includes('Bala perdida')

    const isCasa = Array.isArray(v.place)
      ? v.place.some(p => String(p).includes('Residência'))
      : String(v.place || '').includes('Residência')

    // Menino
    if (genreNorm === 'Menino') {
      res.menino.total++
      if (v.situation === 'Wounded') res.menino.wounded++
      else if (v.situation === 'Dead') res.menino.dead++
    }

    // Operação policial
    if (isOp) {
      res.operacao.total++
      if (v.situation === 'Wounded') res.operacao.wounded++
      else if (v.situation === 'Dead') res.operacao.dead++
    }

    // Bala perdida
    if (hasBalaPerdida) {
      res.balaPerdida.total++
      if (v.situation === 'Wounded') res.balaPerdida.wounded++
      else if (v.situation === 'Dead') res.balaPerdida.dead++
    }

    // Dentro de casa
    if (isCasa) {
      res.casa.total++
      if (v.situation === 'Wounded') res.casa.wounded++
      else if (v.situation === 'Dead') res.casa.dead++
    }
  }

  if (res.minTs === Infinity) res.minTs = null
  return res
}

// Calcula stats uma vez (dados são estáticos)
const _stats = computeStats(vitimas.value || [])

// Intro pronta (numérica; formate toFixed na UI)
const introStats = {
  vitimasCount: _stats.total,
  anoInicial: _stats.minTs ? new Date(_stats.minTs).getFullYear() : null,
  feridosCount: _stats.wounded,
  feridosPercent: pct(_stats.wounded, _stats.total),
  mortosCount: _stats.dead,
  mortosPercent: pct(_stats.dead, _stats.total),
  periodoMeses: mesesEntre(_stats.minTs),
  mediaGeral: recentes30d.length,
  menino: {
    count: _stats.menino.total,
    percent: pct(_stats.menino.total, _stats.total),
    mortos: _stats.menino.dead,
    feridos: _stats.menino.wounded,
  },
  operacao: {
    count: _stats.operacao.total,
    percent: pct(_stats.operacao.total, _stats.total),
    mortos: _stats.operacao.dead,
    feridos: _stats.operacao.wounded,
  },
  balaPerdida: {
    count: _stats.balaPerdida.total,
    percent: pct(_stats.balaPerdida.total, _stats.total),
    mortos: _stats.balaPerdida.dead,
    feridos: _stats.balaPerdida.wounded,
  },
  casa: {
    count: _stats.casa.total,
    percent: pct(_stats.casa.total, _stats.total),
    mortos: _stats.casa.dead,
    feridos: _stats.casa.wounded,
  },
}
provide('introStats', markRaw(introStats))

// Estado selecionado
const estadoSelecionado = computed({
  get: () => route.query.estado || 'rio-de-janeiro',
  set: (novo) => {
    const slug = slugify(novo)
    if (route.query.estado !== slug) {
      router.replace({ query: { ...route.query, estado: slug } })
    }
  },
})
provide('estadoSelecionado', estadoSelecionado)

// Vitimas por estado
function buildPorEstado(arr) {
  const out = Object.create(null)

  for (const v of arr) {
    // slug consistente com sua UI (?estado=...), use seu helper
    const slug = slugify(v.state || 'indefinido')
    if (!out[slug]) {
      out[slug] = {
        slug,
        capital: mapaCapitais[slug] || 'Indefinido',
        nome: v.state || 'Indefinido',
        inicio: Infinity,
        total: 0,
        wounded: 0,
        dead: 0,
        vitimas: [],
      }
    }

    const g = out[slug]
    g.total++
    if (v.situation === 'Wounded') g.wounded++
    else if (v.situation === 'Dead') g.dead++

    g.inicio = Math.min(g.inicio, Date.parse(v.date) || Infinity)

    g.vitimas.push(v)
  }

  return out
}

const porEstado = markRaw(buildPorEstado(vitimas.value || []))
provide('porEstado', porEstado)
</script>
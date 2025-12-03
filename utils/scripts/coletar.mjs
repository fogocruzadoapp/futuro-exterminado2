// utils/scripts/coletar.mjs

import 'dotenv/config'
import fs from 'fs/promises'
import fetch from 'node-fetch'

const BASE_URL = 'https://api-service.fogocruzado.org.br/api/v2'
const VICTIMS_API_URL = 'https://fepbnz8ma2.us-east-1.awsapprunner.com/victims_details'

const OUTPUT_PATH = './public/fogo-cruzado.json'
const CACHE_PATH = './public/fogo-cruzado.meta.json'
const YEARS = Array.from({ length: 11 }, (_, i) => 2015 + i)
const DELAY = 1300

const email = process.env.FC_EMAIL
const password = process.env.FC_PASSWORD
const victimsToken = process.env.VICTIMS_TOKEN

if (!email || !password) {
  console.error('Variáveis FC_EMAIL ou FC_PASSWORD ausentes no .env')
  process.exit(1)
}

if (!victimsToken) {
  console.error('Variável VICTIMS_TOKEN ausente no .env')
  process.exit(1)
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function login() {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const json = await res.json()
  return json.data.accessToken
}

async function getStates(token) {
  const res = await fetch(`${BASE_URL}/states`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const json = await res.json()
  return json.data
}

async function readLocalMeta() {
  try { return JSON.parse(await fs.readFile(CACHE_PATH, 'utf8')) } catch { return null }
}

async function writeLocalMeta(meta) {
  await fs.writeFile(CACHE_PATH, JSON.stringify(meta, null, 2))
}

// lê headers globais em /occurrences
async function getRemoteUpdateHeaders(token) {
  // pega 1 estado para montar chamada leve
  const resStates = await fetch(
    `${BASE_URL}/states?` + new URLSearchParams({ page: '1', take: '1' }),
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const statesJson = await resStates.json()
  const stateId = statesJson?.data?.[0]?.id
  if (!stateId) return { lastUpdateIso: null, lastUpdateTs: null }

  // chamada mínima a /occurrences para ler os headers de update
  const params = new URLSearchParams({
    page: '1',
    take: '1',
    idState: stateId,
    initialdate: '2015-01-01',
    finaldate: '2015-01-02'
  })
  const res = await fetch(`${BASE_URL}/occurrences?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  const iso = res.headers.get('X-Last-Update') || res.headers.get('x-last-update')
  const tsStr = res.headers.get('X-Last-Update-Timestamp') || res.headers.get('x-last-update-timestamp')
  const lastUpdateTs = tsStr ? Number(tsStr) : null

  return { lastUpdateIso: iso ?? null, lastUpdateTs }
}

async function waitForRateLimitReset(res) {
  const reset = res.headers.get('x-ratelimit-reset')
  if (reset && /^\d+$/.test(reset)) {
    const resetMs = Number(reset) * 1000
    const now = Date.now()
    const waitMs = Math.max(2000, resetMs - now) // 2s mínimo de segurança
    console.warn(`429: aguardando ${waitMs}ms até o reset...`)
    await wait(waitMs)
  } else {
    console.warn('429: sem header de reset — aguardando 5000ms...')
    await wait(5000)
  }
}

async function fetchAllOccurrences(token, stateId, year) {
  const take = 50
  let page = 1
  let all = []
  let totalPages = 1

  do {
    const url = `${BASE_URL}/occurrences?` + new URLSearchParams({
      initialdate: `${year}-01-01`,
      finaldate: `${year}-12-31`,
      page: page.toString(),
      take: take.toString(),
      idState: stateId
    })

    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

    // se estourou o limite, espera e tenta novamente esta mesma página
    if (res.status === 429) {
      await waitForRateLimitReset(res)
      continue // volta para o início do loop sem avançar a página
    }

    if (!res.ok) {
      const bodyText = await res.text().catch(() => '')
      throw new Error(`Falha em /occurrences (HTTP ${res.status}) — ${bodyText.slice(0, 200)}`)
    }

    const json = await res.json()

    const filtered = json.data.filter(o =>
      Array.isArray(o.victims) &&
      o.victims.some(v => ['Adolescente', 'Criança'].includes(v?.ageGroup?.name))
    )

    all.push(...filtered)
    totalPages = json.pageMeta.pageCount
    console.log(`${year} / ${stateId} - Página ${page}/${totalPages} [Filtrados: ${filtered.length}]`)

    page++
    await wait(DELAY) // aumente para ~1300–1500ms
  } while (page <= totalPages)

  return all
}

async function fetchVictimDetails() {
  const res = await fetch(VICTIMS_API_URL, {
    headers: { Authorization: victimsToken }
  })

  if (!res.ok) {
    console.error('Erro ao buscar vítimas complementares:', res.status)
    process.exit(1)
  }

  const json = await res.json()

  const map = new Map()
  for (const victim of json) {
    map.set(victim.id, victim)
  }

  return map
}

async function main() {
  console.log('Autenticando...')
  const token = await login()

  // checagem de atualização por headers
  console.log('Checando headers de atualização...')
  const remote = await getRemoteUpdateHeaders(token)
  const local  = await readLocalMeta()

  console.log('Remoto X-Last-Update-Timestamp:', remote.lastUpdateTs, '| Local:', local?.lastUpdateTs ?? null)

  // se o timestamp remoto for igual ao local, nada a fazer
  if (remote.lastUpdateTs && local?.lastUpdateTs && remote.lastUpdateTs === local.lastUpdateTs) {
    console.log('Dados já atualizados. Encerrando.')
    return
  }

  console.log('Buscando estados...')
  const states = await getStates(token)
  const result = []

  for (const year of YEARS) {
    for (const state of states) {
      const data = await fetchAllOccurrences(token, state.id, year)
      result.push(...data)
    }
  }

  console.log(`Total de ocorrências filtradas: ${result.length}`)
  console.log('Buscando dados complementares das vítimas...')

  const victimMap = await fetchVictimDetails()
  console.log('Enriquecendo registros com nomes das vitimas.')
  const enriquecidos = result.map(ocorrencia => {
    const nova = { ...ocorrencia }

    if (nova.victims?.length) {
      nova.victims = nova.victims.map(v => {
        const detalhes = victimMap.get(v.id)
        return {
          ...v,
          name: detalhes?.name || null
        }
      })
    }

    return nova
  })

  const vitimasFormatadas = []

  for (const ocorrencia of enriquecidos) {
    const vitimas = Array.isArray(ocorrencia.victims)
      ? ocorrencia.victims.filter(v => ['Adolescente', 'Criança'].includes(v?.ageGroup?.name))
      : []

    for (const vitima of vitimas) {
      vitimasFormatadas.push({
        occurrenceId: ocorrencia.id,
        date: ocorrencia.date,
        state: ocorrencia.state?.name,
        city: ocorrencia.city?.name,
        neighborhood: ocorrencia.neighborhood?.name,
        subNeighborhood: ocorrencia.subNeighborhood?.name,
        locality: ocorrencia.locality?.name,
        region: ocorrencia.region?.region,
        latitude: ocorrencia.latitude,
        longitude: ocorrencia.longitude,
        situation: vitima.situation,
        name: vitima.name,
        age: vitima.age,
        ageGroup: vitima.ageGroup?.name,
        genre: vitima.genre?.name,
        race: vitima.race,
        place: vitima.place?.name,
        circumstances: vitima.circumstances?.map(c => c.name) || [],
        deathDate: vitima.deathDate,
        mainReason: ocorrencia.contextInfo?.mainReason?.name,
        policeAction: ocorrencia.policeAction,
      })
    }
  }

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(vitimasFormatadas, null, 2))
  console.log(`Arquivo salvo em ${OUTPUT_PATH} com ${vitimasFormatadas.length} vítimas (complementados).`)

  // Atualiza o meta local
  await writeLocalMeta({
    lastUpdateTs: remote.lastUpdateTs ?? null,
    lastUpdateIso: remote.lastUpdateIso ?? null,
    savedAt: new Date().toISOString()
  })
  console.log(`Meta salvo em ${CACHE_PATH}`)
}

main().catch(err => {
  console.error('Erro durante execução:', err)
  process.exit(1)
})

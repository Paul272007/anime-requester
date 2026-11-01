import axios from 'axios'

export const BASE_URL = 'https://api.tenrai.org/v1'

const GENRE_NAME_TO_ID = {
  action: 1,
  adventure: 2,
  aventure: 2,
  racing: 3,
  course: 3,
  comedy: 4,
  comedie: 4,
  'avant garde': 5,
  'avant-garde': 5,
  mythology: 6,
  mythologie: 6,
  mystery: 7,
  mystere: 7,
  drama: 8,
  drame: 8,
  ecchi: 9,
  fantasy: 10,
  fantaisie: 10,
  'strategy game': 11,
  hentai: 12,
  historical: 13,
  historique: 13,
  horror: 14,
  horreur: 14,
  kids: 15,
  enfants: 15,
  'martial arts': 17,
  'arts martiaux': 17,
  mecha: 18,
  music: 19,
  musique: 19,
  parody: 20,
  parodie: 20,
  samurai: 21,
  samourai: 21,
  romance: 22,
  school: 23,
  ecole: 23,
  'sci-fi': 24,
  scifi: 24,
  'science-fiction': 24,
  'science fiction': 24,
  shoujo: 25,
  shojo: 25,
  'girls love': 26,
  yuri: 26,
  shounen: 27,
  shonen: 27,
  'boys love': 28,
  yaoi: 28,
  space: 29,
  espace: 29,
  sports: 30,
  sport: 30,
  'super power': 31,
  'super pouvoir': 31,
  vampire: 32,
  harem: 35,
  'slice of life': 36,
  'tranche de vie': 36,
  supernatural: 37,
  surnaturel: 37,
  military: 38,
  militaire: 38,
  detective: 39,
  policier: 39,
  psychological: 40,
  psychologique: 40,
  suspense: 41,
  suspens: 41,
  thriller: 41,
  seinen: 42,
  josei: 43,
  'award winning': 46,
  gourmet: 47,
  cuisine: 47,
  workplace: 48,
  erotica: 49,
  'adult cast': 50,
  anthropomorphic: 51,
  cgdct: 52,
  childcare: 53,
  'combat sports': 54,
  delinquents: 55,
  educational: 56,
  'gag humor': 57,
  gore: 58,
  'high stakes game': 59,
  'idols (female)': 60,
  'idols (male)': 61,
  isekai: 62,
  iyashikei: 63,
  'love polygon': 64,
  'magical sex shift': 65,
  'mahou shoujo': 66,
  'magical girl': 66,
  medical: 67,
  'organized crime': 68,
  'otaku culture': 69,
  'performing arts': 70,
  pets: 71,
  reincarnation: 72,
  'reverse harem': 73,
  'love status quo': 74,
  showbiz: 75,
  survival: 76,
  survie: 76,
  'team sports': 77,
  'time travel': 78,
  'voyage temporel': 78,
  'video game': 79,
  'jeu video': 79,
  'visual arts': 80,
  crossdressing: 81,
  'urban fantasy': 82,
  villainess: 83,
}

function normalizeGenreKey(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export function resolveGenreIds(genresInput) {
  if (!genresInput) return ''

  const parts = String(genresInput)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  const ids = []
  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      ids.push(part)
      continue
    }
    const normalized = normalizeGenreKey(part)
    if (GENRE_NAME_TO_ID[normalized]) {
      ids.push(String(GENRE_NAME_TO_ID[normalized]))
    }
  }

  return [...new Set(ids)].join(',')
}

export function normalizeAnime(item) {
  if (!item || typeof item !== 'object') return item

  const image =
    item.image ||
    item.images?.jpg?.large_image_url ||
    item.images?.jpg?.image_url ||
    item.images?.webp?.large_image_url ||
    item.images?.webp?.image_url ||
    item.thumbnail ||
    item.thumb ||
    null

  const genresList = []
  for (const group of [item.genres, item.themes, item.demographics]) {
    if (Array.isArray(group)) {
      for (const g of group) {
        const name = typeof g === 'object' && g !== null ? g.name : g
        if (name && !genresList.includes(name)) {
          genresList.push(name)
        }
      }
    }
  }

  const genres =
    genresList.length > 0
      ? genresList
      : typeof item.genres === 'string'
        ? item.genres
        : []

  const ranking =
    item.ranking !== undefined && item.ranking !== null
      ? item.ranking
      : item.rank !== undefined && item.rank !== null
        ? item.rank
        : null

  const episodes =
    item.episodes !== undefined && item.episodes !== null
      ? item.episodes
      : item.episodesCount !== undefined && item.episodesCount !== null
        ? item.episodesCount
        : null

  const id = item.id ?? item.mal_id ?? item._id
  const _id =
    item._id ?? (id !== undefined && id !== null ? String(id) : undefined)

  return {
    ...item,
    id,
    _id,
    title: item.title || item.title_english || item.name || 'Titre inconnu',
    image,
    synopsis: item.synopsis ?? item.description ?? null,
    genres,
    ranking,
    episodes,
  }
}

function createApiClient() {
  return axios.create({
    baseURL: BASE_URL,
  })
}

export async function searchAnimes({
  search = '',
  genres = '',
  year = '',
  page = 1,
  size = 10,
  sortBy = 'ranking',
  sortOrder = 'asc',
} = {}) {
  const client = createApiClient()
  const params = {
    page,
    limit: size,
  }

  const trimmedSearch = String(search || '').trim()
  if (trimmedSearch) {
    params.q = trimmedSearch
  }

  const trimmedGenres = String(genres || '').trim()
  if (trimmedGenres) {
    const genreIds = resolveGenreIds(trimmedGenres)
    if (!genreIds) {
      return { data: [] }
    }
    params.genres = genreIds
  }

  if (year !== '' && year !== null && year !== undefined) {
    const parsedYear = parseInt(year, 10)
    if (!isNaN(parsedYear)) {
      params.year = parsedYear
    }
  }

  if (!trimmedSearch && sortBy) {
    params.order_by = sortBy === 'ranking' ? 'rank' : sortBy
    params.sort = sortOrder
  }

  const response = await client.get('/anime', { params })
  const payload = response.data
  if (Array.isArray(payload?.data)) {
    return {
      ...payload,
      data: payload.data.map(normalizeAnime),
    }
  }
  return payload
}

export async function getAnimeById(id) {
  const trimmedId = String(id ?? '').trim()
  if (!trimmedId) {
    throw new Error('Veuillez renseigner un identifiant.')
  }
  const client = createApiClient()
  const response = await client.get(`/anime/${encodeURIComponent(trimmedId)}`)
  const raw =
    response.data?.data !== undefined ? response.data.data : response.data
  return normalizeAnime(raw)
}

export async function getAnimeByRanking(ranking) {
  const rankNumber = parseInt(ranking, 10)
  if (isNaN(rankNumber) || rankNumber < 1) {
    throw new Error(
      'Veuillez renseigner un classement valide (nombre supérieur ou égal à 1).',
    )
  }
  const client = createApiClient()
  const response = await client.get('/anime', {
    params: {
      page: rankNumber,
      limit: 1,
      order_by: 'rank',
      sort: 'asc',
    },
  })
  const payload = response.data
  if (Array.isArray(payload?.data)) {
    return {
      ...payload,
      data: payload.data.map(normalizeAnime),
    }
  }
  return payload
}

export const animeService = {
  searchAnimes,
  getAnimeById,
  getAnimeByRanking,
}

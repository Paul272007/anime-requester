import axios from 'axios'
import { getApiKey } from './apiKeyStorage.js'

const BASE_URL = 'https://anime-db.p.rapidapi.com'
const API_HOST = 'anime-db.p.rapidapi.com'

/**
 * Crée une instance Axios configurée avec la clé API courante[cite: 1, 2]
 */
function createApiClient() {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('Clé API manquante. Veuillez saisir votre clé RapidAPI.')
  }

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'x-rapidapi-host': API_HOST,
      'x-rapidapi-key': apiKey,
    },
  })
}

/**
 * Recherche des animes selon un terme et/ou des filtres[cite: 1, 2, 3]
 * @param {Object} params
 * @param {string} [params.search] - Terme de recherche[cite: 2]
 * @param {string} [params.genres] - Genres séparés par des virgules[cite: 2]
 * @param {number} [params.page=1][cite: 2]
 * @param {number} [params.size=10][cite: 2, 3]
 * @param {string} [params.sortBy='ranking'][cite: 2]
 * @param {string} [params.sortOrder='asc'][cite: 2]
 */
export async function searchAnimes({
  search = '',
  genres = '',
  page = 1,
  size = 10,
  sortBy = 'ranking',
  sortOrder = 'asc',
} = {}) {
  const client = createApiClient()

  const response = await client.get('/anime', {
    params: {
      search,
      genres,
      page,
      size,
      sortBy,
      sortOrder,
    },
  })

  return response.data
}

import axios from 'axios'
import { getApiKey } from './apiKeyStorage.js'

const BASE_URL = 'https://anime-db.p.rapidapi.com'
const API_HOST = 'anime-db.p.rapidapi.com'

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

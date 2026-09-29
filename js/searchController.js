import { searchAnimes } from './animeApi.js'

export async function handleSearch(searchTerm, genres = '') {
  try {
    const data = await searchAnimes({
      search: searchTerm,
      genres: genres,
      size: 10,
    })

    return { success: true, results: data.data || data }
  } catch (error) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        'Une erreur est survenue lors de la recherche.',
    }
  }
}

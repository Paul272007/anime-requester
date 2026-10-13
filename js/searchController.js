import {
  animeService as defaultAnimeService,
  searchAnimes,
  getAnimeById,
  getAnimeByRanking,
} from './animeApi.js'
import { setApiKey } from './apiKeyStorage.js'
import {
  renderAnimeCards,
  renderErrorMessage,
  renderLoadingMessage,
  clearResults,
  resetSearchUI,
} from './cardRenderer.js'

export async function handleSearch(
  searchTerm,
  genresOrOptions = '',
  searchType = 'titre',
  api = defaultAnimeService,
) {
  let search
  let genres
  let type

  if (typeof searchTerm === 'object' && searchTerm !== null) {
    search = searchTerm.search || searchTerm.term || ''
    genres = searchTerm.genres || ''
    type = searchTerm.type || 'titre'
  } else if (typeof genresOrOptions === 'object' && genresOrOptions !== null) {
    search = searchTerm || ''
    genres = genresOrOptions.genres || ''
    type = genresOrOptions.type || searchType || 'titre'
  } else {
    search = searchTerm || ''
    genres = genresOrOptions || ''
    type = searchType || 'titre'
  }

  const normalizedType = String(type).toLowerCase().trim()
  const searchFn = api.searchAnimes || searchAnimes
  const getByIdFn = api.getAnimeById || getAnimeById
  const getByRankingFn = api.getAnimeByRanking || getAnimeByRanking

  try {
    let data
    if (normalizedType === 'id' || normalizedType === 'identifiant') {
      data = await getByIdFn(search)
    } else if (
      normalizedType === 'classement' ||
      normalizedType === 'ranking'
    ) {
      data = await getByRankingFn(search)
    } else if (normalizedType === 'genre') {
      data = await searchFn({
        genres: search || genres,
        size: 10,
      })
    } else {
      data = await searchFn({
        search,
        genres,
        size: 10,
      })
    }

    const rawResults = data?.data !== undefined ? data.data : data
    const results = Array.isArray(rawResults)
      ? rawResults
      : rawResults
        ? [rawResults]
        : []

    return {
      success: true,
      results,
    }
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

export function initFormEvents({
  formSelector = '#search-form',
  containerSelector = '#result-container',
  api = defaultAnimeService,
} = {}) {
  if (typeof document === 'undefined') return null

  const form =
    document.querySelector(formSelector) || document.querySelector('form')
  const resultContainer =
    document.querySelector(containerSelector) ||
    document.querySelector('.result-container') ||
    document.querySelector('#results') ||
    document.querySelector('.results-container')

  if (!form) return null

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    // Récupérer et stocker la clé API
    const apiKeyInput = document.querySelector('#api-key')
    if (apiKeyInput && apiKeyInput.value.trim()) {
      setApiKey(apiKeyInput.value.trim())
    }

    const typeSelect =
      form.querySelector('[name="type"]') ||
      document.querySelector('#search-type') ||
      document.querySelector('#type')
    const paramInput =
      form.querySelector('[name="parametre"]') ||
      document.querySelector('#parametre') ||
      document.querySelector('input[type="search"]')

    const searchType = typeSelect ? typeSelect.value : 'titre'
    const searchParam = paramInput ? paramInput.value.trim() : ''

    if (!searchParam) {
      if (resultContainer) {
        renderErrorMessage(
          resultContainer,
          'Veuillez renseigner un paramètre de recherche.',
        )
      }
      return
    }

    if (resultContainer) {
      renderLoadingMessage(resultContainer, 'Recherche en cours...')
    }

    const response = await handleSearch(searchParam, '', searchType, api)

    if (!resultContainer) return

    if (!response.success) {
      renderErrorMessage(resultContainer, response.error)
      return
    }

    renderAnimeCards(response.results, resultContainer, searchType)
  })

  form.addEventListener('reset', () => {
    if (resultContainer) {
      clearResults(resultContainer)
    }
  })

  const resetBtn = form.querySelector('button[type="reset"]')
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetSearchUI(form, resultContainer)
    })
  }

  return { form, resultContainer }
}

export { resetSearchUI }

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initFormEvents())
  } else {
    initFormEvents()
  }
}

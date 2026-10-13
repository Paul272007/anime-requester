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

export function initFormEvents() {
  const form = document.querySelector('form')
  const resultContainer =
    document.querySelector('#results') ||
    document.querySelector('.results-container')

  if (!form) return

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const typeSelect =
      form.querySelector('[name="type"]') || document.querySelector('#type')
    const paramInput =
      form.querySelector('[name="parametre"]') ||
      document.querySelector('input[type="search"]')

    const searchType = typeSelect ? typeSelect.value : ''
    const searchParam = paramInput ? paramInput.value : ''

    let searchTerm = ''
    let genres = ''

    if (searchType === 'titre') {
      searchTerm = searchParam
    } else if (searchType === 'genre') {
      genres = searchParam
    } else {
      searchTerm = searchParam
    }

    const response = await handleSearch(searchTerm, genres)
    console.log('Résultats de la recherche :', response)
  })

  form.addEventListener('reset', () => {
    if (resultContainer) {
      resultContainer.innerHTML = ''
    }
  })
}

document.addEventListener('DOMContentLoaded', initFormEvents)

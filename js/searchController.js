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

// --- Ajout pour la gestion des événements du formulaire ---

export function initFormEvents() {
  const form = document.querySelector('form')
  // a modifier si besoin selon les id du fichier html Nathan
  const resultContainer =
    document.querySelector('#results') ||
    document.querySelector('.results-container')

  if (!form) return

  // 1. Intercepter la soumission du bouton de recherche
  form.addEventListener('submit', async (event) => {
    // Sans rechargement de la page
    event.preventDefault()

    // 2. Récupérer les valeurs saisies (type de recherche et paramètre)
    // On utilise form.elements ou querySelector pour récupérer les inputs
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

    // Transmettre les valeurs au module API via handleSearch
    const response = await handleSearch(searchTerm, genres)
    console.log('Résultats de la recherche :', response)
  })

  // 3. Intercepter le clic sur le bouton de réinitialisation
  // L'événement 'reset' se déclenche quand on clique sur un <button type="reset">
  form.addEventListener('reset', () => {
    // 4. Vider le conteneur HTML des cartes de résultats
    if (resultContainer) {
      resultContainer.innerHTML = ''
    }
  })
}

// Activer les événements une fois que la page est chargée
document.addEventListener('DOMContentLoaded', initFormEvents)

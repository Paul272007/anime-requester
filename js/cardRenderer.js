export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F200%22%20viewBox%3D%220%200%20200%20300%22%3E%3Crect%20fill%3D%22%232c3e50%22%20width%3D%22200%22%20height%3D%22300%22%2F%3E%3Ctext%20fill%3D%22%23ecf0f1%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20x%3D%22100%22%20y%3D%22150%22%3EImage%20non%20disponible%3C%2Ftext%3E%3C%2Fsvg%3E'

export function createAnimeCard(anime = {}) {
  const card = document.createElement('article')
  card.className = 'anime-card'

  const title = document.createElement('h2')
  title.className = 'anime-title'
  title.textContent = anime.title || anime.name || 'Titre inconnu'
  card.appendChild(title)

  const imageContainer = document.createElement('div')
  imageContainer.className = 'anime-image-container'
  const img = document.createElement('img')
  img.className = 'anime-image'
  const rawImage = anime.image || anime.thumbnail || anime.thumb
  img.src = rawImage || PLACEHOLDER_IMAGE
  img.alt = anime.title ? `Affiche de ${anime.title}` : 'Affiche anime'
  img.loading = 'lazy'
  img.addEventListener('error', () => {
    img.src = PLACEHOLDER_IMAGE
  })
  imageContainer.appendChild(img)
  card.appendChild(imageContainer)

  const synopsis = document.createElement('p')
  synopsis.className = 'anime-synopsis'
  const synopsisLabel = document.createElement('strong')
  synopsisLabel.textContent = 'Synopsis : '
  const synopsisText = document.createElement('span')
  synopsisText.textContent =
    anime.synopsis || anime.description || 'Aucun synopsis disponible.'
  synopsis.appendChild(synopsisLabel)
  synopsis.appendChild(synopsisText)
  card.appendChild(synopsis)

  const genres = document.createElement('p')
  genres.className = 'anime-genres'
  const genresLabel = document.createElement('strong')
  genresLabel.textContent = 'Genres : '
  const genresText = document.createElement('span')
  if (Array.isArray(anime.genres) && anime.genres.length > 0) {
    genresText.textContent = anime.genres.join(', ')
  } else if (
    typeof anime.genres === 'string' &&
    anime.genres.trim().length > 0
  ) {
    genresText.textContent = anime.genres.trim()
  } else {
    genresText.textContent = 'N/A'
  }
  genres.appendChild(genresLabel)
  genres.appendChild(genresText)
  card.appendChild(genres)

  const ranking = document.createElement('p')
  ranking.className = 'anime-ranking'
  const rankingLabel = document.createElement('strong')
  rankingLabel.textContent = 'Classement : '
  const rankingText = document.createElement('span')
  if (anime.ranking !== undefined && anime.ranking !== null) {
    rankingText.textContent = `#${anime.ranking}`
  } else if (anime.rank !== undefined && anime.rank !== null) {
    rankingText.textContent = `#${anime.rank}`
  } else {
    rankingText.textContent = 'Non classé'
  }
  ranking.appendChild(rankingLabel)
  ranking.appendChild(rankingText)
  card.appendChild(ranking)

  const episodes = document.createElement('p')
  episodes.className = 'anime-episodes'
  const episodesLabel = document.createElement('strong')
  episodesLabel.textContent = "Nombre d'épisodes : "
  const episodesText = document.createElement('span')
  if (anime.episodes !== undefined && anime.episodes !== null) {
    episodesText.textContent = String(anime.episodes)
  } else if (
    anime.episodesCount !== undefined &&
    anime.episodesCount !== null
  ) {
    episodesText.textContent = String(anime.episodesCount)
  } else {
    episodesText.textContent = 'Inconnu'
  }
  episodes.appendChild(episodesLabel)
  episodes.appendChild(episodesText)
  card.appendChild(episodes)

  return card
}

export function limitResults(results, searchType = 'titre') {
  if (!results) {
    return []
  }

  const list = Array.isArray(results) ? results : [results]
  const normalizedType = String(searchType).toLowerCase().trim()
  const isSingleResultType =
    normalizedType === 'id' ||
    normalizedType === 'identifiant' ||
    normalizedType === 'classement' ||
    normalizedType === 'ranking'

  if (isSingleResultType) {
    return list.slice(0, 1)
  }

  return list.slice(0, 10)
}

export function renderAnimeCards(results, container, searchType = 'titre') {
  if (!container) return []

  container.innerHTML = ''
  const items = limitResults(results, searchType)

  if (items.length === 0) {
    const emptyMsg = document.createElement('p')
    emptyMsg.className = 'no-results'
    emptyMsg.textContent = 'Aucun anime trouvé.'
    container.appendChild(emptyMsg)
    return []
  }

  return items.map((anime) => {
    const card = createAnimeCard(anime)
    container.appendChild(card)
    return card
  })
}

export function renderErrorMessage(container, message) {
  if (!container) return
  container.innerHTML = ''
  const errorEl = document.createElement('p')
  errorEl.className = 'error-message'
  errorEl.setAttribute('role', 'alert')
  errorEl.textContent = message
  container.appendChild(errorEl)
}

export function renderLoadingMessage(
  container,
  message = 'Recherche en cours...',
) {
  if (!container) return
  container.innerHTML = ''
  const loadingEl = document.createElement('p')
  loadingEl.className = 'loading-state'
  loadingEl.textContent = message
  container.appendChild(loadingEl)
}

export function clearResults(container) {
  if (container) {
    container.innerHTML = ''
  }
}

export function resetSearchUI(form, container) {
  if (form) {
    form.reset()
  }
  clearResults(container)
}

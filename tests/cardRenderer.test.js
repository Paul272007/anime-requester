import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import {
  createAnimeCard,
  limitResults,
  renderAnimeCards,
  renderErrorMessage,
  renderLoadingMessage,
  clearResults,
  resetSearchUI,
  PLACEHOLDER_IMAGE,
} from '../js/cardRenderer.js'

describe('cardRenderer', () => {
  let dom
  let testDocument
  let container

  beforeEach(() => {
    dom = new JSDOM(
      '<!doctype html><html><body><div id="container"></div></body></html>',
    )
    testDocument = dom.window.document
    container = testDocument.getElementById('container')
    global.window = dom.window
    global.document = testDocument
    global.HTMLElement = dom.window.HTMLElement
  })

  describe('createAnimeCard', () => {
    it('doit générer une carte affichant titre, image, synopsis, genres, classement et nb épisodes', () => {
      const anime = {
        title: 'Cowboy Bebop',
        image: 'https://example.com/bebop.jpg',
        synopsis: 'Chasseurs de prime dans lespace.',
        genres: ['Action', 'Sci-Fi'],
        ranking: 28,
        episodes: 26,
      }

      const card = createAnimeCard(anime)

      assert.strictEqual(card.tagName.toLowerCase(), 'article')
      assert.ok(card.classList.contains('anime-card'))

      const titleEl = card.querySelector('.anime-title')
      assert.ok(titleEl)
      assert.strictEqual(titleEl.textContent, 'Cowboy Bebop')

      const imgEl = card.querySelector('.anime-image')
      assert.ok(imgEl)
      assert.strictEqual(imgEl.src, 'https://example.com/bebop.jpg')
      assert.strictEqual(imgEl.alt, 'Affiche de Cowboy Bebop')

      const synopsisEl = card.querySelector('.anime-synopsis')
      assert.ok(synopsisEl)
      assert.ok(synopsisEl.textContent.includes('Chasseurs de prime'))

      const genresEl = card.querySelector('.anime-genres')
      assert.ok(genresEl)
      assert.ok(genresEl.textContent.includes('Action, Sci-Fi'))

      const rankingEl = card.querySelector('.anime-ranking')
      assert.ok(rankingEl)
      assert.ok(rankingEl.textContent.includes('#28'))

      const episodesEl = card.querySelector('.anime-episodes')
      assert.ok(episodesEl)
      assert.ok(episodesEl.textContent.includes('26'))
    })

    it('doit gérer les données manquantes avec des valeurs par défaut élégantes', () => {
      const emptyAnime = {}
      const card = createAnimeCard(emptyAnime)

      const titleEl = card.querySelector('.anime-title')
      assert.strictEqual(titleEl.textContent, 'Titre inconnu')

      const imgEl = card.querySelector('.anime-image')
      assert.strictEqual(imgEl.src, PLACEHOLDER_IMAGE)

      const synopsisEl = card.querySelector('.anime-synopsis')
      assert.ok(synopsisEl.textContent.includes('Aucun synopsis disponible.'))

      const genresEl = card.querySelector('.anime-genres')
      assert.ok(genresEl.textContent.includes('N/A'))

      const rankingEl = card.querySelector('.anime-ranking')
      assert.ok(rankingEl.textContent.includes('Non classé'))

      const episodesEl = card.querySelector('.anime-episodes')
      assert.ok(episodesEl.textContent.includes('Inconnu'))
    })
  })

  describe('limitResults (affichage conditionnel)', () => {
    const fakeList = Array.from({ length: 15 }, (_, i) => ({
      title: `Anime ${i + 1}`,
      ranking: i + 1,
    }))

    it('doit limiter à 10 résultats au maximum pour une recherche classique (titre)', () => {
      const results = limitResults(fakeList, 'titre')
      assert.strictEqual(results.length, 10)
      assert.strictEqual(results[0].title, 'Anime 1')
      assert.strictEqual(results[9].title, 'Anime 10')
    })

    it('doit limiter à 10 résultats pour le type genre ou tout autre type classique', () => {
      const genreResults = limitResults(fakeList, 'genre')
      assert.strictEqual(genreResults.length, 10)

      const auteurResults = limitResults(fakeList, 'auteur')
      assert.strictEqual(auteurResults.length, 10)
    })

    it('doit retourner un seul et unique résultat pour une recherche par id', () => {
      const results = limitResults(fakeList, 'id')
      assert.strictEqual(results.length, 1)
      assert.strictEqual(results[0].title, 'Anime 1')
    })

    it('doit retourner un seul et unique résultat pour une recherche par classement', () => {
      const results = limitResults(fakeList, 'classement')
      assert.strictEqual(results.length, 1)
      assert.strictEqual(results[0].title, 'Anime 1')
    })

    it('doit supporter "identifiant" et "ranking" comme alias', () => {
      const byId = limitResults(fakeList, 'identifiant')
      assert.strictEqual(byId.length, 1)

      const byRanking = limitResults(fakeList, 'ranking')
      assert.strictEqual(byRanking.length, 1)
    })

    it('doit convertir un objet unique en tableau dun élément', () => {
      const singleItem = { title: 'One Piece' }
      const results = limitResults(singleItem, 'id')
      assert.strictEqual(results.length, 1)
      assert.strictEqual(results[0].title, 'One Piece')
    })

    it('doit renvoyer un tableau vide si les résultats sont vides ou nuls', () => {
      assert.deepStrictEqual(limitResults(null), [])
      assert.deepStrictEqual(limitResults([]), [])
    })
  })

  describe('renderAnimeCards', () => {
    it('doit rendre dynamiquement les cartes dans le conteneur DOM', () => {
      const animes = [
        { title: 'Naruto', ranking: 1, episodes: 220 },
        { title: 'Bleach', ranking: 2, episodes: 366 },
      ]

      const renderedCards = renderAnimeCards(animes, container, 'titre')
      assert.strictEqual(renderedCards.length, 2)
      assert.strictEqual(container.children.length, 2)
      assert.strictEqual(
        container.querySelector('.anime-title').textContent,
        'Naruto',
      )
    })

    it('doit écraser le contenu précédent du conteneur', () => {
      container.innerHTML = '<p>Ancien contenu</p>'
      renderAnimeCards([{ title: 'Death Note' }], container, 'titre')

      assert.strictEqual(container.children.length, 1)
      assert.ok(!container.textContent.includes('Ancien contenu'))
    })

    it('doit afficher un message "Aucun anime trouvé." si la liste est vide', () => {
      renderAnimeCards([], container, 'titre')
      assert.strictEqual(container.children.length, 1)
      assert.strictEqual(
        container.querySelector('.no-results').textContent,
        'Aucun anime trouvé.',
      )
    })
  })

  describe('Messages et Réinitialisation', () => {
    it('doit afficher un message derreur avec role alert', () => {
      renderErrorMessage(container, 'Erreur de test')
      const errorEl = container.querySelector('.error-message')
      assert.ok(errorEl)
      assert.strictEqual(errorEl.getAttribute('role'), 'alert')
      assert.strictEqual(errorEl.textContent, 'Erreur de test')
    })

    it('doit afficher un message de chargement', () => {
      renderLoadingMessage(container, 'Chargement...')
      const loadingEl = container.querySelector('.loading-state')
      assert.ok(loadingEl)
      assert.strictEqual(loadingEl.textContent, 'Chargement...')
    })

    it('doit vider le conteneur avec clearResults', () => {
      container.innerHTML = '<div>cartes</div>'
      clearResults(container)
      assert.strictEqual(container.innerHTML, '')
    })

    it('doit réinitialiser le formulaire et vider le conteneur avec resetSearchUI', () => {
      const form = testDocument.createElement('form')
      const input = testDocument.createElement('input')
      input.value = 'recherche'
      form.appendChild(input)

      container.innerHTML = '<div>resultats</div>'
      resetSearchUI(form, container)

      assert.strictEqual(container.innerHTML, '')
    })
  })
})

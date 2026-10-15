import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { handleSearch, initFormEvents } from '../js/searchController.js'

describe('searchController', () => {
  let dom
  let testDocument
  let form
  let container

  beforeEach(() => {
    dom = new JSDOM(`
      <!doctype html>
      <html>
        <body>
          <form id="search-form">
            <select name="type" id="search-type">
              <option value="titre">Recherche par titre</option>
              <option value="id">Recherche par identifiant</option>
              <option value="classement">Recherche par classement</option>
              <option value="genre">Recherche par genre</option>
            </select>
            <input id="parametre" name="parametre" type="search" value="" />
            <button type="submit">Rechercher</button>
            <button type="reset">Effacer</button>
          </form>
          <section id="result-container" class="result-container"></section>
        </body>
      </html>
    `)

    testDocument = dom.window.document
    global.window = dom.window
    global.document = testDocument
    global.HTMLElement = dom.window.HTMLElement

    form = testDocument.getElementById('search-form')
    container = testDocument.getElementById('result-container')
  })

  describe('handleSearch', () => {
    it('doit appeler searchAnimes avec les bons paramètres pour une recherche classique', async () => {
      let calledWith = null
      const mockApi = {
        searchAnimes: async (params) => {
          calledWith = params
          return { data: [{ title: 'Naruto', ranking: 1 }] }
        },
      }

      const response = await handleSearch('Naruto', '', 'titre', mockApi)
      assert.strictEqual(response.success, true)
      assert.deepStrictEqual(calledWith, {
        search: 'Naruto',
        genres: '',
        size: 10,
      })
      assert.strictEqual(response.results.length, 1)
      assert.strictEqual(response.results[0].title, 'Naruto')
    })

    it('doit appeler getAnimeById pour une recherche par identifiant', async () => {
      let idCalled = null
      const mockApi = {
        getAnimeById: async (id) => {
          idCalled = id
          return { _id: '12345', title: 'One Piece' }
        },
      }

      const response = await handleSearch('12345', '', 'id', mockApi)
      assert.strictEqual(response.success, true)
      assert.strictEqual(idCalled, '12345')
      assert.strictEqual(response.results.length, 1)
      assert.strictEqual(response.results[0].title, 'One Piece')
    })

    it('doit appeler getAnimeByRanking pour une recherche par classement', async () => {
      let rankingCalled = null
      const mockApi = {
        getAnimeByRanking: async (ranking) => {
          rankingCalled = ranking
          return { data: [{ title: 'FMA Brotherhood', ranking: 1 }] }
        },
      }

      const response = await handleSearch('1', '', 'classement', mockApi)
      assert.strictEqual(response.success, true)
      assert.strictEqual(rankingCalled, '1')
      assert.strictEqual(response.results.length, 1)
      assert.strictEqual(response.results[0].title, 'FMA Brotherhood')
    })

    it('doit rechercher les œuvres associées pour un auteur', async () => {
      let calledWith = null
      const mockApi = {
        searchAnimes: async (params) => {
          calledWith = params
          return { data: [{ title: 'One Piece', id: '1' }] }
        },
      }

      const response = await handleSearch('Oda', '', 'auteur', mockApi)
      assert.strictEqual(response.success, true)
      assert.strictEqual(calledWith.search, 'One Piece')
      assert.strictEqual(response.results[0].title, 'One Piece')
    })

    it('doit gérer les erreurs API gracieusement', async () => {
      const mockApi = {
        searchAnimes: async () => {
          throw new Error('Erreur réseau simulateur')
        },
      }

      const response = await handleSearch('Erreur', '', 'titre', mockApi)
      assert.strictEqual(response.success, false)
      assert.strictEqual(response.error, 'Erreur réseau simulateur')
    })
  })

  describe('initFormEvents', () => {
    it('doit afficher un message d’erreur si le champ de recherche est vide', async () => {
      initFormEvents({
        formSelector: '#search-form',
        containerSelector: '#result-container',
      })

      const submitEvent = new dom.window.Event('submit', { cancelable: true })
      form.dispatchEvent(submitEvent)

      assert.ok(
        container.textContent.includes(
          'Veuillez renseigner un paramètre de recherche.',
        ),
      )
    })

    it('doit exécuter la recherche et afficher les cartes lors de la soumission valide', async () => {
      const mockApi = {
        searchAnimes: async () => ({
          data: [
            {
              title: 'Hunter x Hunter',
              ranking: 3,
              episodes: 148,
              synopsis: 'Aventures de Gon',
              genres: ['Action', 'Adventure'],
            },
          ],
        }),
      }

      initFormEvents({
        formSelector: '#search-form',
        containerSelector: '#result-container',
        api: mockApi,
      })

      const input = form.querySelector('#parametre')
      input.value = 'Hunter'

      const submitEvent = new dom.window.Event('submit', { cancelable: true })
      form.dispatchEvent(submitEvent)

      await new Promise((resolve) => setTimeout(resolve, 50))

      const cards = container.querySelectorAll('.anime-card')
      assert.strictEqual(cards.length, 1)
      assert.strictEqual(
        cards[0].querySelector('.anime-title').textContent,
        'Hunter x Hunter',
      )
    })

    it('doit vider le conteneur lors du déclenchement de l’événement reset', () => {
      container.innerHTML = '<div class="anime-card">Carte test</div>'

      initFormEvents({
        formSelector: '#search-form',
        containerSelector: '#result-container',
      })

      const resetEvent = new dom.window.Event('reset', { cancelable: true })
      form.dispatchEvent(resetEvent)

      assert.strictEqual(container.innerHTML, '')
    })

    it('doit vider le conteneur lors du clic sur le bouton de réinitialisation', () => {
      container.innerHTML = '<div class="anime-card">Carte test</div>'

      initFormEvents({
        formSelector: '#search-form',
        containerSelector: '#result-container',
      })

      const resetBtn = form.querySelector('button[type="reset"]')
      const clickEvent = new dom.window.Event('click', { cancelable: true })
      resetBtn.dispatchEvent(clickEvent)

      assert.strictEqual(container.innerHTML, '')
    })
  })
})

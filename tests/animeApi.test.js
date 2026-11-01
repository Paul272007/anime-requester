import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  BASE_URL,
  resolveGenreIds,
  normalizeAnime,
  getAnimeById,
  getAnimeByRanking,
} from '../js/animeApi.js'

describe('animeApi (Tenrai API v1)', () => {
  it('doit pointer vers https://api.tenrai.org/v1', () => {
    assert.strictEqual(BASE_URL, 'https://api.tenrai.org/v1')
  })

  describe('resolveGenreIds', () => {
    it('doit convertir les noms de genres anglais et français en identifiants MAL', () => {
      assert.strictEqual(resolveGenreIds('Action'), '1')
      assert.strictEqual(resolveGenreIds('action'), '1')
      assert.strictEqual(resolveGenreIds('Aventure'), '2')
      assert.strictEqual(resolveGenreIds('Comédie'), '4')
      assert.strictEqual(resolveGenreIds('Sci-Fi'), '24')
      assert.strictEqual(resolveGenreIds('Action, Adventure'), '1,2')
      assert.strictEqual(resolveGenreIds('10'), '10')
    })

    it('doit renvoyer une chaîne vide pour un genre inconnu', () => {
      assert.strictEqual(resolveGenreIds('GenreInexistant999'), '')
      assert.strictEqual(resolveGenreIds(''), '')
    })
  })

  describe('normalizeAnime', () => {
    it('doit normaliser un objet anime au format Tenrai / Jikan v4', () => {
      const rawTenraiAnime = {
        mal_id: 1,
        title: 'Cowboy Bebop',
        images: {
          jpg: {
            image_url: 'https://cdn.myanimelist.net/images/anime/4/19644.jpg',
            large_image_url:
              'https://cdn.myanimelist.net/images/anime/4/19644l.jpg',
          },
        },
        synopsis: 'Crime is timeless.',
        genres: [
          { mal_id: 1, name: 'Action' },
          { mal_id: 24, name: 'Sci-Fi' },
        ],
        themes: [{ mal_id: 29, name: 'Space' }],
        rank: 51,
        episodes: 26,
      }

      const normalized = normalizeAnime(rawTenraiAnime)
      assert.strictEqual(normalized.id, 1)
      assert.strictEqual(normalized._id, '1')
      assert.strictEqual(normalized.title, 'Cowboy Bebop')
      assert.strictEqual(
        normalized.image,
        'https://cdn.myanimelist.net/images/anime/4/19644l.jpg',
      )
      assert.strictEqual(normalized.ranking, 51)
      assert.strictEqual(normalized.episodes, 26)
      assert.deepStrictEqual(normalized.genres, ['Action', 'Sci-Fi', 'Space'])
    })
  })

  describe('Validation des paramètres', () => {
    it('doit rejeter getAnimeById si aucun identifiant nest fourni', async () => {
      await assert.rejects(
        () => getAnimeById(''),
        /Veuillez renseigner un identifiant/,
      )
    })

    it('doit rejeter getAnimeByRanking si le classement est invalide', async () => {
      await assert.rejects(
        () => getAnimeByRanking('0'),
        /Veuillez renseigner un classement valide/,
      )
      await assert.rejects(
        () => getAnimeByRanking('abc'),
        /Veuillez renseigner un classement valide/,
      )
    })
  })
})

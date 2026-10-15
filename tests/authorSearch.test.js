import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { getWorksByAuthor, searchByAuthor } from '../js/authorSearch.js'

describe('authorSearch', () => {
  describe('getWorksByAuthor', () => {
    it('doit trouver les œuvres associées pour les auteurs connus', () => {
      assert.deepStrictEqual(getWorksByAuthor('Oda'), ['One Piece'])
      assert.deepStrictEqual(getWorksByAuthor('Eiichiro Oda'), ['One Piece'])
      assert.deepStrictEqual(getWorksByAuthor('Kishimoto'), [
        'Naruto',
        'Boruto',
      ])
      assert.deepStrictEqual(getWorksByAuthor('Toriyama'), [
        'Dragon Ball',
        'Dr. Slump',
        'Sand Land',
      ])
      assert.deepStrictEqual(getWorksByAuthor('Isayama'), [
        'Attack on Titan',
        'Shingeki no Kyojin',
      ])
      assert.deepStrictEqual(getWorksByAuthor('Tite Kubo'), [
        'Bleach',
        'Burn the Witch',
      ])
    })

    it('doit renvoyer null si l’auteur n’est pas répertorié ou entrée invalide', () => {
      assert.strictEqual(getWorksByAuthor('InconnuTotal999'), null)
      assert.strictEqual(getWorksByAuthor(''), null)
      assert.strictEqual(getWorksByAuthor(null), null)
    })
  })

  describe('searchByAuthor', () => {
    it('doit requêter les œuvres de l’auteur connu', async () => {
      const queried = []
      const mockSearchFn = async (params) => {
        queried.push(params.search)
        return { data: [{ title: params.search, id: params.search }] }
      }

      const result = await searchByAuthor('Oda', mockSearchFn)
      assert.deepStrictEqual(queried, ['One Piece'])
      assert.strictEqual(result.data.length, 1)
      assert.strictEqual(result.data[0].title, 'One Piece')
    })

    it('doit se rabattre sur une recherche classique si l’auteur est inconnu', async () => {
      let fallbackQuery = null
      const mockSearchFn = async (params) => {
        fallbackQuery = params.search
        return { data: [] }
      }

      await searchByAuthor('AuteurInexistant', mockSearchFn)
      assert.strictEqual(fallbackQuery, 'AuteurInexistant')
    })
  })
})

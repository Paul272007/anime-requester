import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import {
  getApiKey,
  setApiKey,
  clearApiKey,
  hasCustomApiKey,
  DEFAULT_API_KEY,
} from '../js/apiKeyStorage.js'

describe('apiKeyStorage', () => {
  beforeEach(() => {
    const dom = new JSDOM('', { url: 'http://localhost' })
    global.window = dom.window
    global.sessionStorage = dom.window.sessionStorage
    sessionStorage.clear()
  })

  it('doit renvoyer DEFAULT_API_KEY par défaut quand aucun stockage n’existe', () => {
    assert.strictEqual(getApiKey(), DEFAULT_API_KEY)
    assert.strictEqual(hasCustomApiKey(), false)
  })

  it('doit enregistrer une clé utilisateur et la récupérer', () => {
    setApiKey('  ma-cle-test-123  ')
    assert.strictEqual(getApiKey(), 'ma-cle-test-123')
    assert.strictEqual(hasCustomApiKey(), true)
  })

  it('doit supprimer la clé personnalisée avec clearApiKey et revenir à la valeur par défaut', () => {
    setApiKey('ma-cle-test')
    clearApiKey()
    assert.strictEqual(getApiKey(), DEFAULT_API_KEY)
    assert.strictEqual(hasCustomApiKey(), false)
  })

  it('doit effacer la clé si setApiKey est appelée avec une chaîne vide', () => {
    setApiKey('ma-cle-test')
    setApiKey('   ')
    assert.strictEqual(getApiKey(), DEFAULT_API_KEY)
    assert.strictEqual(hasCustomApiKey(), false)
  })
})

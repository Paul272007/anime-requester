import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import {
  THEME_STORAGE_KEY,
  getStoredTheme,
  setStoredTheme,
  applyTheme,
  toggleTheme,
  initThemeToggle,
} from '../js/themeStorage.js'

describe('themeStorage', () => {
  let dom

  beforeEach(() => {
    dom = new JSDOM(
      `<!doctype html><html lang="fr"><head></head><body><header><button type="button" id="theme-toggle">🌙</button></header></body></html>`,
      { url: 'http://localhost' },
    )
    global.window = dom.window
    global.document = dom.window.document
    global.sessionStorage = dom.window.sessionStorage
    sessionStorage.clear()
  })

  it('doit renvoyer null par défaut si aucun thème nest stocké', () => {
    assert.strictEqual(getStoredTheme(), null)
  })

  it('doit sauvegarder et récupérer le thème dans sessionStorage', () => {
    setStoredTheme('dark')
    assert.strictEqual(sessionStorage.getItem(THEME_STORAGE_KEY), 'dark')
    assert.strictEqual(getStoredTheme(), 'dark')
  })

  it('doit appliquer data-theme sur documentElement et mettre à jour le bouton', () => {
    const btn = document.querySelector('#theme-toggle')
    applyTheme('dark', btn)
    assert.strictEqual(
      document.documentElement.getAttribute('data-theme'),
      'dark',
    )
    assert.strictEqual(btn.getAttribute('aria-pressed'), 'true')
    assert.strictEqual(btn.textContent, '☀️')
  })

  it('doit basculer entre light et dark et persister dans sessionStorage', () => {
    const btn = document.querySelector('#theme-toggle')
    applyTheme('light', btn)
    const next = toggleTheme(btn)
    assert.strictEqual(next, 'dark')
    assert.strictEqual(getStoredTheme(), 'dark')
    assert.strictEqual(
      document.documentElement.getAttribute('data-theme'),
      'dark',
    )

    const back = toggleTheme(btn)
    assert.strictEqual(back, 'light')
    assert.strictEqual(getStoredTheme(), 'light')
  })

  it('doit restaurer le thème depuis sessionStorage lors de initThemeToggle', () => {
    setStoredTheme('dark')
    const btn = initThemeToggle('#theme-toggle')
    assert.strictEqual(
      document.documentElement.getAttribute('data-theme'),
      'dark',
    )
    assert.strictEqual(btn.getAttribute('aria-pressed'), 'true')

    btn.click()
    assert.strictEqual(
      document.documentElement.getAttribute('data-theme'),
      'light',
    )
    assert.strictEqual(getStoredTheme(), 'light')
  })
})

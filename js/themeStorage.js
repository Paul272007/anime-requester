export const THEME_STORAGE_KEY = 'theme'

export function getStoredTheme() {
  if (typeof sessionStorage === 'undefined') {
    return null
  }
  const saved = sessionStorage.getItem(THEME_STORAGE_KEY)
  return saved === 'dark' || saved === 'light' ? saved : null
}

export function setStoredTheme(theme) {
  if (typeof sessionStorage === 'undefined') {
    return
  }
  if (theme === 'dark' || theme === 'light') {
    sessionStorage.setItem(THEME_STORAGE_KEY, theme)
  } else {
    sessionStorage.removeItem(THEME_STORAGE_KEY)
  }
}

export function getActiveTheme() {
  const stored = getStoredTheme()
  if (stored) {
    return stored
  }
  if (typeof document !== 'undefined' && document.documentElement) {
    const attr = document.documentElement.getAttribute('data-theme')
    if (attr === 'dark' || attr === 'light') {
      return attr
    }
  }
  if (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark'
  }
  return 'light'
}

export function applyTheme(theme, button = null) {
  const normalized = theme === 'dark' ? 'dark' : 'light'
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-theme', normalized)
  }
  const toggleBtn =
    button ||
    (typeof document !== 'undefined'
      ? document.querySelector('#theme-toggle')
      : null)
  if (toggleBtn) {
    const isDark = normalized === 'dark'
    toggleBtn.setAttribute('aria-pressed', String(isDark))
    toggleBtn.setAttribute(
      'aria-label',
      isDark ? 'Activer le thème clair' : 'Activer le thème sombre',
    )
    toggleBtn.textContent = isDark ? '☀️' : '🌙'
  }
  return normalized
}

export function toggleTheme(button = null) {
  const nextTheme = getActiveTheme() === 'dark' ? 'light' : 'dark'
  setStoredTheme(nextTheme)
  return applyTheme(nextTheme, button)
}

export function initThemeToggle(buttonSelector = '#theme-toggle') {
  if (typeof document === 'undefined') {
    return null
  }
  const button = document.querySelector(buttonSelector)
  const initialTheme = getStoredTheme() || getActiveTheme()
  applyTheme(initialTheme, button)

  if (button && !button.dataset.themeInitialized) {
    button.dataset.themeInitialized = 'true'
    button.addEventListener('click', () => {
      toggleTheme(button)
    })
  }
  return button
}

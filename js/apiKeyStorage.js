const API_KEY_KEY = 'rapidapi_key'

export const DEFAULT_API_KEY =
  '1b1a0436a1msha186e54dce16fc1p1db969jsndb5f73d434e6'

export function getApiKey() {
  const userKey = sessionStorage.getItem(API_KEY_KEY)
  if (userKey && userKey.trim()) {
    return userKey.trim()
  }
  return DEFAULT_API_KEY
}

export function setApiKey(key) {
  if (key && key.trim()) {
    sessionStorage.setItem(API_KEY_KEY, key.trim())
  } else {
    clearApiKey()
  }
}

export function clearApiKey() {
  sessionStorage.removeItem(API_KEY_KEY)
}

export function hasCustomApiKey() {
  const userKey = sessionStorage.getItem(API_KEY_KEY)
  return Boolean(userKey && userKey.trim())
}

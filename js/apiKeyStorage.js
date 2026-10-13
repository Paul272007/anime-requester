const API_KEY_KEY = 'rapidapi_key'

export function getApiKey() {
  return sessionStorage.getItem(API_KEY_KEY) || ''
}

export function setApiKey(key) {
  sessionStorage.setItem(API_KEY_KEY, key.trim())
}

export function clearApiKey() {
  sessionStorage.removeItem(API_KEY_KEY)
}

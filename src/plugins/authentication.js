/**
 * Authentication Plugin — Low-level localStorage helpers
 *
 * This module provides direct read/write access to auth data in localStorage.
 * It does NOT manage reactive state — that's handled by:
 *   - The Vuex auth module (for Vuex-connected components)
 *   - The useAuth composable (for Composition API components)
 *
 * All functions include try/catch to handle corrupted localStorage gracefully.
 *
 * @module plugins/authentication
 */

// ─── Storage Keys ──────────────────────────────────────────────────────────
const TOKEN_KEY = 'token'
const USER_KEY = 'user'

// ─── Token Helpers ─────────────────────────────────────────────────────────

/**
 * Retrieve the full token object from localStorage.
 *
 * @returns {Object|null} Parsed token object or null if not found / corrupted
 *   Shape: { access_token: string, token_type: string, expires_at: string }
 */
export function getToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error('[auth plugin] Failed to parse token from localStorage:', error)
    return null
  }
}

/**
 * Persist a token object to localStorage.
 *
 * @param {Object} token - The token object to store
 * @param {string} token.access_token - The JWT or opaque access token
 * @param {string} [token.token_type='Bearer'] - Token type
 * @param {string} [token.expires_at] - ISO 8601 expiration timestamp
 */
export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
  } catch (error) {
    console.error('[auth plugin] Failed to store token:', error)
  }
}

/**
 * Build the Authorization header string from the stored token.
 * Returns false if no token exists so callers can gate on it.
 *
 * @returns {string|boolean} "Bearer eyJh..." or false if no token
 */
export function getAuthorization() {
  const token = getToken()
  if (!token?.access_token) return false
  const type = token.token_type || 'Bearer'
  return `${type} ${token.access_token}`
}

/**
 * Get just the raw access_token string.
 *
 * @returns {string} The access token, or empty string if not present
 */
export function getAccessToken() {
  const token = getToken()
  return token?.access_token || ''
}

/**
 * Get the token type (e.g., "Bearer").
 *
 * @returns {string} The token type, or empty string if not present
 */
export function getAccessTokenType() {
  const token = getToken()
  return token?.token_type || ''
}

/**
 * Get the token expiration timestamp.
 *
 * @returns {string|null} ISO 8601 expiration, or null if not present
 */
export function getExpiresAt() {
  const token = getToken()
  return token?.expires_at || null
}

// ─── User Helpers ──────────────────────────────────────────────────────────

/**
 * Retrieve the stored user object.
 *
 * @returns {Object|null} Parsed user object, or null if not found / corrupted
 */
export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error('[auth plugin] Failed to parse user from localStorage:', error)
    return null
  }
}

/**
 * Persist a user object to localStorage.
 *
 * @param {Object} user - The user object from the API response
 */
export function setUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch (error) {
    console.error('[auth plugin] Failed to store user:', error)
  }
}

// ─── Auth State Checks ─────────────────────────────────────────────────────

/**
 * Check whether a valid, non-expired session exists.
 * A valid session requires both a token AND a user object.
 *
 * @returns {boolean} True if the user has an active session
 */
export function isAuth() {
  try {
    const hasToken = getAuthorization() !== false
    const hasUser = getUser() !== null
    return hasToken && hasUser
  } catch (error) {
    console.error('[auth plugin] isAuth check failed:', error)
    return false
  }
}

/**
 * Check whether the current user has admin privileges.
 * Requires both a valid session AND user.role === 1.
 *
 * @returns {boolean} True if the user is authenticated and has admin role
 */
export function isAdmin() {
  if (!isAuth()) return false
  const user = getUser()
  return user?.role === 1
}

/**
 * Remove all auth data from localStorage.
 * Used during logout to clean up the session.
 */
export function authLogout() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch (error) {
    console.error('[auth plugin] Failed to clear auth data:', error)
  }
}

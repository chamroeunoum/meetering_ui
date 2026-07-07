/**
 * useAuth — Reusable authentication composable
 * 
 * This composable provides all auth-related functionality in one place.
 * It wraps localStorage-based token/user storage and exposes reactive
 * state so any component can react to auth changes.
 * 
 * @module useAuth
 * @since 1.0.0
 */

import { ref, computed, readonly } from 'vue'

// ─── Storage Keys ──────────────────────────────────────────────────────────
const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const MAX_UPLOAD_KEY = 'max_upload_filesize'

// ─── Reactive State ────────────────────────────────────────────────────────
const user = ref(null)
const token = ref(null)
const isReady = ref(false)

/**
 * Initialize auth state from localStorage.
 * Call once at app startup (e.g., in main.js or App.vue).
 * This hydrates the reactive state so the rest of the app stays in sync.
 */
function init() {
  try {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)

    if (storedToken) token.value = JSON.parse(storedToken)
    if (storedUser) user.value = JSON.parse(storedUser)
  } catch (err) {
    console.error('[useAuth] Failed to initialize auth state:', err)
    // Clear corrupted data so the app doesn't get stuck
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } finally {
    isReady.value = true
  }
}

// ─── Computed Properties ───────────────────────────────────────────────────

/** Whether a valid token exists and hasn't expired */
const isAuthenticated = computed(() => {
  if (!token.value?.access_token) return false
  if (!token.value?.expires_at) return false
  return new Date(token.value.expires_at) > new Date()
})

/** Whether the current user has admin role (role === 1) */
const isAdmin = computed(() => {
  return isAuthenticated.value && user.value?.role === 1
})

/** 
 * The fully-formed Authorization header value.
 * Format: "Bearer {access_token}"
 */
const authorizationHeader = computed(() => {
  if (!token.value?.access_token) return null
  const type = token.value.token_type || 'Bearer'
  return `${type} ${token.value.access_token}`
})

// ─── Token Management ──────────────────────────────────────────────────────

/**
 * Persist a token object to localStorage and reactive state.
 * @param {Object} newToken - Token object with shape:
 *   { access_token: string, token_type: string, expires_at: string }
 */
function setToken(newToken) {
  token.value = newToken
  localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken))
}

/**
 * Retrieve the raw token object from reactive state.
 * @returns {Object|null} The token object or null
 */
function getToken() {
  return token.value
}

/**
 * Retrieve just the access_token string.
 * @returns {string} The access token or empty string
 */
function getAccessToken() {
  return token.value?.access_token || ''
}

// ─── User Management ───────────────────────────────────────────────────────

/**
 * Persist a user object to localStorage and reactive state.
 * @param {Object} newUser - The user object from the API response
 */
function setUser(newUser) {
  user.value = newUser
  localStorage.setItem(USER_KEY, JSON.stringify(newUser))
}

/**
 * Retrieve the stored user object.
 * @returns {Object|null} The user object or null
 */
function getUser() {
  return user.value
}

// ─── Session Management ────────────────────────────────────────────────────

/**
 * Clear all auth data (token + user) from storage and state.
 * Call this on logout or when the session expires.
 */
function clearSession() {
  token.value = null
  user.value = null
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// ─── Upload Size Helper ────────────────────────────────────────────────────

/**
 * Store the maximum upload file size (in MB) from the server response.
 * @param {number} sizeInMB - Max upload size in megabytes
 */
function setMaxUploadSize(sizeInMB) {
  localStorage.setItem(MAX_UPLOAD_KEY, JSON.stringify(sizeInMB))
}

/**
 * Retrieve the stored maximum upload file size.
 * @returns {number} Max upload size in MB, or 0 if not set
 */
function getMaxUploadSize() {
  try {
    return parseFloat(JSON.parse(localStorage.getItem(MAX_UPLOAD_KEY))) || 0
  } catch {
    return 0
  }
}

// ─── Export ────────────────────────────────────────────────────────────────
export function useAuth() {
  return {
    // Reactive state (readonly to prevent accidental mutation from outside)
    user: readonly(user),
    isReady: readonly(isReady),

    // Computed
    isAuthenticated,
    isAdmin,
    authorizationHeader,

    // Methods
    init,
    setToken,
    getToken,
    getAccessToken,
    setUser,
    getUser,
    clearSession,
    setMaxUploadSize,
    getMaxUploadSize,
  }
}

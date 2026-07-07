/**
 * Vuex Auth Module — Authentication state management
 *
 * This module manages:
 *   - The current user object (stored in Vuex + localStorage)
 *   - The active access token (stored in Vuex + localStorage)
 *   - Login/logout/signup actions that call the backend API
 *
 * It works alongside the useAuth composable — the mutation also syncs
 * to localStorage so both Vuex and the composable stay in sync.
 *
 * @module store/modules/authentication
 */

import authApi from '../../api/auth'
import { setToken, setUser } from '../../plugins/authentication'

// ─── Initial State ─────────────────────────────────────────────────────────
const state = () => ({
  /** @type {Object|null} The authenticated user object (or null if not logged in) */
  user: null,
  /**
   * @type {Object} The access token with shape:
   *   { access_token: string|null, expires_at: Date, token_type: string }
   */
  token: {
    access_token: null,
    expires_at: new Date(),
    token_type: 'Bearer',
  },
})

// ─── Getters ───────────────────────────────────────────────────────────────

const getters = {
  /**
   * Build the full Authorization header string.
   * Format: "Bearer eyJhbGciOi..."
   *
   * @param {Object} state - Vuex module state
   * @returns {string} The Authorization header value
   */
  getAuthorization(state) {
    return `${state.token.token_type} ${state.token.access_token}`
  },

  /**
   * Check whether the user has a valid, non-expired session.
   *
   * @param {Object} state - Vuex module state
   * @returns {boolean} True if authenticated with a non-expired token
   */
  checkAuth(state) {
    return (
      state.token.access_token !== '' &&
      state.token.access_token !== null &&
      new Date(state.token.expires_at) >= new Date()
    )
  },
}

// ─── Actions ───────────────────────────────────────────────────────────────

const actions = {
  /**
   * Authenticate with email + password.
   * Sends credentials to the backend and returns the raw axios response.
   *
   * @param {Object} context       - Vuex action context
   * @param {Object} context.state - Module state
   * @param {Object} context.commit - Module commit
   * @param {Object} params        - { email: string, password: string }
   * @returns {Promise} Axios response promise
   */
  async login({ commit }, params) {
    const apiBase = import.meta.env.VITE_API_SERVER
    const response = await authApi.login(
      `${apiBase}/authentication/login`,
      params
    )
    return response
  },

  /**
   * End the current session.
   * Calls the backend logout endpoint, then clears local state.
   *
   * @param {Object} context - Vuex action context
   * @param {Object} params  - Any params the logout endpoint requires
   * @returns {Promise} Axios response promise
   */
  async logout({ commit }, params) {
    const apiBase = import.meta.env.VITE_API_SERVER
    const response = await authApi.logout(
      `${apiBase}/authentication/logout`,
      params
    )
    // Clear local state regardless of server response
    commit('clearAuthentication')
    return response
  },

  /**
   * Register a new user account.
   *
   * @param {Object} context - Vuex action context
   * @param {Object} params  - Registration form data
   * @returns {Promise} Axios response promise
   */
  async signup({ commit }, params) {
    const apiBase = import.meta.env.VITE_API_SERVER
    return authApi.signup(`${apiBase}/authentication/signup`, params)
  },
}

// ─── Mutations ─────────────────────────────────────────────────────────────

const mutations = {
  /**
   * Store the authenticated user and token after a successful login.
   * Syncs to both Vuex state and localStorage via the auth plugin.
   *
   * @param {Object} state  - Vuex module state
   * @param {Object} payload - { user: Object, token: Object }
   */
  setAuthentication(state, { user, token }) {
    state.user = user
    state.token = token
    // Persist to localStorage for session survival across page reloads
    setToken(token)
    setUser(user)
  },

  /**
   * Wipe all authentication data from state and localStorage.
   * Used on logout or when the session is terminated.
   */
  clearAuthentication(state) {
    state.user = null
    state.token = {
      access_token: null,
      expires_at: new Date(),
      token_type: 'Bearer',
    }
    // Remove from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

/**
 * authApi — API abstraction for authentication endpoints
 *
 * This module handles all HTTP communication with the backend auth service.
 * It uses axios directly and attaches the Authorization header where needed.
 *
 * All functions return the raw axios response so callers can handle
 * success/error at the call site.
 *
 * @module api/auth
 */

import axios from 'axios'
import { useAuth } from '@/composables/useAuth'

/**
 * Send login credentials to the server.
 * This is a public endpoint — no auth header needed.
 *
 * @param {string} url   - Full API endpoint URL (typically from env config)
 * @param {Object} params - { email: string, password: string }
 * @returns {Promise} Axios response promise
 */
async function login(url, params) {
  const response = await axios({
    method: 'post',
    url,
    data: params,
  })
  return response
}

/**
 * Log out the current user.
 * Requires a valid Authorization header.
 *
 * @param {string} url - Full API logout endpoint URL
 * @returns {Promise} Axios response promise
 */
async function logout(url) {
  const { authorizationHeader } = useAuth()
  const response = await axios({
    method: 'post',
    url,
    headers: {
      Authorization: authorizationHeader.value,
    },
  })
  return response
}

/**
 * Register a new user account.
 * Public endpoint — no auth header needed.
 *
 * @param {string} url   - Full API signup endpoint URL
 * @param {Object} params - Signup form data
 * @returns {Promise} Axios response promise
 */
async function signup(url, params) {
  const response = await axios({
    method: 'post',
    url,
    data: params,
  })
  return response
}

/**
 * Fetch the currently authenticated user's profile.
 *
 * @param {string} url - Full API profile endpoint URL
 * @returns {Promise} Axios response promise
 */
async function readProfile(url) {
  const { authorizationHeader } = useAuth()
  const response = await axios({
    method: 'get',
    url,
    headers: {
      Authorization: authorizationHeader.value,
    },
  })
  return response
}

/**
 * Update the authenticated user's profile.
 *
 * @param {string} url    - Full API profile update endpoint URL
 * @param {Object} params - Profile fields to update
 * @returns {Promise} Axios response promise
 */
async function updateProfile(url, params) {
  const { authorizationHeader } = useAuth()
  const response = await axios({
    method: 'post',
    url,
    data: params,
    headers: {
      Authorization: authorizationHeader.value,
    },
  })
  return response
}

/**
 * Upload a new profile picture.
 *
 * @param {string} url    - Full API upload endpoint URL
 * @param {FormData} params - Multipart form data with the image file
 * @returns {Promise} Axios response promise
 */
async function uploadProfilePicture(url, params) {
  const { authorizationHeader } = useAuth()
  const response = await axios({
    method: 'post',
    url,
    data: params,
    headers: {
      Authorization: authorizationHeader.value,
      'Content-Type': 'multipart/form-data',
    },
  })
  return response
}

/**
 * Change the authenticated user's password.
 *
 * @param {string} url    - Full API password-change endpoint URL
 * @param {Object} params - { current_password: string, new_password: string, ... }
 * @returns {Promise} Axios response promise
 */
async function changePassword(url, params) {
  const { authorizationHeader } = useAuth()
  const response = await axios({
    method: 'post',
    url,
    data: params,
    headers: {
      Authorization: authorizationHeader.value,
    },
  })
  return response
}

export default {
  login,
  logout,
  signup,
  readProfile,
  updateProfile,
  uploadProfilePicture,
  changePassword,
}

/**
 * Vuex Invitation Module — meeting invitation & check-in code management
 * (គ្រប់គ្រងការអញ្ជើញ).
 *
 * Backed by the admin-scoped invitation endpoints (Api\Admin\InvitationController
 * and Api\Admin\TelegramController), which resolve each meeting member via
 * MeetingMember + People — the same members this app already manages —
 * falling back to the officer-portal Officer model only when a member
 * happens to also have a linked login account.
 *
 * @module store/modules/meeting/invitation
 */
import crud from './../../../api/crud'

const state = () => ({
  // VITE_API_SERVER points at /api/meeting; these endpoints live under /api/admin.
  server: import.meta.env.VITE_API_SERVER.replace(/\/api\/meeting\/?$/, '/api/admin'),
})

const actions = {
  async list({ state }, { meeting_id }) {
    return await crud.read(state.server + '/' + meeting_id + '/invitations')
  },
  async stats({ state }, { meeting_id }) {
    return await crud.read(state.server + '/' + meeting_id + '/invitations/stats')
  },
  async generateCodes({ state }, { meeting_id }) {
    return await crud.create(state.server + '/' + meeting_id + '/invitations/generate-codes', {})
  },
  async generateSingleCode({ state }, { meeting_id, member_id }) {
    return await crud.create(state.server + '/' + meeting_id + '/invitations/generate-code/' + member_id, {})
  },
  async markSent({ state }, { meeting_id, member_id }) {
    return await crud.create(state.server + '/' + meeting_id + '/invitations/mark-sent/' + member_id, {})
  },
  async markAllSent({ state }, { meeting_id }) {
    return await crud.create(state.server + '/' + meeting_id + '/invitations/mark-all-sent', {})
  },
  async sendInvitation({ state }, { meeting_id, member_id }) {
    return await crud.create(state.server + '/' + meeting_id + '/invitations/send/' + member_id, {})
  },
  async sendAllInvitations({ state }, { meeting_id }) {
    return await crud.create(state.server + '/' + meeting_id + '/invitations/send-all', {})
  },
  async sendTelegram({ state }, { meeting_id, member_id }) {
    return await crud.create(state.server + '/' + meeting_id + '/invitations/send-telegram/' + member_id, {})
  },
  async sendTelegramAll({ state }, { meeting_id }) {
    return await crud.create(state.server + '/' + meeting_id + '/invitations/send-telegram-all', {})
  },
}

export default {
  namespaced: true,
  state,
  actions,
}

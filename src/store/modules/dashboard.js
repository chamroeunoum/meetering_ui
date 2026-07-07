/**
 * Vuex Dashboard Module — Dashboard widget data
 *
 * Fetches aggregate statistics from the backend dashboard API endpoints
 * for display in the dashboard widgets (summary cards, charts, etc.).
 *
 * API base: {VITE_API_SERVER}/dashboard/
 *
 * @module store/modules/dashboard
 */

import crud from '../../api/crud'

const apiBase = import.meta.env.VITE_API_SERVER

// ─── State ────────────────────────────────────────────────────────────────

const state = () => ({
  /** @type {Object} Summary counts { users, regulators, meetings } */
  summary: {
    users: 0,
    regulators: 0,
    meetings: 0,
  },
  /** @type {Array} Meetings grouped by type */
  meetingsByType: [],
  /** @type {Array} Meetings grouped by status */
  meetingsByStatus: [],
  /** @type {Array} Meetings grouped by organization */
  meetingsByOrganization: [],
  /** @type {Array} Meetings this week by type */
  meetingsThisWeek: [],
  /** @type {Array} Meetings this month by type */
  meetingsThisMonth: [],
  /** @type {Object} Task stats { new, in_progress, pending, ended } */
  taskStats: {
    new: 0,
    in_progress: 0,
    pending: 0,
    ended: 0,
  },
  /** @type {boolean} Loading state */
  loading: false,
})

// ─── Actions ──────────────────────────────────────────────────────────────

const actions = {
  /**
   * Fetch all dashboard summary data in one call.
   * Dispatches individual fetches and collects results.
   */
  async fetchSummary({ commit }) {
    commit('setLoading', true)
    try {
      const [users, regulators, meetings, meetingsByType, meetingsByStatus, meetingsByOrg, meetingsWeek, taskStats] =
        await Promise.allSettled([
          crud.read(`${apiBase}/dashboard/users/total`),
          crud.read(`${apiBase}/dashboard/regulators/total`),
          crud.read(`${apiBase}/dashboard/meetings/total`),
          crud.read(`${apiBase}/dashboard/meetings/total/bytype`),
          crud.read(`${apiBase}/dashboard/meetings/total/bystatus`),
          crud.read(`${apiBase}/dashboard/meetings/total/byorganization`),
          crud.read(`${apiBase}/dashboard/meetings/total/bytype/thisweek`),
          crud.read(`${apiBase}/tasks/total_number_of_each_status`),
        ])

      commit('setSummary', {
        users: users.status === 'fulfilled' && users.value?.data?.ok ? users.value.data.result.total : 0,
        regulators: regulators.status === 'fulfilled' && regulators.value?.data?.ok ? regulators.value.data.result.total : 0,
        meetings: meetings.status === 'fulfilled' && meetings.value?.data?.ok ? meetings.value.data.result.total : 0,
      })

      if (meetingsByType.status === 'fulfilled' && meetingsByType.value?.data?.ok) {
        commit('setMeetingsByType', meetingsByType.value.data.result)
      }
      if (meetingsByStatus.status === 'fulfilled' && meetingsByStatus.value?.data?.ok) {
        commit('setMeetingsByStatus', meetingsByStatus.value.data.result)
      }
      if (meetingsByOrg.status === 'fulfilled' && meetingsByOrg.value?.data?.ok) {
        commit('setMeetingsByOrganization', meetingsByOrg.value.data.result)
      }
      if (meetingsWeek.status === 'fulfilled' && meetingsWeek.value?.data?.ok) {
        commit('setMeetingsThisWeek', meetingsWeek.value.data.result)
      }
      if (taskStats.status === 'fulfilled' && taskStats.value?.data) {
        commit('setTaskStats', taskStats.value.data)
      }
    } finally {
      commit('setLoading', false)
    }
  },

  /** Fetch dashboard users total */
  async fetchUsersTotal({ commit }) {
    try {
      const res = await crud.read(`${apiBase}/dashboard/users/total`)
      if (res.data?.ok) {
        commit('setSummaryItem', { key: 'users', value: res.data.result.total })
      }
    } catch (e) {
      console.error('[dashboard] Failed to fetch users total:', e)
    }
  },

  /** Fetch dashboard regulators total */
  async fetchRegulatorsTotal({ commit }) {
    try {
      const res = await crud.read(`${apiBase}/dashboard/regulators/total`)
      if (res.data?.ok) {
        commit('setSummaryItem', { key: 'regulators', value: res.data.result.total })
      }
    } catch (e) {
      console.error('[dashboard] Failed to fetch regulators total:', e)
    }
  },

  /** Fetch dashboard meetings total */
  async fetchMeetingsTotal({ commit }) {
    try {
      const res = await crud.read(`${apiBase}/dashboard/meetings/total`)
      if (res.data?.ok) {
        commit('setSummaryItem', { key: 'meetings', value: res.data.result.total })
      }
    } catch (e) {
      console.error('[dashboard] Failed to fetch meetings total:', e)
    }
  },

  /** Fetch meetings by type */
  async fetchMeetingsByType({ commit }) {
    try {
      const res = await crud.read(`${apiBase}/dashboard/meetings/total/bytype`)
      if (res.data?.ok) {
        commit('setMeetingsByType', res.data.result)
      }
    } catch (e) {
      console.error('[dashboard] Failed to fetch meetings by type:', e)
    }
  },

  /** Fetch meetings by status */
  async fetchMeetingsByStatus({ commit }) {
    try {
      const res = await crud.read(`${apiBase}/dashboard/meetings/total/bystatus`)
      if (res.data?.ok) {
        commit('setMeetingsByStatus', res.data.result)
      }
    } catch (e) {
      console.error('[dashboard] Failed to fetch meetings by status:', e)
    }
  },

  /** Fetch meetings by organization */
  async fetchMeetingsByOrganization({ commit }) {
    try {
      const res = await crud.read(`${apiBase}/dashboard/meetings/total/byorganization`)
      if (res.data?.ok) {
        commit('setMeetingsByOrganization', res.data.result)
      }
    } catch (e) {
      console.error('[dashboard] Failed to fetch meetings by organization:', e)
    }
  },

  /** Fetch task stats */
  async fetchTaskStats({ commit }) {
    try {
      const res = await crud.read(`${apiBase}/tasks/total_number_of_each_status`)
      if (res.data) {
        commit('setTaskStats', res.data)
      }
    } catch (e) {
      console.error('[dashboard] Failed to fetch task stats:', e)
    }
  },
}

// ─── Mutations ────────────────────────────────────────────────────────────

const mutations = {
  setSummary(state, { users, regulators, meetings }) {
    state.summary.users = users
    state.summary.regulators = regulators
    state.summary.meetings = meetings
  },

  setSummaryItem(state, { key, value }) {
    state.summary[key] = value
  },

  setMeetingsByType(state, data) {
    state.meetingsByType = Array.isArray(data) ? data : []
  },

  setMeetingsByStatus(state, data) {
    state.meetingsByStatus = Array.isArray(data) ? data : []
  },

  setMeetingsByOrganization(state, data) {
    state.meetingsByOrganization = Array.isArray(data) ? data : []
  },

  setMeetingsThisWeek(state, data) {
    state.meetingsThisWeek = Array.isArray(data) ? data : []
  },

  setMeetingsThisMonth(state, data) {
    state.meetingsThisMonth = Array.isArray(data) ? data : []
  },

  setTaskStats(state, data) {
    state.taskStats = {
      new: data.new || 0,
      in_progress: data.in_progress || 0,
      pending: data.pending || 0,
      ended: data.ended || 0,
    }
  },

  setLoading(state, value) {
    state.loading = value
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}

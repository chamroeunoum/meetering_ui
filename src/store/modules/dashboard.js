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
  /** @type {Array} Meetings by room */
  meetingsByRoom: [],
  /** @type {Array} Document statistics */
  meetingsDocumentsStats: [],
  /** @type {Array} Meetings by month */
  meetingsByMonth: [],
  /** @type {Array} PDF file counts per type */
  meetingsPdfTotal: [],
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
      const [users, regulators, meetings, meetingsByType, meetingsByStatus, meetingsByOrg, meetingsWeek, taskStats,
             meetingsByRoom, meetingsDocumentsStats, meetingsByMonth, meetingsPdfTotal] =
        await Promise.allSettled([
          crud.read(`${apiBase}/dashboard/users/total`),
          crud.read(`${apiBase}/dashboard/regulators/total`),
          crud.read(`${apiBase}/dashboard/meetings/total`),
          crud.read(`${apiBase}/dashboard/meetings/total/bytype`),
          crud.read(`${apiBase}/dashboard/meetings/total/bystatus`),
          crud.read(`${apiBase}/dashboard/meetings/total/byorganization`),
          crud.read(`${apiBase}/dashboard/meetings/total/bytype/thisweek`),
          crud.read(`${apiBase}/tasks/total_number_of_each_status`),
          crud.read(`${apiBase}/dashboard/meetings/total/byroom`),
          crud.read(`${apiBase}/dashboard/meetings/total/bydocuments`),
          crud.read(`${apiBase}/dashboard/meetings/total/bymonth`),
          crud.read(`${apiBase}/dashboard/meetings/total/bypdftotal`),
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
      if (meetingsByRoom.status === 'fulfilled' && meetingsByRoom.value?.data?.ok) {
        commit('setMeetingsByRoom', meetingsByRoom.value.data.result)
      }
      if (meetingsDocumentsStats.status === 'fulfilled' && meetingsDocumentsStats.value?.data?.ok) {
        commit('setMeetingsDocumentsStats', meetingsDocumentsStats.value.data.result)
      }
      if (meetingsByMonth.status === 'fulfilled' && meetingsByMonth.value?.data?.ok) {
        commit('setMeetingsByMonth', meetingsByMonth.value.data.result)
      }
      if (meetingsPdfTotal.status === 'fulfilled' && meetingsPdfTotal.value?.data?.ok) {
        commit('setMeetingsPdfTotal', meetingsPdfTotal.value.data.result)
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
    // API returns { total, records: [{ type: {id, name}, total: count }] }
    if (data && data.records && Array.isArray(data.records)) {
      state.meetingsByType = data.records.map(r => ({
        name: r.type?.name || 'ផ្សេងៗ',
        count: r.total,
        type: r.type
      }))
    } else if (Array.isArray(data)) {
      state.meetingsByType = data
    } else {
      state.meetingsByType = []
    }
  },

  setMeetingsByStatus(state, data) {
    // API returns { total, records: [{ status: {id, name}, total: count }] }
    if (data && data.records && Array.isArray(data.records)) {
      state.meetingsByStatus = data.records.map(r => ({
        name: r.status?.name || 'ផ្សេងៗ',
        count: r.total,
        status: r.status
      }))
    } else if (Array.isArray(data)) {
      state.meetingsByStatus = data
    } else {
      state.meetingsByStatus = []
    }
  },

  setMeetingsByOrganization(state, data) {
    // API returns { total, records: [{ name, count }] } OR a plain array
    if (data && data.records && Array.isArray(data.records)) {
      state.meetingsByOrganization = data.records.map(r => ({
        name: r.name || r.organization || 'ផ្សេងៗ',
        count: r.total || r.count || 0
      }))
    } else if (Array.isArray(data)) {
      state.meetingsByOrganization = data
    } else {
      state.meetingsByOrganization = []
    }
  },

  setMeetingsThisWeek(state, data) {
    state.meetingsThisWeek = Array.isArray(data) ? data : []
  },

  setMeetingsThisMonth(state, data) {
    state.meetingsThisMonth = Array.isArray(data) ? data : []
  },

  setMeetingsByRoom(state, data) {
    state.meetingsByRoom = Array.isArray(data) ? data : []
  },

  setMeetingsDocumentsStats(state, data) {
    state.meetingsDocumentsStats = Array.isArray(data) ? data : []
  },

  setMeetingsByMonth(state, data) {
    state.meetingsByMonth = Array.isArray(data) ? data : []
  },

  setMeetingsPdfTotal(state, data) {
    state.meetingsPdfTotal = Array.isArray(data) ? data : []
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

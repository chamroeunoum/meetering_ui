import crud from '../../../api/crud'

const state = () => ({
  model: { name: 'seat-assignment', module: 'seat-assignments', title: 'ការកំណត់កៅអី' },
  server: import.meta.env.VITE_API_SERVER,
  records: [],
  record: null,
})

function baseUrl(path = '') {
  return `${import.meta.env.VITE_API_SERVER}/seat-assignments${path}`
}

const actions = {
  async list({ state }, params) {
    return await crud.list(baseUrl() + '?' + new URLSearchParams({ meeting_id: params.meeting_id }).toString())
  },
  async availableMembers({ state }, params) {
    return await crud.list(baseUrl('/available-members') + '?' + new URLSearchParams({ meeting_id: params.meeting_id }).toString())
  },
  async assign({ state }, params) {
    return await crud.create(baseUrl('/assign'), params)
  },
  async unassign({ state }, params) {
    return await crud.delete(baseUrl('/' + params.id + '/unassign'))
  },
  async clearAll({ state }, params) {
    return await crud.delete(baseUrl('/clear-all'), params)
  },
}

export default { namespaced: true, state, actions }

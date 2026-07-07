import crud from '../../../api/crud'

const state = () => ({
  model: { name: 'room-seat', module: 'seats', title: 'កៅអី' },
  server: import.meta.env.VITE_API_SERVER,
  records: [],
  record: null,
})

function seatUrl(roomId, path = '') {
  return `${import.meta.env.VITE_API_SERVER}/rooms/${roomId}/seats${path}`
}

const actions = {
  async list({ state }, params) {
    return await crud.list(seatUrl(params.room_id) + '?' + new URLSearchParams({ search: params.search || '', perPage: params.perPage || 200, page: params.page || 1 }).toString())
  },
  async read({ state }, params) {
    return await crud.read(seatUrl(params.room_id, '/' + params.id + '/read'))
  },
  async create({ state }, params) {
    return await crud.create(seatUrl(params.room_id, '/create'), params)
  },
  async batchCreate({ state }, params) {
    return await crud.create(seatUrl(params.room_id, '/batch'), params)
  },
  async update({ state }, params) {
    return await crud.update(seatUrl(params.room_id, '/update'), params)
  },
  async delete({ state }, params) {
    return await crud.delete(seatUrl(params.room_id, '/' + params.id + '/delete'))
  },
  async clearAll({ state }, params) {
    return await crud.delete(seatUrl(params.room_id, '/clear-all'), params)
  },
}

export default { namespaced: true, state, actions }

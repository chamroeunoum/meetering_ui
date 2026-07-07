import crud from '../../../api/crud'

const state = () => ({
  model: { name: 'room-equipment', module: 'equipment', title: 'ឧបករណ៍' },
  server: import.meta.env.VITE_API_SERVER,
  records: [],
  record: null,
})

function eqUrl(roomId, path = '') {
  return `${import.meta.env.VITE_API_SERVER}/rooms/${roomId}/equipment${path}`
}

const actions = {
  async list({ state }, params) {
    return await crud.list(eqUrl(params.room_id) + '?' + new URLSearchParams({ search: params.search || '', perPage: params.perPage || 50, page: params.page || 1 }).toString())
  },
  async read({ state }, params) {
    return await crud.read(eqUrl(params.room_id, '/' + params.id + '/read'))
  },
  async create({ state }, params) {
    return await crud.create(eqUrl(params.room_id, '/create'), params)
  },
  async update({ state }, params) {
    return await crud.update(eqUrl(params.room_id, '/update'), params)
  },
  async delete({ state }, params) {
    return await crud.delete(eqUrl(params.room_id, '/' + params.id + '/delete'))
  },
  async toggleStatus({ state }, params) {
    return await crud.update(eqUrl(params.room_id, '/toggle-status'), params)
  },
  async uploadPicture({ state }, params) {
    return await crud.upload(eqUrl(params.room_id, '/upload/picture'), params)
  },
}

export default { namespaced: true, state, actions }

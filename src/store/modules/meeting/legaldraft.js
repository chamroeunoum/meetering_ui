/**
 * Vuex Legal Draft Module — comments (annotation + pole + pole comments) on a
 * legal draft, backed by the real database tables (legal_draft_annotations,
 * legal_draft_poles, legal_draft_pole_comments) via
 * app/Http/Controllers/Api/Meeting/LegalDraftController.php.
 *
 * @module store/modules/meeting/legaldraft
 */

import crud from './../../../api/crud'

const state = () => ({
  server: import.meta.env.VITE_API_SERVER
})

const actions = {
  async read({ state }, { id }) {
    return await crud.read(state.server + '/legaldrafts/' + id + '/read')
  },
  async uploadFile({ state }, formData) {
    return await crud.upload(state.server + '/legaldrafts/upload', formData)
  },
  async readFile({ state }, { id, file_type }) {
    return await crud.read(state.server + '/legaldrafts/file?id=' + id + '&file_type=' + file_type)
  },
  async createAnnotation({ state }, params) {
    return await crud.create(state.server + '/legaldrafts/annotation/create', params)
  },
  async updateAnnotation({ state }, params) {
    return await crud.update(state.server + '/legaldrafts/annotation/update', params)
  },
  async deleteAnnotation({ state }, params) {
    return await crud.delete(state.server + '/legaldrafts/annotation/delete', params)
  },
  async createPole({ state }, params) {
    return await crud.create(state.server + '/legaldrafts/pole/create', params)
  },
  async updatePole({ state }, params) {
    return await crud.update(state.server + '/legaldrafts/pole/update', params)
  },
  async resolvePole({ state }, params) {
    return await crud.update(state.server + '/legaldrafts/pole/resolve', params)
  },
  async closePole({ state }, params) {
    return await crud.update(state.server + '/legaldrafts/pole/close', params)
  },
  async deletePole({ state }, params) {
    return await crud.delete(state.server + '/legaldrafts/pole/delete', params)
  },
  async addPoleComment({ state }, params) {
    return await crud.create(state.server + '/legaldrafts/pole/comment/add', params)
  },
  async deletePoleComment({ state }, params) {
    return await crud.delete(state.server + '/legaldrafts/pole/comment/delete', params)
  }
}

export default {
  namespaced: true,
  state,
  actions
}

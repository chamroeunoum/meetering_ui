/**
 * Vuex Meeting Module — Meeting CRUD and document management (កិច្ចប្រជុំ)
 *
 * Core module managing meetings with support for:
 *   - Standard CRUD and file uploads (picture, PDF)
 *   - TV schedule display for public meeting boards
 *   - Regulator document association (toggle, read)
 *   - Meeting member management (toggle, group/role updates)
 *   - Report, tech report, preeng, minister preeng, and other document uploads
 *   - Meeting room assignment
 *
 * @module store/modules/meeting/meeting
 */

import crud from './../../../api/crud'
// initial state
const state = () => ({
  model: {
    name: "meeting" ,
    module: "meetings" ,
    title: "កិច្ចប្រជុំ" 
  },
  server: import.meta.env.VITE_API_SERVER ,
  columns: {
    all: ['id', 'meeting_code'] ,
    visible : ['id', 'meeting_code'] ,
    searchable : []
  } , 
  records: {
    all : [] ,
    selected: [] ,
    matched: [] ,
    record : null ,
    created: [] ,
    updated: [] ,
    deleted: []
  },
  pagination: {
    ids: [] ,
    page: 0 ,
    perPage: 10 ,
    search: '' ,
    totalRecords : 0 ,
    totalPages : 0 ,
    totalButtons: 10 ,
    buttons: [] ,
    start: 1 , 
    end: 1 
  }
})
// getters
const getters = {
  pagination(state, getters, rootState) {
    return state.pagination
  },
  records(state,getters,rootState){
    return state.records
  },
  rootState(state,getters,rootState){
    return rootState
  },
  server(state,getters,rootState){
    return state.server
  },
  columns(state,getters,rootState){
    return state.columns
  },
  model(state,getters,rootState){
    return state.model
  },
}

// actions
const docRouteMap = {
  ministerPreeng:  { read: 'ministerpreeng', remove: 'ministerpreeng', upload: 'ministerpreengs' },
  seichdeyPreeng:  { read: 'preeng', remove: 'preeng', upload: 'preengs' },
  techReports:     { read: 'techreport', remove: 'techreport', upload: 'techreports' },
  reports:         { read: 'report', remove: 'report', upload: 'reports' },
  otherDocuments:  { read: 'otherdocument', remove: 'otherdocument', upload: 'otherdocuments' },
}
const actions = {
  /**
   * Crud functions
   */
  async list ({ state, commit, rootState },params) {
    return await crud.list(
      state.server+"/"+state.model.module + "?" + new URLSearchParams({
        search: params.search ,
        perPage: params.perPage ,
        page: params.page
      }).toString()
    )
  },
  async read ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/"+params.id+"/read")
  },
  async create ({ state, commit, rootState },params) {
    return await crud.create(state.server+"/"+state.model.module+'/create',params)
  },
  async update ({ state, commit, rootState },params) {
    return await crud.update(state.server+"/"+state.model.module+'/update',params)
  },
  async delete ({ state, commit, rootState },params) {
    return await crud.delete(state.server+"/"+state.model.module+'/delete',params)
  },
  async toggleActive({state, commit, rootState}, params){
    return await crud.update(state.server+"/"+state.model.module+"/toggleactive",params)
  },
  async start({state, commit, rootState}, params){
    return await crud.update(state.server+"/"+state.model.module+"/start",params)
  },
  async end({state, commit, rootState}, params){
    return await crud.update(state.server+"/"+state.model.module+"/end",params)
  },
  async statusNew({state, commit, rootState}, params){
    return await crud.update(state.server+"/"+state.model.module+"/"+params.id+"/status/new",params)
  },
  async statusChange({state, commit, rootState}, params){
    return await crud.update(state.server+"/"+state.model.module+"/"+params.id+"/status/change",params)
  },
  async statusDelay({state, commit, rootState}, params){
    return await crud.update(state.server+"/"+state.model.module+"/"+params.id+"/status/delay",params)
  },
  async statusCancel({state, commit, rootState}, params){
    return await crud.update(state.server+"/"+state.model.module+"/"+params.id+"/status/cancel",params)
  },
  async setStatusTime({state, commit, rootState}, params){
    return await crud.update(state.server+"/"+state.model.module+"/"+params.id+"/status/time",params)
  },
  async uploadPicture({ state, commit, rootState },formData) {
    return await crud.upload(state.server+"/"+state.model.module+"/upload/picture",formData)
  },
  async uploadPdf({ state, commit, rootState },formData) {
    return await crud.upload(state.server+"/"+state.model.module+"/upload/pdf",formData)
  },
  async pdf ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/pdf?id="+params.id)
  },
  // Custom function
  async scheduleOnTv ({ state, commit, rootState },params) {
    return await crud.list(state.server+"/tv/meetings" + "?" + new URLSearchParams({
          search: params.search ,
          perPage: params.perPage ,
          page: params.page
        }).toString()
      )
  },
  async regulators ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/regulators")
  },
  async toggleMeetingRegulator ({ state, commit, rootState },params) {
    return await crud.update(state.server+"/"+state.model.module+"/"+params.meeting.id+"/regulator/"+params.regulator.id+'/toggle')
  },
  async toggleMeetingMember ({ state, commit, rootState },params) {
    return await crud.update(state.server+"/"+state.model.module+"/"+params.meeting.id+"/member/"+params.member.id+'/toggle')
  },
  async toggleMeetingMemberAttendant ({ state, commit, rootState },params) {
    return await crud.update(state.server+"/"+state.model.module+"/meeting_member/"+params.meeting_member_id+"/member/"+params.member_id+'/toggle')
  },
  async updateMemberGroupAndRole ({ state, commit, rootState },params) {
    return await crud.create(state.server+"/"+state.model.module+"/update_group_role",params)
  },
  /** Regulator */
  async readRegulator ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/regulators/pdf?id="+params.id)
  },
  /** Report */
  async uploadReports({ state, commit, rootState },formData) {
    return await crud.upload(state.server+"/"+state.model.module+"/upload/reports",formData)
  },
  async readReport ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/"+params.id+"/read/report/"+params.serial)
  },
  async removeReport ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/"+params.id+"/remove/report/"+params.serial)
  },
  /** Tech Report */
  async uploadTechReports({ state, commit, rootState },formData) {
    return await crud.upload(state.server+"/"+state.model.module+"/upload/techreports",formData)
  },
  async readTechReport ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/"+params.id+"/read/techreport/"+params.serial)
  },
  async removeTechReport ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/"+params.id+"/remove/techreport/"+params.serial)
  },
  /** Preeng */
  async uploadSeichdeyPreengs({ state, commit, rootState },formData) {
    return await crud.upload(state.server+"/"+state.model.module+"/upload/preengs",formData)
  },
  async readPreeng ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/"+params.id+"/read/preeng/"+params.serial)
  },
  async removePreeng ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/"+params.id+"/remove/preeng/"+params.serial)
  },
  /** Minister Preeng */
  async uploadMinisterPreengs({ state, commit, rootState },formData) {
    return await crud.upload(state.server+"/"+state.model.module+"/upload/ministerpreengs",formData)
  },
  async readMinisterPreeng ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/"+params.id+"/read/ministerpreeng/"+params.serial)
  },
  async removeMinisterPreeng ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/"+params.id+"/remove/ministerpreeng/"+params.serial)
  },
  /** Other documents */
  async uploadOtherDocuments({ state, commit, rootState },formData) {
    return await crud.upload(state.server+"/"+state.model.module+"/upload/otherdocuments",formData)
  },
  async readOtherDocument ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/"+params.id+"/read/otherdocument/"+params.serial)
  },
  async removeOtherDocument ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/"+params.id+"/remove/otherdocument/"+params.serial)
  },
  /** Minister Preeng */
  async uploadMinisterPreengs({ state, commit, rootState },formData) {
    return await crud.upload(state.server+"/"+state.model.module+"/upload/ministerpreengs",formData)
  },
  async readMinisterPreeng ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/"+params.id+"/read/ministerpreeng/"+params.serial)
  },
  async removeMinisterPreeng ({ state, commit, rootState },params) {
    return await crud.read(state.server+"/"+state.model.module+"/"+params.id+"/remove/ministerpreeng/"+params.serial)
  },

  async toggleMeetingRoom ({ state, commit, rootState },params) {
    return await crud.update(state.server+"/"+state.model.module+"/"+params.meeting.id+"/room/"+params.room.id+'/toggle')
  },
  
  

  async fetchChecklists ({ state }, params) {
    return await crud.list(state.server + '/checklists?' + new URLSearchParams({ meeting_id: params.meeting_id, room_id: params.room_id || 0 }).toString())
  },

  async toggleChecklist ({ state }, params) {
    return await crud.update(state.server + '/checklists/toggle', params)
  },

  async toggleChecklistEquipmentStatus ({ state }, params) {
    return await crud.update(state.server + '/checklists/toggle-equipment-status', params)
  },

  // ─── Generic document actions (key maps to doc type) ──────────────
  async readDocPdf ({ state }, params) {
    const m = docRouteMap[params.key]
    if (!m) throw new Error('Unknown doc type: ' + params.key)
    return await crud.read(state.server + '/meetings/' + params.id + '/read/' + m.read + '/' + params.serial)
  },

  async removeDoc ({ state }, params) {
    const m = docRouteMap[params.key]
    if (!m) throw new Error('Unknown doc type: ' + params.key)
    return await crud.read(state.server + '/meetings/' + params.id + '/remove/' + m.remove + '/' + params.serial)
  },

  async uploadDoc ({ state }, params) {
    const m = docRouteMap[params.key]
    if (!m) throw new Error('Unknown doc type: ' + params.key)
    return await crud.upload(state.server + '/meetings/upload/' + m.upload, params.formData)
  },
  async agendaList({state}, params) {
    return await crud.list(state.server+'/agendas?'+new URLSearchParams(params))
  },
  async agendaSave({state}, params) {
    return await crud.create(state.server+'/agendas/save', params)
  },
  async agendaDelete({state}, params) {
    return await crud.delete(state.server+'/agendas/delete', params)
  },
}

// mutations
const mutations = {
  setModel( state, model ){
    state.model = model
  },
  setPagination(state , pagination ){
      state.pagination = pagination
  },
  setPaginationIds( state , ids ){
    state.pagination.ids = ids != null && ids != undefined && ids.length > 0 ? ids.filter( ( id ) => parseInt( id ) > 0 ) : []
  },
  setPaginationPage( state , page ){
    if( !(typeof page === 'number') ){
      throw new Error(`លេខទំព័រមិនត្រឹមត្រូវ ៖ ${page} មិនមែនជាប្រភេទតួលេខ។`)
    }
    state.pagination.page = parseInt( page )
  },
  setPaginationPerPage( state , perPage ){
    if( !(typeof perPage === 'number') ){
      throw new Error(`ចំនួនទិន្នន័យក្នុង ១ ទំព័រ មិនត្រឹមត្រូវ ៖ ${perPage} មិនមែនជាប្រភេទតួលេខ។`)
    }
    state.pagination.perPage = parseInt( perPage )
  },
  setPaginationSearch( state , search ){
    if( search == null || search == undefined ){ // UPDATED: was referencing undefined 'string'
      throw new Error(`សូមបញ្ចូលពាក្យគន្លឹះដើម្បីស្វែងរក : ${search}`);
    }
    state.pagination.search = search // UPDATED: was assigning undefined 'string'
  },
  setPaginationStart( state , start ){
    if( !(typeof start === 'number') ){
      throw new Error(`លេខទំព័រមិនត្រឹមត្រូវ ៖ ${start} មិនមែនជាប្រភេទតួលេខ។`)
    }
    state.pagination.start = parseInt( start )
  },
  setPaginationEnd( state , end ){
    if( !(typeof end === 'number') ){
      throw new Error(`លេខទំព័រមិនត្រឹមត្រូវ ៖ ${end} មិនមែនជាប្រភេទតួលេខ។`)
    }
    state.pagination.end = parseInt( end ) // UPDATED: was referencing undefined 'stendart' (typo)
  },
  setServer(state , server ){
      if( server == null || server == undefined || server == "" ){
          throw new Error(`សូមបញ្ជាក់ពី Server ៖ ${server}`);
      }
      state.server = server
  },
  setColumns(state ,columns){
    if( !Array.isArray( columns ) || ( Array.isArray( columns ) && columns.length <= 0 ) ){
        throw new Error(`សូមបញ្ចូលឈ្មោះក្បាលតារាង ៖ ${columns}`);
    }
    state.columns.all = columns
    state.columns.visible = columns
  },
  setVisibleColumns(state ,columns){
    console.log( columns)
      if( !Array.isArray( columns ) || ( Array.isArray( columns ) && columns.length <= 0 ) ){
          throw new Error(`សូមបញ្ចូលឈ្មោះក្បាលតារាង ៖ ${columns}`);
      }
      state.columns.visible = columns
  },
  setSearchableColumns(state ,columns){
      if( !Array.isArray( columns ) || ( Array.isArray( columns ) && columns.length <= 0 ) ){
          throw new Error(`សូមបញ្ចូលឈ្មោះក្បាលតារាង ៖ ${columns}`);
      }
      state.columns.searchable = columns
  },
  setAllRecords( state , records ){
    state.records.all = state.records.matched = records 
  },
  setMatchedRecords( state , records ){
    state.records.matched = records
  },
  setSelectedRecords( state , records ){
    state.records.selected = records
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
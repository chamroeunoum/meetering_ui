/**
 * Vuex Folder Module — Document folder CRUD and regulator association
 *
 * Manages folder containers that group regulators and documents.
 * Supports:
 *   - Standard CRUD (list, read, create, update, delete)
 *   - Global folder listing (across all users)
 *   - Regulator association (add/remove regulators from folders)
 *   - User-specific folder views and accessibility control
 *
 * @module store/modules/folder
 */

import crud from '../../api/crud'

// initial state
const state = () => ({
  model: {
    name: "" ,
    module: "" ,
    title: "" 
    // name: "folder" ,
    // module: "folders" ,
    // title: "ថតឯកសារ" 
  },
  server: import.meta.env.VITE_API_SERVER ,
  columns: {
    all: ['id'] ,
    visible : ['id'] ,
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
  /** Get the current pagination object (page, perPage, search, totals, buttons) */
  pagination(state, getters, rootState) {
    return state.pagination
  },
  /** Get all records state (all, selected, matched, record, created, updated, deleted) */
  records(state,getters,rootState){
    return state.records
  },
  /** Get the root Vuex state (for cross-module access) */
  rootState(state,getters,rootState){
    return rootState
  },
  /** Get the API server base URL from environment */
  server(state,getters,rootState){
    return import.meta.env.VITE_API_SERVER // UPDATED: fixed casing from vite_api_server
  },
  /** Get the configured table columns (all, visible, searchable) */
  columns(state,getters,rootState){
    return state.columns
  },
  /** Get the model metadata (name, module, title) */
  model(state,getters,rootState){
    return state.model
  },
}

// actions
const actions = {
  /**
   * CRUD — List records with pagination and search.
   * @param {Object} params - { search, perPage, page }
   */
  async list ({ state, commit, rootState },params) {
    return await crud.list(
      import.meta.env.VITE_API_SERVER+"/"+state.model.module + "?" + new URLSearchParams({ // UPDATED: fixed casing
        search: params.search ,
        perPage: params.perPage ,
        page: params.page
      }).toString()
    )
  },
  /** CRUD — Read a single record by ID */
  async read ({ state, commit, rootState },params) {
    return await crud.read(import.meta.env.VITE_API_SERVER+"/"+state.model.module+"/"+params.id+"/read") // UPDATED: fixed casing
  },
  /** CRUD — Create a new record */
  async create ({ state, commit, rootState },params) {
    return await crud.create(import.meta.env.VITE_API_SERVER+"/"+state.model.module+'/create',params) // UPDATED: fixed casing
  },
  /** CRUD — Update an existing record */
  async update ({ state, commit, rootState },params) {
    return await crud.update(import.meta.env.VITE_API_SERVER+"/"+state.model.module+'/update',params) // UPDATED: fixed casing
  },
  /** CRUD — Delete a record by ID */
  async delete ({ state, commit, rootState },params) {
    return await crud.delete(import.meta.env.VITE_API_SERVER+"/"+state.model.module+'/delete',params) // UPDATED: fixed casing
  },
  /** Toggle the active/inactive status of a record */
  async toggleActive({state, commit, rootState}, params){
    return await crud.update(rootState.server+"/"+state.model.module+"/toggleactive",params)
  },
  /** Upload a picture file to the record */
  async uploadPicture({ state, commit, rootState },formData) {
    return await crud.upload(rootState.server+"/"+state.model.module+"/upload/picture",formData)
  },
  /** Upload a PDF file to the record */
  async uploadPdf({ state, commit, rootState },formData) {
    return await crud.upload(rootState.server+"/"+state.model.module+"/upload/pdf",formData)
  },
  /** Read/stream a PDF document for display */
  async pdf ({ state, commit, rootState },params) {
    return await crud.read(rootState.server+"/"+state.model.module+"/pdf?id="+params.id)
  },
  /**
   * List global folders (accessible across all users, not scoped to one user).
   * @param {Object} params - { search, perPage, page }
   */
  async globalFolder ({ state, commit, rootState },params) {
    return await crud.list(
      import.meta.env.VITE_API_SERVER+"/"+state.model.module + "/global?" + new URLSearchParams({ // UPDATED: fixed casing
        search: params.search ,
        perPage: params.perPage ,
        page: params.page
      }).toString()
    )
  },
  /** List regulators associated with a folder */
  async regulators ({ state, commit, rootState },params) {
    return await crud.read(import.meta.env.VITE_API_SERVER+"/"+state.model.module+"/regulators"+ "?" + new URLSearchParams({ // UPDATED: fixed casing
      folder_id: params.id ,
      search: params.search ,
      perPage: params.perPage ,
      page: params.page
    }).toString(),
    null,
    true
  )},
  /** Associate a regulator with the folder */
  async addRegulator ({ state, commit, rootState },params) {
    return await crud.update(import.meta.env.VITE_API_SERVER+"/"+state.model.module+"/regulators/add",params) // UPDATED: fixed casing
  },
  /** Remove a regulator association from the folder */
  async removeRegulator ({ state, commit, rootState },params) {
    return await crud.update(import.meta.env.VITE_API_SERVER+"/"+state.model.module+"/regulators/remove",params) // UPDATED: fixed casing
  },
  /** List folders belonging to the current authenticated user */
  async ofUser ({ state, commit, rootState },params) {
    return await crud.read(import.meta.env.VITE_API_SERVER+"/"+state.model.module+"/user"+ "?" + new URLSearchParams({ // UPDATED: fixed casing
      search: params.search ,
      perPage: params.perPage ,
      page: params.page
    }).toString(),
    null,
    true
  )},
  /** List regulators with validation status for a folder */
  async listRegulatorWithValidation ({ state, commit, rootState },params) {
    return await crud.read(import.meta.env.VITE_API_SERVER+"/"+state.model.module+"/list/regulator/validation"+ "?" + new URLSearchParams({ // UPDATED: fixed casing
      search: params.search ,
      perPage: params.perPage ,
      page: params.page ,
      regulator_id : params.regulator_id
    }).toString(),
    null,
    true
  )},
  /** Update the accessibility mode of a folder (public/private) */
  async updateAccessibility ({ state, commit, rootState },params) {
    return await crud.update(import.meta.env.VITE_API_SERVER+"/"+state.model.module+'/'+params.id+'/accessibility',{mode: params.mode}) // UPDATED: fixed casing
  }
}

// mutations
/** Mutations for reactive state updates — used by components and actions to sync local Vuex state */
const mutations = {
  /** Set the model metadata (name, module, title) on folder context switch */
  setModel( state, model ){
    state.model = model
  },
  /** Set the full pagination object from API response */
  setPagination(state , pagination ){
      state.pagination = pagination
  },
  /** Set pagination record IDs (with positive-integer filter) */
  setPaginationIds( state , ids ){
    state.pagination.ids = ids != null && ids != undefined && ids.length > 0 ? ids.filter( ( id ) => parseInt( id ) > 0 ) : []
  },
  /** Set the current page number (validates as number) */
  setPaginationPage( state , page ){
    if( !(typeof page === 'number') ){
      throw new Error(`លេខទំព័រមិនត្រឹមត្រូវ ៖ ${page} មិនមែនជាប្រភេទតួលេខ។`)
    }
    state.pagination.page = parseInt( page )
  },
  /** Set per-page count (validates as number) */
  setPaginationPerPage( state , perPage ){
    if( !(typeof perPage === 'number') ){
      throw new Error(`ចំនួនទិន្នន័យក្នុង ១ ទំព័រ មិនត្រឹមត្រូវ ៖ ${perPage} មិនមែនជាប្រភេទតួលេខ។`)
    }
    state.pagination.perPage = parseInt( perPage )
  },
  /** Set the search/filter string */
  setPaginationSearch( state , search ){
    if( search == null || search == undefined ){ // UPDATED: was referencing undefined 'string' variable
      throw new Error(`សូមបញ្ចូលពាក្យគន្លឹះដើម្បីស្វែងរក : ${search}`);
    }
    state.pagination.search = search // UPDATED: was assigning undefined 'string'
  },
  /** Set pagination start page number for button generation */
  setPaginationStart( state , start ){
    if( !(typeof start === 'number') ){
      throw new Error(`លេខទំព័រមិនត្រឹមត្រូវ ៖ ${start} មិនមែនជាប្រភេទតួលេខ។`)
    }
    state.pagination.start = parseInt( start )
  },
  /** Set pagination end page number for button generation */
  setPaginationEnd( state , end ){
    if( !(typeof end === 'number') ){
      throw new Error(`លេខទំព័រមិនត្រឹមត្រូវ ៖ ${end} មិនមែនជាប្រភេទតួលេខ។`)
    }
    state.pagination.end = parseInt( end ) // UPDATED: was referencing undefined 'stendart' (typo)
  },
  /** Set the API server base URL */
  setServer(state , server ){
      if( server == null || server == undefined || server == "" ){
          throw new Error(`សូមបញ្ជាក់ពី Server ៖ ${server}`);
      }
      state.server = server // UPDATED: was trying to assign to read-only import.meta.env
  },
  /** Set the full column array (used as both 'all' and 'visible' columns) */
  setColumns(state ,columns){
    if( !Array.isArray( columns ) || ( Array.isArray( columns ) && columns.length <= 0 ) ){
        throw new Error(`សូមបញ្ចូលឈ្មោះក្បាលតារាង ៖ ${columns}`);
    }
    state.columns.all = columns
    state.columns.visible = columns
  },
  /** Set specifically the visible columns subset */
  setVisibleColumns(state ,columns){
    console.log( columns)
      if( !Array.isArray( columns ) || ( Array.isArray( columns ) && columns.length <= 0 ) ){
          throw new Error(`សូមបញ្ចូលឈ្មោះក្បាលតារាង ៖ ${columns}`);
      }
      state.columns.visible = columns
  },
  /** Set specifically the searchable columns subset */
  setSearchableColumns(state ,columns){
      if( !Array.isArray( columns ) || ( Array.isArray( columns ) && columns.length <= 0 ) ){
          throw new Error(`សូមបញ្ចូលឈ្មោះក្បាលតារាង ៖ ${columns}`);
      }
      state.columns.searchable = columns
  },
  /** Replace both all and matched records with fresh list data */
  setAllRecords( state , records ){
    state.records.all = state.records.matched = records 
  },
  /** Override the matched (filtered) records while keeping the full list intact */
  setMatchedRecords( state , records ){
    state.records.matched = records
  },
  /** Set the selected (checked) records array */
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

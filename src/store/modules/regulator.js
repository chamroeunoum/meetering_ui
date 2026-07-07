/**
 * Vuex Regulator Module — Regulatory document CRUD
 *
 * Manages regulatory documents (លិខិតបទដ្ឋានគតិយុត្ត) with standard CRUD operations,
 * pagination, file uploads (picture, PDF), and dashboard totals.
 *
 * @module store/modules/regulator
 */

import crud from '../../api/crud'

// initial state
const state = () => ({
  model: {
    name: "regulator" ,
    module: "regulators" ,
    title: "ឯកសារ" 
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
    buttons: [] ,
    start: 1 , 
    end: 1 
  }
})

// getters
const getters = {
  /** Get the current pagination object */
  pagination(state, getters, rootState) {
    return state.pagination
  },
  /** Get all records state */
  records(state,getters,rootState){
    return state.records
  },
  /** Get the root Vuex state for cross-module access */
  rootState(state,getters,rootState){
    return rootState
  },
  /** Get the API server base URL */
  server(state,getters,rootState){
    return import.meta.env.VITE_API_SERVER // UPDATED: fixed casing
  },
  /** Get configured table columns */
  columns(state,getters,rootState){
    return state.columns
  },
  /** Get model metadata */
  model(state,getters,rootState){
    return state.model
  },
}

// actions
const actions = {
  /** CRUD — List records with pagination and search */
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
  /** Toggle the active/inactive status of a regulator */
  async toggleActive({state, commit, rootState}, params){
    return await crud.update(rootState.server+"/"+state.model.module+"/toggleactive",params)
  },
  /** Upload a picture file to a regulator record */
  async uploadPicture({ state, commit, rootState },formData) {
    return await crud.upload(rootState.server+"/"+state.model.module+"/upload/picture",formData)
  },
  /** Upload a PDF document to a regulator record */
  async uploadPdf({ state, commit, rootState },formData) {
    return await crud.upload(rootState.server+"/"+state.model.module+"/upload/pdf",formData)
  },
  /** Read/stream a PDF for display */
  async pdf ({ state, commit, rootState },params) {
    return await crud.read(rootState.server+"/"+state.model.module+"/pdf?id="+params.id)
  },
  /** Dashboard — Get total count of regulators */
  async total ({ state, commit, rootState },params) {
    return await crud.read(import.meta.env.VITE_API_SERVER+"/dashboard/"+state.model.module+"/total")
  },
}

// mutations
const mutations = {
  /** Set the model metadata on context switch */
  setModel( state, model ){
    state.model = model
  },
  /** Set the full pagination object */
  setPagination(state , pagination ){
      state.pagination = pagination
  },
  /** Set pagination IDs with positive-integer filter */
  setPaginationIds( state , ids ){
    state.pagination.ids = ids != null && ids != undefined && ids.length > 0 ? ids.filter( ( id ) => parseInt( id ) > 0 ) : []
  },
  /** Set the current page number */
  setPaginationPage( state , page ){
    if( !(typeof page === 'number') ){
      throw new Error(`លេខទំព័រមិនត្រឹមត្រូវ ៖ ${page} មិនមែនជាប្រភេទតួលេខ។`)
    }
    state.pagination.page = parseInt( page )
  },
  /** Set per-page count */
  setPaginationPerPage( state , perPage ){
    if( !(typeof perPage === 'number') ){
      throw new Error(`ចំនួនទិន្នន័យក្នុង ១ ទំព័រ មិនត្រឹមត្រូវ ៖ ${perPage} មិនមែនជាប្រភេទតួលេខ។`)
    }
    state.pagination.perPage = parseInt( perPage )
  },
  /** Set the search/filter string */
  setPaginationSearch( state , search ){
    if( search == null || search == undefined ){ // UPDATED: was referencing undefined 'string'
      throw new Error(`សូមបញ្ចូលពាក្យគន្លឹះដើម្បីស្វែងរក : ${search}`);
    }
    state.pagination.search = search // UPDATED: was assigning undefined 'string'
  },
  /** Set pagination start page */
  setPaginationStart( state , start ){
    if( !(typeof start === 'number') ){
      throw new Error(`លេខទំព័រមិនត្រឹមត្រូវ ៖ ${start} មិនមែនជាប្រភេទតួលេខ។`)
    }
    state.pagination.start = parseInt( start )
  },
  /** Set pagination end page */
  setPaginationEnd( state , end ){
    if( !(typeof end === 'number') ){
      throw new Error(`លេខទំព័រមិនត្រឹមត្រូវ ៖ ${end} មិនមែនជាប្រភេទតួលេខ។`)
    }
    state.pagination.end = parseInt( end ) // UPDATED: was referencing undefined 'stendart' (typo)
  },
  /** Set the API server URL */
  setServer(state , server ){
      if( server == null || server == undefined || server == "" ){
          throw new Error(`សូមបញ្ជាក់ពី Server ៖ ${server}`);
      }
      state.server = server // UPDATED: was trying to assign to read-only import.meta.env
  },
  /** Set the full column array (all = visible) */
  setColumns(state ,columns){
    if( !Array.isArray( columns ) || ( Array.isArray( columns ) && columns.length <= 0 ) ){
        throw new Error(`សូមបញ្ចូលឈ្មោះក្បាលតារាង ៖ ${columns}`);
    }
    state.columns.all = columns
    state.columns.visible = columns
  },
  /** Set visible columns subset */
  setVisibleColumns(state ,columns){
    console.log( columns)
      if( !Array.isArray( columns ) || ( Array.isArray( columns ) && columns.length <= 0 ) ){
          throw new Error(`សូមបញ្ចូលឈ្មោះក្បាលតារាង ៖ ${columns}`);
      }
      state.columns.visible = columns
  },
  /** Set searchable columns subset */
  setSearchableColumns(state ,columns){
      if( !Array.isArray( columns ) || ( Array.isArray( columns ) && columns.length <= 0 ) ){
          throw new Error(`សូមបញ្ចូលឈ្មោះក្បាលតារាង ៖ ${columns}`);
      }
      state.columns.searchable = columns
  },
  /** Replace all and matched records */
  setAllRecords( state , records ){
    state.records.all = state.records.matched = records 
  },
  /** Override matched (filtered) records */
  setMatchedRecords( state , records ){
    state.records.matched = records
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

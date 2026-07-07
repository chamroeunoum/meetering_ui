/**
 * CRUD API Module — Generic HTTP client for CRUD operations
 *
 * Provides a thin wrapper around axios for all CRUD and file upload operations.
 * Automatically attaches the Bearer token Authorization header from localStorage.
 * Used by Vuex store modules to communicate with the backend REST API.
 *
 * All endpoints follow the pattern: {VITE_API_SERVER}/{model}/{action}
 *
 * @module api/crud
 */

import axios from "axios"
import { getAuthorization } from "./../plugins/authentication"
export default {
  async list(url,params){
    return await axios({
      method: 'GET' ,
      url: url ,
      data: params ,
      headers: {
        'Authorization' : getAuthorization() // bear token
      }
    })
  },
  async read(url,params){
    return await axios({
      method: 'GET' ,
      url: url ,
      data: params,
      headers: {
        'Authorization' : getAuthorization() // bear token
      }
    })
  },
  async create(url,params){
    return await axios({
      method: 'POST' ,
      url: url ,
      data: params,
      headers: {
        'Authorization' : getAuthorization() // bear token
      }
    })
  },
  async update(url,params){
    return await axios({
      method: 'PUT' ,
      url: url ,
      data: params,
      headers: {
        'Authorization' : getAuthorization() // bear token
      }
    })
  },
  async patch(url,params){
    return await axios({
      method: 'PATCH' ,
      url: url ,
      data: params,
      headers: {
        'Authorization' : getAuthorization() // bear token
      }
    })
  },
  async delete(url,params){
    return await axios({
      method: 'DELETE' ,
      url: url ,
      data: params,
      headers: {
        'Authorization' : getAuthorization() // bear token
      }
    })
  },
  async upload(url,formData){
    return await axios.post( url , formData ,
      { 
        headers: {
          Authorization : getAuthorization()  , // bear token
          'Content-Type': 'multipart/form-data' ,
        }
      }
    )
  }
}
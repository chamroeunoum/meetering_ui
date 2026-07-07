/**
 * Vuex Root Store — Central state management
 *
 * Composes all domain-specific store modules into a single Vuex store instance.
 * Includes debug logging (createLogger) in development mode.
 *
 * State shape:
 *   - company: ទីស្ដីការគណៈរដ្ឋមន្ត្រី (Council of Ministers)
 *   - system:  ប្រព័ន្ធកិច្ចប្រជុំគណៈរដ្ឋមន្ត្រី (Meeting Management System)
 *
 * Modules (all namespaced):
 *   auth, user, folder, attendant, officer, organization, position, countesy,
 *   regulator, search_regulator, regulatorType, task,
 *   meeting, meetingType, meetingPeople, meetingRoom, meetingOrganization,
 *   meetingCountesy, meetingPosition
 *
 * @module store
 */

import { createStore, createLogger } from 'vuex'
import auth from './modules/authentication'
import user from './modules/user'
import attendant from './modules/attendant'
import organization from './modules/organization'
import position from './modules/position'
import countesy from './modules/countesy'
import task from './modules/task'
import regulator from './modules/regulator'
import search_regulator from './modules/search_regulators'
import folder from './modules/folder'
import officer from './modules/officer'
import regulatorType from './modules/regulator/type'
import dashboard from './modules/dashboard'

import meeting from './modules/meeting/meeting'
import meetingType from './modules/meeting/type'
import meetingPeople from './modules/meeting/people'
import meetingOrganization from './modules/meeting/organization'
import meetingRoom from './modules/meeting/room'
import meetingRoomEquipment from './modules/meeting/room-equipment'
import meetingRoomSeat from './modules/meeting/room-seat'
import meetingCountesy from './modules/meeting/countesy'
import meetingPosition from './modules/meeting/position'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state: {
    company: {
      name: 'ទីស្ដីការគណៈរដ្ឋមន្ត្រី'
    },
    system: {
      name: 'ប្រព័ន្ធកិច្ចប្រជុំគណៈរដ្ឋមន្ត្រី'
    }
    // branch: '' 
  },
  modules: {
    auth ,
    user ,
    folder ,
    attendant ,
    officer,
    organization ,
    position , 
    countesy ,
    regulator ,
    search_regulator ,
    regulatorType ,
    dashboard ,
    task ,
    /**
     * Meeting modules
     */
    meeting , 
    meetingType ,
    meetingPeople ,
    meetingRoom ,
    meetingRoomEquipment ,
    meetingRoomSeat ,
    meetingOrganization ,
    meetingCountesy ,
    meetingPosition
  },
  strict: debug,
  plugins: debug ? 
    [
      createLogger()
    ] : 
    [
      
    ]
})
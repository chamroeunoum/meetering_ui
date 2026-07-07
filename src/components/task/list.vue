<template>
  <div class="w-full p-4" >
  <!-- Top action panel of crud -->
    <div class="flex title-bar border-b border-gray-200">
      <!-- Title of crud -->
      <div class="flex w-64 h-10 py-1 title " >
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M4 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v9.883l-1 1.01V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4.085c.071.2.185.389.344.55l.441.45H6a2 2 0 0 1-2-2V4zm4 1.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0zM9.5 5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm0 4a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zM9 13.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm-2-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2zm10.855.352a.5.5 0 0 0-.71-.704l-3.643 3.68l-1.645-1.678a.5.5 0 1 0-.714.7l1.929 1.968a.6.6 0 0 0 .855.002l3.928-3.968z" fill="currentColor"></path></g></svg>
        <div class="font-moul ml-2 leading-9" v-html="model.title" ></div>
      </div>
      <!-- Actions button of the crud -->
      <div class="flex-grow action-buttons flex-row-reverse flex">
        <!-- New Button -->
        <div class="mt-1 ml-2">
          <n-button type="success" @click="showCreateModal()" >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M10 2.5a.5.5 0 0 0-1 0V9H2.5a.5.5 0 0 0 0 1H9v6.5a.5.5 0 0 0 1 0V10h6.5a.5.5 0 0 0 0-1H10V2.5z" fill="currentColor"></path></g></svg>
            </template>
            បន្ថែម
          </n-button>
        </div>
        <div class="w-2/5 relative" >
          <input type="text" @keypress.enter="filterRecords(false)" v-model="table.search" class="bg-gray-100 px-2 h-9 my-1 w-full rounded border border-gray-200 focus:border-blue-600 hover:border-blue-600 " placeholder="ស្វែងរក" />
          <svg class="absolute w-7 right-1 top-2 text-gray-400 hover:text-blue-700 cursor-pointer" @click="filterRecords(false)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M8.5 3a5.5 5.5 0 0 1 4.227 9.02l4.127 4.126a.5.5 0 0 1-.638.765l-.07-.057l-4.126-4.127A5.5 5.5 0 1 1 8.5 3zm0 1a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9z" fill="currentColor"></path></g></svg>
        </div>
        
      </div>
      <!-- Filter panel of crud -->
      <div class="filters-bar"></div>
    </div>
    <!-- Table of crud -->
    <div class="vcb-table-panel relative">
      <Transition name="fade" >
        <div v-if="Array.isArray( table.records.matched ) && table.records.matched.length > 0 " class="flex flex-wrap" >
          <div v-for="(record, index) in table.records.matched" :key='index' class="task w-1/5 p-2 " >
            <div class="task-board relative border border-gray-200 bg-gray-100 rounded flex flex-wrap p-4 pb-14 " >
              <n-tooltip trigger="hover">
                <template #trigger>
                  <div class="task-objective text-xs w-full text-left leading-6 mb-4" ><pre class="truncate" >{{ record.objective }}</pre></div>
                </template>
                <pre class="leading-7" >{{ record.objective }}</pre>
              </n-tooltip>
              <n-tooltip v-if="record.start" trigger="hover">
                <template #trigger>
                  <div  class="task-start text-xs w-1/2 text-left mb-4" >{{ record.start }}</div>
                </template>
                កាលបរិច្ឆែទចាប់ផ្ដើមការងារ
              </n-tooltip>
              <n-tooltip v-if="record.start" trigger="hover">
                <template #trigger>
                  <div v-if="record.end" class="task-end text-xs w-1/2 text-right mb-4" >{{ record.end }}</div>
                </template>
                កាលបរិច្ឆែទបញ្ចប់ការងារ 
              </n-tooltip>
              <n-tooltip v-if="record.creator" trigger="hover">
                <template #trigger>
                  <div v-if="record.minutes" class="task-end w-24 text-xs font-bold text-left mb-4" >{{ record.minutes }} នាទី</div>
                </template>
                រយះពេលបំពេញការងារ
              </n-tooltip>
              <n-tooltip v-if="record.creator" trigger="hover">
                <template #trigger>
                  <div class="creator bg-cover bg-center border border-gray-300 w-8 h-8 rounded-full -top-2 -right-2 absolute bg-white " :style=" 'background-image: url(' + record.creator.avatar_url + ');' " ></div>
                </template>
                ម្ចាស់ការងារ {{ record.creator.lastname + " " + record.creator.firstname }}
              </n-tooltip>
              <n-tooltip v-if="Array.isArray( record.assignors )" trigger="hover">
                <template #trigger>
                  <!-- <div class="creator w-8 h-8 bg-contain border border-gray-300 rounded-full -right-2 -top-2 absolute" :style=" 'background-image: url(' + record.creator.avatar_url + ');' " ></div> -->
                  <svg class="assignor w-5 h-5 mr-2 absolute right-0 bottom-4 text-blue-500 " xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm95.8 32.6L272 480l-32-136l32-56h-96l32 56l-32 136l-47.8-191.4C56.9 292 0 350.3 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-72.1-56.9-130.4-128.2-133.8z" fill="currentColor"></path></svg>
                </template>
                អ្នកប្រគល់ការងារ {{ record.assignors.map( (assignor) => { return assignor.lastname + ' ' + assignor.firstname }).join( ' ' ) }}
              </n-tooltip>
              
              <div class="task-actions-panel text-right w-40 absolute bottom-4 left-4 flex justify-start" >
                <n-tooltip v-if="isOwner(record.creator)" trigger="hover">
                  <template #trigger>
                    <svg class="w-6 mr-2 cursor-pointer text-red-500" @click="deleteAccount(record)" title="លុបគណនីនេះចោល" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352" fill="currentColor"></path><path d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v224"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M184 176l8 224"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M328 176l-8 224"></path></svg>
                  </template>
                  លុប
                </n-tooltip>
                <n-tooltip v-if="isOwner(record.creator)" trigger="hover">
                  <template #trigger>
                    <svg class="w-6 mr-2 cursor-pointer text-blue-500" @click="showEditModal(record)" title="កែប្រែព័ត៌មាន" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M13.245 2.817a2.783 2.783 0 0 1 4.066 3.796l-.13.14l-9.606 9.606a2.001 2.001 0 0 1-.723.462l-.165.053l-4.055 1.106a.5.5 0 0 1-.63-.535l.016-.08l1.106-4.054c.076-.28.212-.54.398-.76l.117-.128l9.606-9.606zm-.86 2.275L4.346 13.13a1 1 0 0 0-.215.321l-.042.123l-.877 3.21l3.212-.875a1 1 0 0 0 .239-.1l.107-.072l.098-.085l8.038-8.04l-2.521-2.52zm4.089-1.568a1.783 1.783 0 0 0-2.402-.11l-.12.11l-.86.86l2.52 2.522l.862-.86a1.783 1.783 0 0 0 .11-2.402l-.11-.12z" fill="currentColor"></path></g></svg>
                  </template>
                  កែប្រែ
                </n-tooltip>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <svg class="cursor-pointer text-blue-500 w-6 mr-2" @click="showAssigneeModal(record)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 640 512"><path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6c40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32S208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z" fill="currentColor"></path></svg>
                    <!-- <svg class="cursor-pointer text-blue-500 w-6 " xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path opacity=".3" d="M8.07 16c.09-.23.13-.39.91-.69c.97-.38 1.99-.56 3.02-.56s2.05.18 3.02.56c.77.3.81.46.91.69H8.07zM12 8c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1" fill="currentColor"></path><path d="M4 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1c-.99 0-1.93.21-2.78.58A2.01 2.01 0 0 0 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0 0 20 14c-.39 0-.76.04-1.13.1c.4.68.63 1.46.63 2.29V18H24v-1.57zm-7.76-2.78c-1.17-.52-2.61-.9-4.24-.9c-1.63 0-3.07.39-4.24.9A2.988 2.988 0 0 0 6 16.39V18h12v-1.61c0-1.18-.68-2.26-1.76-2.74zM8.07 16c.09-.23.13-.39.91-.69c.97-.38 1.99-.56 3.02-.56s2.05.18 3.02.56c.77.3.81.46.91.69H8.07zM12 8c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m0-2c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z" fill="currentColor"></path></svg> -->
                  </template>
                  អ្នកទទួលការងារ{{ record.assignees != null && record.assignees != undefined && record.assignees.length > 0 ? "មាន " + record.assignees.length + " នាក់": '' }}
                </n-tooltip>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <svg class="cursor-pointer w-6 mr-2 text-blue-500" @click="showChildTaskModal(record)" 
                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9 12h6"></path><path d="M12 9v6"></path></g></svg>
                  </template>
                  {{ record.childrenAllLevels != null && record.childrenAllLevels != undefined && record.childrenAllLevels.length > 0 ? 'មានអនុការងារ ' + record.childrenAllLevels.length + ' ផ្សេងទៀត' : 'បញ្ចូលអនុការងារ' }}
                </n-tooltip>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <!-- Loading -->
      <Transition name="slide-fade" >
        <div v-if="table.loading" class="table-loading fixed flex h-screen left-0 top-0 right-0 bottom-0 bg-white bg-opacity-80 ">
          <div class="flex mx-auto items-center">
            <div class="spinner">
              <svg class="animate-spin w-16 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48s48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.491-48-48-48z" fill="currentColor"></path></svg>
              <br/><br/>កំពុងអាន...
            </div>
          </div>
          <div class="absolute top-1 right-1 cursor-pointer bg-white rounded-full " @click="closeTableLoading" >
            <svg class="w-14 mx-auto text-red-500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 320L192 192"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 320l128-128"></path></svg>
          </div>
        </div>
      </Transition>
    </div>
    <!-- Pagination of crud -->
    <div v-if="Array.isArray( table.pagination.totalPages ) && table.pagination.totalPages.length > 0 " class="vcb-table-pagination">
      <!-- First -->
      <!-- Previous -->
      <div class="vcb-pagination-page" v-html='"<"' @click="previous()" ></div>
      <!-- Pages (7) -->
      <div v-for='item in table.pagination.totalPages' :key='item' class="vcb-pagination-page" @click="goTo(item)" >{{ item }}</div>
      <!-- Next -->
      <div class="vcb-pagination-page" v-html='">"' @click="next()" ></div>
      <!-- Last -->
      <!-- Go to -->
      <!-- Total per page -->
    </div>
    <!-- Form create account -->
    <create-form v-bind:model="model" v-bind:show="createModal.show" :onClose="closeCreateModal"/>
    <!-- Form update account -->    
    <update-form v-bind:model="model" v-bind:record="editRecord" v-bind:show="editModal.show" :onClose="closeEditModal"/>
    <child-task-form v-bind:model="model" v-bind:parent="editRecord" v-bind:show="childTaskModal.show" :onClose="closeChildTaskModal"/>
    <!-- Form select assignee -->
    <selected-assignee-form v-bind:model="model" v-bind:record="assigneeModalRecord" v-bind:show="assigneeModal.show" :onClose="closeAssigneeModal"/>
  </div>
</template>
<script>
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import Vue3Barcode from 'vue3-barcode'
import { getUser } from './../../plugins/authentication'
import { useDialog, useMessage, useNotification } from 'naive-ui'
/**
 * CRUD component form
 */
import CreateForm from './create.vue'
import UpdateForm from './update.vue'
import ChildTaskForm from './actions/child.vue'
import SelectedAssigneeForm from './actions/selectedassignee.vue'

export default {
  name: "User" ,
  components: {
    QrcodeVue ,
    Vue3Barcode,
    CreateForm,
    UpdateForm ,
    ChildTaskForm ,
    SelectedAssigneeForm
  },
  setup(){
    var store = useStore()
    const dialog = useDialog()
    const message = useMessage()
    const notify = useNotification()
    /**
     * Variables
     */    
    var model = reactive( {
      name: "task" ,
      title: "ការងារ"
    })
    var table = reactive( {
      loading: false ,
      search: '' ,
      records: {
        all: [] ,
        matched: []
      },
      columns: {
        searchable: {
          objective: '' ,
          start: '' ,
          end: '' ,
          amount: ''
        },
        format: {
          id: 0 ,
          objective: '' ,
          start: '' ,
          end: '' ,
          amount: '' ,
          amount_type: '' ,
          active: ''
        }
      } ,
      pagination: {
        perPage: 20 ,
        page: 1 ,
        totalPages: 0 ,
        totalRecords: 0
      }
    })

    

    function filterRecords(helper=true){
      if( helper ){
        table.records.matched = []
        if( table.search != "" ) {
          for(var index in table.records.all ){
            for(var field in table.records.all[index] ){
              if( (""+table.records.all[index][field]).includes( table.search ) !== false ) {
                table.records.matched.push( table.records.all[index] )
                break;
              }
            }
          }
        }
        if( table.records.matched.length <= 0 ) {
          table.records.matched = table.records.all
        }
      }else{
        setTimeout( goTo(1) , 500 )
      }
    }

    /**
     * Functions
     */
    function getRecords(){
      /**
       * Clear time interval after calling
       */
      window.clearTimeout()
      table.loading = true
      store.dispatch(model.name+'/list',{
        search: table.search ,
        perPage: table.pagination.perPage ,
        page: table.pagination.page
      }).then(res => {
        table.records.all = table.records.matched = res.data.records
        table.pagination = res.data.pagination
        closeTableLoading()
      }).catch( err => {
        console.log( err )
      })
    }
    function closeTableLoading(){
      table.loading = false
    }
    /**
     * Pagination functions
     */
    function previous(){
      goTo( table.pagination.page <= 1 ? 1 : table.pagination.page - 1 )
    }
    function next(){
      goTo( table.pagination.page >= table.pagination.totalPages ? table.pagination.totalPages : table.pagination.page + 1 )
    }
    function goTo(page){
      table.pagination.page = page > table.pagination.totalPages ? table.pagination.totalPages : ( page < 1 ? 1 : page)
      getRecords()
    }
    function updatePerpage(perPage){
      table.pagination.perPage = perPage < 5 ? 5 : ( perPage > 100 ? 100 : perPgae )
      table.pagination.page = 1
      getRecords()
    }

    function activateAccount(record){
      dialog.warning({
        title: "បិទ ឬ បើក គណនី" ,
        content: "តើអ្នកចង់ " + ( record.active == 1 ? "បិទ" : "បើក" )+ " គណនីនេះមែនទេ ?" ,
        positiveText: 'បាទ / ចាស',
        negativeText: 'ទេ',
        onPositiveClick: () => {
          store.dispatch( model.name+'/activate',{
            id: record.id ,
            active: parseInt( record.active ) == 1 ? 0 : 1
          }).then( res => {
            if( res.data.ok ){
              notify.success({
                title: 'ស្ថានភាពគណនី' ,
                description: 'ស្ថានភាពគណនីបានកែប្រែជោគជ័យ។' ,
                duration: 3000
              })
              getRecords()
            }else{
              notify.error({
                title: 'ស្ថានភាពគណនី' ,
                description: 'មានបញ្ហាក្នុងពេលកែប្រែស្ថានភាពគណនី។' ,
                duration: 3000
              })
            }
          }).catch( err => {
            message.error( err )
          })
        },
        onNegativeClick: () => {
          
        }
      })
    }
    /**
     * Create modal handling
     */
    var createModal = reactive({show:false})
    function showCreateModal(){
      createModal.show = true
    }

    function closeCreateModal(){
      createModal.show = false
      getRecords()
    }

    var editModal = reactive({show:false})
    var editRecord = reactive({
      objective: '' ,
      start: '' ,
      end: '' ,
      amount: '' ,
      minutes: 0 ,
      amount_type: '' ,
      active: ''
    })
    function showEditModal(record){
      editRecord.id = record.id
      editRecord.objective = record.objective
      editRecord.start = record.start
      editRecord.end = record.end
      editRecord.minutes = parseInt( record.minutes )
      editRecord.amount = parseFloat( record.amount )
      editRecord.amount_type = parseInt( record.amount_type )
      editRecord.active = parseInt( record.active )
      editModal.show = true
    }
    function closeEditModal(record){
      editModal.show = false
      getRecords()
    }

    function deleteAccount(record){
      dialog.warning({
        title: "លុបការងារ" ,
        content: "តើអ្នកចង់ លុប ការងារនេះមែនទេ ?" ,
        positiveText: 'បាទ / ចាស',
        negativeText: 'ទេ',
        onPositiveClick: () => {
          store.dispatch(model.name+'/delete',{id:record.id}).then( res => {
            if( res.data.ok ){
              notify.success({
                title: 'លុបការងារ' ,
                description: 'លុបបានរួចរាល់។' ,
                duration: 3000
              })
              getRecords()
            }else{
              notify.success({
                title: 'លុបការងារ' ,
                description: 'មានបញ្ហាក្នុងពេលលុបការងារ។' ,
                duration: 3000
              })
            }
        }).catch( err => {
          message.error( err )
        })
        },
        onNegativeClick: () => {
        }
      })
    }
  
    /**
     * Child meeting modal handle
     */

     var childTaskModal = reactive({show:false})
    function showChildTaskModal(record){
      childTaskModal.show = true
      editRecord.id = record.id
      editRecord.objective = record.objective
      editRecord.minutes = parseInt( record.minutes )
      editRecord.pid = record.pid
    }

    function closeChildTaskModal( ){
      childTaskModal.show = false
      if( !childTaskModal.show ){
        getRecords()
      }
    }

    var assigneeModal = reactive({show:false})
    var assigneeModalRecord = reactive({
      id: 0 ,
      assignees: []
    })
    function showAssigneeModal(record){
      assigneeModalRecord.id = record.id
      assigneeModalRecord.assignees = record.assignees
      assigneeModal.show = true
    }
    function closeAssigneeModal(){
      assigneeModal.show = false
      getRecords()
    }

    function isOwner( user ){
      let authUser = getUser()
      return authUser != undefined && authUser != null
        ? (
          authUser.id == user.id ? true : false
        ) 
        : false 
    }
    /**
     * Initial the data
     */
    getRecords()

    return {
      /**
       * Variables
       */
      model ,
      table ,
      childTaskModal ,
      /**
       * Table
       */
      filterRecords ,
      /**
       * Pagination functions
       */
      updatePerpage ,
      goTo ,
      previous ,
      next ,
      /**
       * Loading overlay
       */
      closeTableLoading ,
      /**
       * Creating
       */
      createModal ,
      showCreateModal ,
      closeCreateModal ,     
      /**
       * Editing
       */
      editModal ,
      showEditModal ,
      closeEditModal , 
      editRecord ,
      /**
       * Assignee modal
       */
      assigneeModal ,
      assigneeModalRecord ,
      showAssigneeModal ,
      closeAssigneeModal ,
      /**
       * Functions
       */
      activateAccount ,
      deleteAccount ,
      showChildTaskModal ,
      closeChildTaskModal ,
      isOwner
    }
  }
}

</script>
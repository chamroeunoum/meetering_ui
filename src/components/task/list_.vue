<template>
  <div class="w-full" >
    <div class="w-full leading-9 font-moul -mt-12 mb-4 text-left pl-16" v-html="model.title" ></div>
    <!-- Top action panel of crud -->
    <div class="flex w-full title-bar border-b px-4 border-gray-200 py-4 ">
      <!-- Title of crud -->
      <div class="flex w-64 h-10 py-1 title hidden" >
        <svg class="flex-none h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M16 8h14v2H16z" fill="currentColor"></path><path d="M6 10.59L3.41 8L2 9.41l4 4l8-8L12.59 4L6 10.59z" fill="currentColor"></path><path d="M16 22h14v2H16z" fill="currentColor"></path><path d="M6 24.59L3.41 22L2 23.41l4 4l8-8L12.59 18L6 24.59z" fill="currentColor"></path></svg>
        <div class="leading-9 font-moul" v-html="model.title" ></div>
      </div>
      <!-- Actions button of the crud -->
      <div class="flex-grow action-buttons flex-row-reverse flex p-2">
        <!-- New Button -->
        <div class="mt-1 ml-2">
          <n-button type="success" @click="showCreateModal()" >
            <template #icon>
              <n-icon>
                <Add20Regular />
              </n-icon>
            </template>
            បន្ថែម
          </n-button>
        </div>
        <!-- Search Button -->
        <div class="w-2/5 relative" >
          <input type="text" @keypress.enter="filterRecords(false)" v-model="table.search" class="bg-gray-100 px-2 h-9 my-1 w-full rounded border border-gray-200 focus:border-blue-600 hover:border-blue-600 " placeholder="ស្វែងរក" />
          <svg class="absolute right-1 top-2 w-7 text-gray-400" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M8.5 3a5.5 5.5 0 0 1 4.227 9.02l4.127 4.126a.5.5 0 0 1-.638.765l-.07-.057l-4.126-4.127A5.5 5.5 0 1 1 8.5 3zm0 1a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9z" fill="currentColor"></path></g></svg>
        </div>
      </div>
    </div>
    <!-- Table of crud -->
    <div class="vcb-table-panel">
      <Transition name="slide-fade" >
        <div class="vcb-table w-full" >
          <div class="flex w-full flex-wrap" >
            <table v-if="Array.isArray( table.records.matched ) && table.records.matched.length > 0 " class="vcb-table" >
              <thead>
              <tr class="vcb-table-headers" >
                <th class="vcb-table-header" >ល.រ</th>
                <th class="vcb-table-header">ខ្លឹមសារ</th>
                <th class="vcb-table-header">រយះពេល (នាទី)</th>
                <!-- <th class="vcb-table-header">ថ្ងៃប្រជុំ</th>
                <th class="vcb-table-header">ចាប់ផ្ដើម</th>
                <th class="vcb-table-header">បញ្ចប់</th>
                <th class="vcb-table-header">ប្រភេទប្រជុំ</th>
                <th class="vcb-table-header">ស្ថានភាព</th> -->
                <th class="vcb-table-header text-right w-24" >ប្រតិបត្តិការ</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(record, index) in table.records.matched" :key='index' class="vcb-table-row" >
                <td class="vcb-table-cell font-bold w-12" >{{ index + 1 }}</td>
                <td class="vcb-table-cell " >{{ record.objective }}</td>
                <td class="vcb-table-cell " >{{ record.minutes }}</td>
                <!-- <td class="vcb-table-cell w-40" >{{ record.date }}</td>
                <td  class="vcb-table-cell w-28" >{{ record.start }}</td>
                <td  class="vcb-table-cell w-28" >{{ record.end }}</td>
                <td class="vcb-table-cell w-48" >{{ record.type != undefined ? record.type.name : '' }}</td> -->
                <!-- <td class="vcb-table-cell w-24" >
                  <n-popselect
                    v-model:value="record.status"
                    :options="statuses"
                    size="medium"
                    scrollable
                    @update:value="updateMeetingStatus(record)"
                  >
                  <n-button class="mx-1" >{{ statuses.find( (g) => g.value == record.status ).label }}</n-button>  
                  </n-popselect>
                </td> -->
                <td class="vcb-table-actions-panel text-right " >
                  
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <svg class="cursor-pointer w-6 text-blue-500" @click="showChildMeetingModal(record)" 
                      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9 12h6"></path><path d="M12 9v6"></path></g></svg>
                    </template>
                    អនុការងារ
                  </n-tooltip>

                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <svg class="cursor-pointer w-6 text-blue-500" @click="showUpdateModal(record)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M21.03 2.97a3.578 3.578 0 0 1 0 5.06L9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L15.97 2.97a3.578 3.578 0 0 1 5.06 0zM15 6.06L5.062 16a.75.75 0 0 0-.193.333l-1.05 3.85l3.85-1.05A.75.75 0 0 0 8 18.938L17.94 9L15 6.06zm2.03-2.03l-.97.97L19 7.94l.97-.97a2.079 2.079 0 0 0-2.94-2.94z" fill="currentColor"></path></g></svg>
                    </template>
                    កែប្រែព័ត៌មាន
                  </n-tooltip>

                  <!-- <n-tooltip trigger="hover">
                    <template #trigger>
                      <svg class="cursor-pointer text-yellow-500" @click="inputPassword(record)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16"><g fill="none"><path d="M11 6a1 1 0 1 0 0-2a1 1 0 0 0 0 2z" fill="currentColor"></path><path d="M7.5 12v-.5h1A.5.5 0 0 0 9 11v-1h1a4 4 0 1 0-3.838-2.87L2.292 11a1 1 0 0 0-.292.707V13a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.5h1a.5.5 0 0 0 .5-.5zM7 6a3 3 0 1 1 3 3H8.5a.5.5 0 0 0-.5.5v1H7a.5.5 0 0 0-.5.5v.5h-1a.5.5 0 0 0-.5.5v1H3v-1.293l4.089-4.089a.5.5 0 0 0 .113-.534C7.072 6.748 7 6.384 7 6z" fill="currentColor"></path></g></svg>
                    </template>
                    ប្ដូរពាក្យសម្ងាត់សម្រាប់គណនីនេះ
                  </n-tooltip> -->

                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <svg class="cursor-pointer w-6 text-red-500" @click="destroy(record)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352" fill="currentColor"></path><path d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v224"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M184 176l8 224"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M328 176l-8 224"></path></svg>
                    </template>
                    លុបគណនីនេះចោល
                  </n-tooltip>
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <svg @click="showOtherModal(record)" class="cursor-pointer w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><circle cx="8" cy="16" r="2" fill="currentColor"></circle><circle cx="16" cy="16" r="2" fill="currentColor"></circle><circle cx="24" cy="16" r="2" fill="currentColor"></circle></svg>
                    </template>
                    ឯកសារផ្សេងៗ
                  </n-tooltip>
                </td>
              </tr>
              </tbody>
            </table>   
            <div v-else class="text-xl text-gray-500 text-center place-items-center place-content-center w-full h-60 flex" >
              មិនមានទិន្នន័យ។
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
    <Transition name="fade" >
      <!-- Pagination of crud -->
      <div v-if="table.pagination.buttons.length" class="fixed left-0 right-0 bottom-12 h-12 flex" >
        <div class="vcb-table-pagination ">
          <!-- First -->
          <!-- Previous -->
          <div class="vcb-pagination-page w-8 h-8 text-center align-middle leading-8 font-bold cursor-pointer" v-html='"<"' @click="previous()" ></div>
          <!-- Pages (7) -->
          <div v-for="(page, index) in table.pagination.buttons" :key="index" :class="'vcb-pagination-page pages h-8 mx-2 font-bold' + (table.pagination.page == page ? ' bg-blue-500 text-white  rounded-full' : '' )" @click="table.pagination.page == page ? false : goTo(page) " >
            <div class="page w-8 h-8 text-center align-middle leading-8 cursor-pointer">{{ page }}</div>
          </div>
          <!-- <div class="vcb-pagination-page pages h-8 mx-2 font-bold" @click="goToMonth(1) " >
            <div class="page w-8 h-8 text-center align-middle leading-8 cursor-pointer">1</div>
          </div> -->
          <!-- Next -->
          <div class="vcb-pagination-page w-8 h-8 text-center align-middle leading-8 font-bold cursor-pointer" v-html='">"' @click="next()" ></div>
          <!-- Last -->
          <!-- Go to -->
          <!-- Total per page -->
        </div>
      </div>
    </Transition>
    <!-- Pagination of crud -->
    <Transition name="fade" >
      <create-form v-bind:model="model" v-bind:show="createModal.show" :onClose="closeCreateModal"/>
    </Transition>
    <Transition name="fade" >
      <update-form v-bind:model="model" v-bind:record="editRecord" v-bind:show="updateModal.show" :onClose="closeUpdateModal"/>
    </Transition>
    <Transition name="fade" >
      <child-meeting-form v-bind:model="model" v-bind:parent="editRecord" v-bind:show="childMeetingModal.show" :onClose="closeChildMeetingModal"/>
    </Transition>
  </div>
</template>
<script>
import { isAuth, getUser , authLogout } from './../../plugins/authentication.js'
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import Vue3Barcode from 'vue3-barcode'
import VuePdfEmbed from 'vue-pdf-embed'
import { Switcher, Filter, DataStructured , ParentChild} from '@vicons/carbon'
import { Icon } from '@vicons/utils'
import { IosCheckmarkCircleOutline, IosRefresh } from '@vicons/ionicons4'
import { TrashOutline, CloseCircleOutline } from '@vicons/ionicons5'
import { useDialog, useMessage, useNotification } from 'naive-ui'
import { Edit20Regular, Key16Regular, Save20Regular, Add20Regular, Search20Regular , ContactCard28Regular, DocumentPdf24Regular, AppsList20Regular } from '@vicons/fluent'
import dateFormat from 'dateformat'
import CreateForm from './create.vue'
import UpdateForm from './update.vue'
import ChildMeetingForm from './child.vue'

export default {
  name: "Task" ,
  components: {
    ParentChild, 
    QrcodeVue ,
    Vue3Barcode,
    Switcher,
    Add20Regular ,
    DataStructured,
    Icon,
    IosCheckmarkCircleOutline,
    IosRefresh ,
    CloseCircleOutline ,
    Search20Regular ,
    Edit20Regular,
    Key16Regular,
    DocumentPdf24Regular ,
    Save20Regular ,
    TrashOutline ,
    ContactCard28Regular ,
    Filter ,
    VuePdfEmbed ,
    AppsList20Regular ,
    // Form
    CreateForm ,
    UpdateForm ,
    ChildMeetingForm
  },
  setup(){
    var store = useStore()
    const dialog = useDialog()
    const message = useMessage()
    const notify = useNotification()
    
    const statuses = reactive([
      {
        label: 'ថ្មី' ,
        value : 0 ,
      } ,
      {
        label: 'កំពុងប្រជុំ' ,
        value : 1
      } ,
      {
        label: 'នៅបន្ត' ,
        value : 2
      } ,
      {
        label: 'ប្ដូរ' ,
        value : 4
      } ,
      {
        label: 'ពន្យាពេល' ,
        value : 8
      } ,
      {
        label: 'ចប់' ,
        value : 16
      }
    ])
    /**
     * Variables
     */    
    const model = reactive( {
      name: "task" ,
      title: "ការងារ"
    })

    const table = reactive( {
      loading: false , 
      search: '' ,
      records: {
        all: [] ,
        matched: []
      },
      columns: {
        searchable: {
          objective: '' ,
          date: '' ,
          contact_info: ''
        },
        format: {
          id: 0 ,
          objective: '' ,
          date: '' ,
          start: new Date() ,
          end: new Date() ,
          actual_start: new Date() ,
          actual_end: new Date() ,
          contact_info: '' ,
          status : 0 ,
          created_by : null ,
          updated_by : null
        }
      } ,
      pagination: {
        perPage: 20 ,
        page: 1 ,
        totalPages: 0 ,
        totalRecords: 0 ,
        start: 0 ,
        end: 0 ,
        buttons: []
      }
    })
    const filterPanel = ref(false)

    const today = computed(() => {
      return dateFormat( new Date( attendantDate.value ) , 'yyyy-mm-dd' )
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
    
    const organizations = computed( () => {
      return store.getters['organization/getRecords'].map( ( o ) => { 
        return { label: o.name , value: o.id } 
      })
    })

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
        var paginationNumberList = 5
        if( ( table.pagination.page - ( paginationNumberList - 1 ) ) < 1 ){
          table.pagination.start = 1
          table.pagination.end = table.pagination.totalPages > 9 ? 9 : table.pagination.totalPages
        }
        else{
          table.pagination.start = table.pagination.page  - ( paginationNumberList - 1 )
          table.pagination.end = table.pagination.page + 4 >= table.pagination.totalPages ? table.pagination.totalPages : table.pagination.page + 4
        }
        /**
         * Create pagination buttons
         */
        table.pagination.buttons = []
        for(var i=table.pagination.start;i<=table.pagination.end;i++){
          table.pagination.buttons.push(i)
        }

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
    const paginationButtons = computed(()=>{
      /**
       * 9 Buttons is recommended
       */
      return table.pagination.totalPages ? table.pagination.totalPages : 0
    })

    /**
     * Mark the matched text with in search box
     */
     function applyTagMark(str){
      // Split the string by whitespace
      if( table.search.trim() != "" ){
        var arrStrSearch = table.search.split(/(\s+)/).filter( e => e.trim().length > 0).map( e => e.replaceAll(" ","") )
        for( var i in arrStrSearch ){
          if( str.includes( arrStrSearch[i] ) ) str = str.replaceAll( arrStrSearch[i] , '<mark>' + arrStrSearch[i] + '</mark>' ) 
        }
      }
      return str
    }

    function getStatusLabel( code ){
      let status = statuses.find( s => s.code == code )
      return status != undefined ? status.label : "មិនមាន"
    }

    /**
     * Create modal handling
     */
    var createModal = reactive({show:false})
    function showCreateModal(){
      createModal.show = true
    }

    function closeCreateModal( ){
      createModal.show = false
      if( !createModal.show ){
        getRecords()
      }
    }

    /**
     * Edit modal handling
     */
     var updateModal = reactive({show:false})
    function showUpdateModal(record){
      updateModal.show = true
      editRecord.id = record.id
      editRecord.objective = record.objective
      editRecord.minutes = record.minutes > 0 ? record.minutes : 0 
      
    }

    function closeUpdateModal( ){
      updateModal.show = false
      if( !updateModal.show ){
        getRecords()
      }
    }

    /**
     * Edit record
     */
    const editRecord = reactive({
      id: 0 ,
      objective: '' ,
      minutes : 0 ,
      pid: 0
    })

    /**
     * Other modal handling
     */
    var otherModal = reactive({show:false})
    function showOtherModal(record){
      otherModal.show = true
      editRecord.id = record.id
      editRecord.objective = record.objective
      editRecord.minutes = record.minutes
    }

    function closeOtherModal( ){
      otherModal.show = false
      if( !otherModal.show ){
        getRecords()
      }
    }

    /**
     * Child meeting modal handle
     */

    var childMeetingModal = reactive({show:false})
    function showChildMeetingModal(record){
      childMeetingModal.show = true
      editRecord.id = record.id
      editRecord.objective = record.objective
      editRecord.minutes = parseInt( record.minutes )
      editRecord.pid = record.pid
    }

    function closeChildMeetingModal( ){
      childMeetingModal.show = false
      if( !childMeetingModal.show ){
        getRecords()
      }
    }


    function destroy(record){
      dialog.warning({
        title: "លុបកិច្ចប្រជុំ" ,
        content: "តើអ្នកចង់ លុប កិច្ចប្រជុំនេះមែនទេ ?" ,
        positiveText: 'បាទ / ចាស',
        negativeText: 'ទេ',
        onPositiveClick: () => {
          store.dispatch(model.name+'/delete',{id:record.id}).then( res => {
            if( res.data.ok ){
              notify.success({
                title: 'លុបកិច្ចប្រជុំ' ,
                description: 'លុបបានរួចរាល់។' ,
                duration: 3000
              })
              getRecords()
            }else{
              notify.success({
                title: 'លុបកិច្ចប្រជុំ' ,
                description: 'មានបញ្ហាក្នុងពេលលុបកិច្ចប្រជុំ។' ,
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

    function updateMeetingStatus(record){
      store.dispatch( model.name+'/update',{
        id: record.id ,
        objective: record.objective ,
        date: record.date  ,
        start: record.start ,
        end: record.end ,
        status: record.status ,
        type_id: record.type_id ,
        contact_info : record.contact_info
      }).then( res => {
        switch( res.status ){
          case 200 : 
          message.success("រួចរាល់។")
          break;
        }
      }).catch( err => {
        console.log( err )
        notify.error({
          'title' : 'រក្សារទុកព័ត៌មាន' ,
          'description' : 'មានបញ្ហាក្នុងពេលកែប្រែស្ថានភាពប្រជុំ។' ,
          duration : 3000
        })
      })
    }

    // function getOrganizations(){
    //   store.dispatch('organization/list',{page:1, perPage : 1000 , search : '' })
    //   .then( res => {
    //     store.commit('organization/setRecords', res.data.records)
    //   }).catch( err => {
    //     notify.error( err )
    //   })
    // }

    

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
      filterPanel ,
      updateMeetingStatus ,
      /**
       * module variable
       */
      statuses ,
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
      paginationButtons ,
      /**
       * Loading overlay
       */
      closeTableLoading ,
      /**
       * Functions
       */
      applyTagMark ,
      /**
       * Module functions
       */
      getStatusLabel ,

      /**
       * Create modal
       */
      closeCreateModal ,
      showCreateModal ,
      createModal ,

      /**
       * Update modal
       */
      closeUpdateModal ,
      showUpdateModal ,
      updateModal ,

      /**
       * Child meeting modal
       */
      closeChildMeetingModal ,
      showChildMeetingModal ,
      childMeetingModal ,

      /**
       * Other modal
       */
      closeOtherModal ,
      showOtherModal ,
      otherModal ,

      /**
       * Edit record
       */
      editRecord ,

      /**
       * Record function
       */
      destroy
    }
  }
}

</script>

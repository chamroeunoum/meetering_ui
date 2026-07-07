<template>
  <div class="relative" >
    <!-- Top action panel of crud -->
    <div class="flex title-bar border-b border-gray-200 p-2 h-12 ">
      <div class="flex w-64 h-8 title " >
        <svg class="flex-none w-8 h-8 text-yellow-600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M7.167 3c.27 0 .535.073.765.21l.135.09l1.6 1.2H15.5a2.5 2.5 0 0 1 2.479 2.174l.016.162L18 7v7.5a2.5 2.5 0 0 1-2.336 2.495L15.5 17h-11a2.5 2.5 0 0 1-2.495-2.336L2 14.5v-9a2.5 2.5 0 0 1 2.336-2.495L4.5 3h2.667zm.99 4.034a1.5 1.5 0 0 1-.933.458l-.153.008L3 7.499V14.5a1.5 1.5 0 0 0 1.356 1.493L4.5 16h11a1.5 1.5 0 0 0 1.493-1.355L17 14.5V7a1.5 1.5 0 0 0-1.355-1.493L15.5 5.5H9.617l-1.46 1.534zM7.168 4H4.5a1.5 1.5 0 0 0-1.493 1.356L3 5.5v.999l4.071.001a.5.5 0 0 0 .302-.101l.06-.054L8.694 5.02L7.467 4.1a.5.5 0 0 0-.22-.093L7.167 4z" fill="currentColor"></path></g></svg>
        <div class="font-moul ml-2 h-8 leading-9" v-html="model.title" ></div>
      </div>
      <div class="flex-grow action-buttons flex-row-reverse flex">
        <div class="ml-2 flex flex-wrap">
          <!-- <n-tooltip trigger="hover">
            <template #trigger>
              <svg class="w-8 h-8 cursor-pointer text-blue-500 duration-300" @click="showCreateModal" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M9 12h6"></path><path d="M12 9v6"></path></g></svg>
            </template>
            បន្ថែមទិន្នន័យថ្មី
          </n-tooltip> -->
        </div>
        <div class="w-3/5 md:w-2/5 relative h-8 " >
          <n-tooltip trigger="hover">
            <template #trigger>
              <div class="w-full relative" >
                <input type="text" @keypress.enter="getRecords" v-model="pagination.search" class="bg-gray-100 px-2 h-8 w-full rounded border border-gray-200 focus:border-blue-600 hover:border-blue-600 duration-300" placeholder="ស្វែងរក" />
                <svg class="absolute right-1 top-1 w-6 h-6 text-gray-400  cursor-pointer" @click="getRecords" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M8.5 3a5.5 5.5 0 0 1 4.227 9.02l4.127 4.126a.5.5 0 0 1-.638.765l-.07-.057l-4.126-4.127A5.5 5.5 0 1 1 8.5 3zm0 1a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9z" fill="currentColor"></path></g></svg>
              </div>
            </template>
            សូមបញ្ចូលពាក្យគន្លឹះដើម្បីស្វែងរក
          </n-tooltip>
        </div>
        <div class="ml-2 flex flex-wrap">
          <n-tooltip trigger="hover">
            <template #trigger>
              <svg 
              class="mx-2 w-8 h-8 p-1 bg-white rounded-full border border-yellow-300 cursor-pointer text-yellow-500 duration-300"
              @click="toggleFilter" 
              xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M18 28h-4a2 2 0 0 1-2-2v-7.59L4.59 11A2 2 0 0 1 4 9.59V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v3.59a2 2 0 0 1-.59 1.41L20 18.41V26a2 2 0 0 1-2 2zM6 6v3.59l8 8V26h4v-8.41l8-8V6z" fill="currentColor"></path></svg>
            </template>
            សម្រង់ទិន្នន័យ
          </n-tooltip>
        </div>
      </div>
    </div>
    <!-- Table of crud -->
    <div class="vcb-table-panel relative h-screen ">
      <Transition name="slide-fade" >
        <div v-if="Array.isArray( records.matched ) && records.matched.length > 0 " class="vcb-thumbnail mb-24" >
          <div v-for="(record, index) in records.matched" :key='index' class="item " >
            <div class="content " >
              <div v-if="record.image != false && record.image != null && record.image != undefined " class="image-stick-top-left bg-80% bg-cover bg-center bg-no-repeat " :style=" 'background-image: url(' + record.image +');' " ></div>
              <div v-if="record.image == false || record.image == null || record.image == undefined " class="image-stick-top-left bg-contain bg-center bg-no-repeat " :style=" 'background-image: url('+$assets('logo.png')+');' " ></div>
              <div class="flex flex-wrap " >
                <div class="w-full pt-2 pb-4" >
                  <div class="w-full text-center font-moul mx-auto mb-4" >{{  record.year + " " + record.fid }}</div>
                  <div class="w-full text-center leading-6 tracking-wider" v-html="applyTagMark( record.objective )" ></div>
                </div>
              </div>
              <thumbnail-actions-form v-bind:crud="crud" v-bind:model="model" v-bind:record="record" :onClose="closeActions" />
            </div>
          </div>
        </div>
      </Transition>
      <Transition name="slide-fade" >
        <div v-if="!Array.isArray( records.matched ) || ( Array.isArray( records.matched ) && records.matched.length <= 0 ) " class="mt-24 text-lg text-gray-600" >មិនមានព័ត៌មានសម្រាប់បង្ហាញឡើយ។</div>
      </Transition>
      <!-- Pagination of crud -->
      <Transition name="slide-fade" >
        <div v-if="pagination.totalPages > 1 " class="fixed left-0 right-0 bottom-14 flex flex-wrap" >
          <div class="vcb-table-pagination bg-blue-300 mx-auto">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-popselect 
                  trigger="click"
                  v-model:value="pagination.perPage"
                  :options="[
                    { label: 5 , value: 5 } ,
                    { label: 10 , value: 10 } ,
                    { label: 20 , value: 20 } ,
                    { label: 30 , value: 30 } ,
                    { label: 40 , value: 40 } ,
                    { label: 50 , value: 50 } ,
                    { label: 100 , value: 100 } ,
                    { label: 200 , value: 200 } ,
                    { label: 500 , value: 500 } ,
                  ]"
                  size="small"
                  scrollable
                  @update:value="goTo(1)"
                >
                  <div class="cursor-pointer font-pvh rounded-full p-2 px-4 border border-gray-200 text-blue-600" >{{ $toKhmer( pagination.perPage ) }}</div>
                </n-popselect>
              </template>
              ចំនួនព័ត៌មានបង្ហាញម្ដង
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <div class="vcb-table-pagination-info font-pvh " >{{ pagination.totalPages > 0 ? $toKhmer( pagination.totalPages ) + " ទំព័រ" : "" }}</div>
              </template>
              ចំនួនទំព័រសរុប
            </n-tooltip>
            <div v-for="(page, index) in pagination.buttons" :key="index" :class=" (pagination.page == page ? ' vcb-pagination-page-active ' : ' vcb-pagination-page ' )" @click="pagination.page == page ? false : goTo(page) " >
              <n-tooltip trigger="hover">
                <template #trigger>
                  <div class="leading-8 text-md font-pvh " >{{ $toKhmer( page ) }} </div>
                </template>
                ទំព័រទី {{ $toKhmer( page ) }}
              </n-tooltip>
            </div>
            <Transition name="slide-fade" >
              <div v-if="pagination.page > 1 " class="vcb-pagination-page " v-html='"<"' @click="previous" ></div>
            </Transition>
            <Transition name="slide-fade" >
              <div v-if="pagination.page < pagination.totalPages " class="vcb-pagination-page " v-html='">"' @click="next" ></div>
            </Transition>
          </div>
        </div>
      </Transition>
      <Transition name="slide-fade" >
        <div v-if="crudLoading" class="table-loading absolute flex left-0 top-0 right-0 bottom-0 bg-white bg-opacity-90 ">
          <div class="flex mx-auto items-center">
            <div class="spinner">
              <svg class="animate-spin w-16 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48s48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.491-48-48-48z" fill="currentColor"></path></svg>
              <br/><br/>កំពុងអាន...
            </div>
          </div>
          <div class="absolute top-2 right-2 cursor-pointer bg-white rounded-full " @click="closeTableLoading" >
            <svg class="w-10 mx-auto text-red-500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 320L192 192"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 320l128-128"></path></svg>
          </div>
        </div>
      </Transition>
    </div>
    <!-- Filter panel of crud -->
    <Transition name="slide-fade" >
      <div v-if="filter" class="vcb-filters-panel">
        <n-tooltip trigger="hover" >
          <template #trigger>
            <svg 
              @click="toggleFilter" 
              class="absolute bg-white rounded-full shadow p-1 right-2 top-2 w-10 h-10 border border-gray-200 cursor-pointer hover:text-green-500 duration-300" 
              xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z" fill="currentColor"></path></svg>
          </template>
          បិទផ្ទាំងចម្រោះព័ត៌មាន
        </n-tooltip>
        <div class="filter-title font-moul" >សូមជ្រើសរើសលក្ខណ សម្រង់ទិន្នន័យ៖</div>
        <div class="filter-actions" >
          <div class="filter-action" >លក្ខណចម្រោះទី ១</div>
          <div class="filter-action" >លក្ខណចម្រោះទី ២</div>
        </div>
      </div>
    </Transition>
    <!-- Form create account -->
    <create-form v-bind:model="model" v-bind:show="createModal.show" :onClose="closeCreateModal"/>
  </div>
</template>
<script>
import Crud from '@classes/Crud.js'
import { reactive ,ref , onMounted , computed } from 'vue'
import { useStore } from 'vuex'
import QrcodeVue from 'qrcode.vue'
import Vue3Barcode from 'vue3-barcode'
import { useDialog, useMessage, useNotification } from 'naive-ui'

/**
 * CRUD component form
 */

import ThumbnailActionsForm from './../actions/thumbnail-action.vue'
import CreateForm from './../widgets/create.vue'
export default {
  name: "CRUDThumbnail" ,
  components: {
    QrcodeVue ,
    Vue3Barcode,
    ThumbnailActionsForm ,
    CreateForm
  },
  props: {
    model: {
      required: true ,
      default: () => {
        return reactive({
          name: 'folder' ,
          modules: 'folders' ,
          title: 'ថតឯកសារ'
        })
      }
    }
  },
  setup(props){
    const store = useStore()
    const dialog = useDialog()
    const message = useMessage()
    const notify = useNotification()
    const crud = ref(null)

    const server = ref( store.getters[ props.model.name + '/server'] )
    const pagination = ref( store.getters[ props.model.name + '/pagination'] )
    const columns = ref( store.getters[ props.model.name + '/columns'] )
    const records = ref( store.getters[ props.model.name + '/records' ] )

    const crudLoading = ref(false)
    function getRecords(){
      crudLoading.value = true
      crud.value.list( 
        {
          ids: Array.isArray( pagination.value.ids ) && pagination.value.ids.length > 0 ? pagination.value.ids : [] ,
          page: parseInt( pagination.value.page ) > 0 ? parseInt( pagination.value.page ) : 1 ,
          perPage: parseInt( pagination.value.perPage ) > 0 ? parseInt( pagination.value.perPage ) : 10 ,
          search : pagination.value.search != null && pagination.value.search != undefined && pagination.value.search != "" ? pagination.value.search : "" ,
        },
        ( res ) => {
          pagination.value = crud.value.getPagination()
          records.value = store.getters[ props.model.name + '/records' ]
          window.clearTimeout()
          closeTableLoading()
        },
        ( error ) => {
          closeTableLoading()
        }
      )
    }

    function previous(){
      goTo( pagination.value.page <= 1 ? 1 : pagination.value.page - 1 )
    }

    function next(){
      goTo( pagination.value.page >= pagination.value.totalPages ? pagination.value.totalPages : pagination.value.page + 1 )
    }

    function goTo(page){
      pagination.value.page = parseInt( page ) > 0 ? parseInt( page ) : 1
      getRecords()
    }

    /**
     * Create modal handling
     */
    var createModal = reactive({show:false})
    function showCreateModal(){
      createModal.show = true
    }

    function closeCreateModal( actionStatus ){
      createModal.show = false
      if( parseInt( actionStatus ) > 0 ) getRecords()
    }

    const filter = ref(false)    
    function toggleFilter(){
      filter.value = !filter.value
    }
  
    function closeTableLoading(){
      crudLoading.value = false
    }
    function closeActions( actionStatus ){
      if( parseInt( actionStatus ) > 0 ) getRecords()
    }

    const search = ref(null)

    function filterRecords(helper){
      crud.value.list(
        ( res ) => {
          // Success
        } ,
        {
          ids: [] ,
          page : 1 ,
          perPage : crud.value.getPerPage() ,
          search : search.value
        } ,
        ( err ) => {
          console.log( err )
        }
      )
    }

    /**
     * Mark the matched text with in search box
     */
    function applyTagMark(str){
      // Split the string by whitespace
      if( pagination.value.search != undefined && pagination.value.search.trim() != "" ){
        var arrStrSearch = pagination.value.search.split(/(\s+)/).filter( e => e.trim().length > 0).map( e => e.replaceAll(" ","") )
        for( var i in arrStrSearch ){
          if( str.includes( arrStrSearch[i] ) ) str = str.replaceAll( arrStrSearch[i] , '<mark>' + arrStrSearch[i] + '</mark>' ) 
        }
      }
      return str
    }

    function initial(){
      store.commit( props.model.name+"/setColumns", [ 'id' , 'name' , 'desp' , 'active' , 'image' , 'pdf' , 'pid' , 'tpid' ] )
      store.commit( props.model.name+"/setModel", props.model )

      crud.value = new Crud()
      crud.value.setConfig( import.meta.env.VITE_API_SERVER , store.getters[props.model.name+'/model'] , store.getters[props.model.name+'/columns'].all )
      getRecords()
    }

    onMounted( () => {
      initial()
    })

    return {
      // Variables
      crud ,
      crudLoading ,
      /**
       * Computed Property from store
       */
      records ,
      columns ,
      pagination ,
      // Functions
      closeActions ,
      closeTableLoading ,
      /**
       * Variables
       */
      search ,
      /**
       * Create Modal
       */
      createModal ,
      showCreateModal,
      closeCreateModal ,
      /**
       * Records Functions
       */
      getRecords ,
      applyTagMark ,
      filter, 
      toggleFilter ,
      previous ,
      next ,
      goTo
    }
  }
}

</script>
<style type="text/css" scoped >
.vcb-thumbnail {
  @apply flex flex-wrap justify-center;
}
.vcb-thumbnail .item {
  @apply 2xl:w-1/5 xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/3 w-1/2 p-2 py-4 ;
}
.vcb-thumbnail .item .content {
  @apply border rounded-lg hover:shadow duration-500 p-4 relative hover:scale-105 transform-gpu bg-white;
}
.vcb-thumbnail .item .content .image {
  @apply border rounded-full border-gray-200 p-2 w-20 h-20 flex-none mx-auto overflow-hidden bg-white ;
}
.vcb-thumbnail .item .content .image-stick-top-left {
  @apply absolute left-2 -top-5 border rounded-full border-gray-200 p-2 w-10 h-10 flex-none mx-auto overflow-hidden bg-white z-50;
}
.vcb-table-pagination-info {
  @apply text-blue-600 leading-7 p-1 mx-1 ;
}
.vcb-filters-panel {
  @apply fixed left-0 top-0 right-0 bottom-0 bg-opacity-90 p-12 bg-gray-100;
}
.vcb-filters-panel .filter-title {
  @apply w-full text-left ;
}
.vcb-filters-panel .filter-actions {
  @apply w-full text-left p-4 flex flex-wrap justify-center;
}
.vcb-filters-panel .filter-actions .filter-action {
  @apply p-2 m-2 bg-white rounded-sm border border-gray-300 w-4/6 sm:w-2/5 md:w-1/3 lg:w-1/4 xl:w-2/6 ;
}
</style>
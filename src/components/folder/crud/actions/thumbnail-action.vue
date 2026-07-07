<template>
  <div class="actions z-40" >
    <Transition name="slide-fade" >
      <div v-if="show" class="panel" >
        <n-tooltip trigger="hover">
          <template #trigger>
            <svg class="action text-red-500" @click="showPdfModal(record)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M531.3 574.4l.3-1.4c5.8-23.9 13.1-53.7 7.4-80.7c-3.8-21.3-19.5-29.6-32.9-30.2c-15.8-.7-29.9 8.3-33.4 21.4c-6.6 24-.7 56.8 10.1 98.6c-13.6 32.4-35.3 79.5-51.2 107.5c-29.6 15.3-69.3 38.9-75.2 68.7c-1.2 5.5.2 12.5 3.5 18.8c3.7 7 9.6 12.4 16.5 15c3 1.1 6.6 2 10.8 2c17.6 0 46.1-14.2 84.1-79.4c5.8-1.9 11.8-3.9 17.6-5.9c27.2-9.2 55.4-18.8 80.9-23.1c28.2 15.1 60.3 24.8 82.1 24.8c21.6 0 30.1-12.8 33.3-20.5c5.6-13.5 2.9-30.5-6.2-39.6c-13.2-13-45.3-16.4-95.3-10.2c-24.6-15-40.7-35.4-52.4-65.8zM421.6 726.3c-13.9 20.2-24.4 30.3-30.1 34.7c6.7-12.3 19.8-25.3 30.1-34.7zm87.6-235.5c5.2 8.9 4.5 35.8.5 49.4c-4.9-19.9-5.6-48.1-2.7-51.4c.8.1 1.5.7 2.2 2zm-1.6 120.5c10.7 18.5 24.2 34.4 39.1 46.2c-21.6 4.9-41.3 13-58.9 20.2c-4.2 1.7-8.3 3.4-12.3 5c13.3-24.1 24.4-51.4 32.1-71.4zm155.6 65.5c.1.2.2.5-.4.9h-.2l-.2.3c-.8.5-9 5.3-44.3-8.6c40.6-1.9 45 7.3 45.1 7.4zm191.4-388.2L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494z" fill="currentColor"></path></svg>
          </template>
          ឯកសារយោង
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <svg class="action text-blue-500" @click="showPictureModal(record)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><rect x="48" y="80" width="416" height="352" rx="48" ry="48" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"></rect><circle cx="336" cy="176" r="32" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></circle><path d="M304 335.79l-90.66-90.49a32 32 0 0 0-43.87-1.3L48 352" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path d="M224 432l123.34-123.34a32 32 0 0 1 43.11-2L464 368" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path></svg>
          </template>
          រូបតំណាង
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <svg class="action text-blue-500" @click="showDetailModal(record)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 28 28"><g fill="none"><path d="M15 11.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75zm.75 3.25a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5zm-4.5-3.25a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0zM7 14.5h5a1 1 0 0 1 1 1v.5s-.5 2.5-3.5 2.5S6 16 6 16v-.5a1 1 0 0 1 1-1zM2.004 6.75A2.75 2.75 0 0 1 4.754 4H23.25A2.75 2.75 0 0 1 26 6.75v14.5A2.75 2.75 0 0 1 23.25 24H4.755a2.75 2.75 0 0 1-2.75-2.75V6.75zm2.75-1.25c-.69 0-1.25.56-1.25 1.25v14.5c0 .69.56 1.25 1.25 1.25H23.25c.69 0 1.25-.56 1.25-1.25V6.75c0-.69-.56-1.25-1.25-1.25H4.755z" fill="currentColor"></path></g></svg>
          </template>
          ព័ត៌មានលម្អិត
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <svg class="action text-blue-500 " @click="showEditModal(record)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M4 15h5.986c-.227.3-.4.639-.51 1H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5.232c-.326.14-.631.343-.897.609L15 9.944V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1zm8-9.5a.5.5 0 0 1 1 0v6.444l-.88.88A.498.498 0 0 1 12 12.5v-7zm-7 2a.5.5 0 0 1 1 0v5a.5.5 0 0 1-1 0v-5zM9 9a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-3A.5.5 0 0 0 9 9zm1.98 6.377l4.83-4.83a1.87 1.87 0 1 1 2.645 2.646l-4.83 4.829a2.197 2.197 0 0 1-1.02.578l-1.498.374a.89.89 0 0 1-1.079-1.078l.375-1.498c.096-.386.296-.74.578-1.02z" fill="currentColor"></path></g></svg>
          </template>
          កែប្រែ
        </n-tooltip>
        <!-- <n-tooltip trigger="hover">
          <template #trigger>
            <svg class="action text-yellow-500 " @click="inputPassword(record)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16"><g fill="none"><path d="M11 6a1 1 0 1 0 0-2a1 1 0 0 0 0 2z" fill="currentColor"></path><path d="M7.5 12v-.5h1A.5.5 0 0 0 9 11v-1h1a4 4 0 1 0-3.838-2.87L2.292 11a1 1 0 0 0-.292.707V13a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.5h1a.5.5 0 0 0 .5-.5zM7 6a3 3 0 1 1 3 3H8.5a.5.5 0 0 0-.5.5v1H7a.5.5 0 0 0-.5.5v.5h-1a.5.5 0 0 0-.5.5v1H3v-1.293l4.089-4.089a.5.5 0 0 0 .113-.534C7.072 6.748 7 6.384 7 6z" fill="currentColor"></path></g></svg>
          </template>
          ប្ដូរពាក្យសម្ងាត់
        </n-tooltip> -->
        <n-tooltip trigger="hover">
          <template #trigger>
            <svg class="action text-red-500" @click="deleteAccount(record)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352" fill="currentColor"></path><path d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v224"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M184 176l8 224"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M328 176l-8 224"></path></svg>              
          </template>
          លុបគណនី
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <svg :class="'action ' + ( parseInt( record.active ) == 1 ? ' text-green-500 ' : ' text-gray-500 ') " @click="toggleActive(record)" :title="record.active == 1 ? 'គណនីនេះកំពុងបើកតំណើរការ' : 'គណនីនេះកំពុងត្រូវបានបិទមិនអាចប្រើប្រាស់បាន' "  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0z" fill="currentColor"></path></svg>
          </template>
          បិទ និង បើក គណនី
        </n-tooltip>  
      </div>
    </Transition>
    <n-tooltip v-if="show" trigger="hover">
      <template #trigger>
        <div class="action-toggle bg-blue-500 text-gray-50" @click="toggleActions" >
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M8.12 14.71L12 10.83l3.88 3.88a.996.996 0 1 0 1.41-1.41L12.7 8.71a.996.996 0 0 0-1.41 0L6.7 13.3a.996.996 0 0 0 0 1.41c.39.38 1.03.39 1.42 0z" fill="currentColor"></path></svg>
        </div>
      </template>
      បិទមុខងារផ្សេងៗ
    </n-tooltip>
    <n-tooltip v-if="!show" trigger="hover">
      <template #trigger>
        <div class="action-toggle bg-gray-200 hover:bg-blue-500 duration-500 hover:text-gray-50" @click="toggleActions" >
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M8.12 9.29L12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0z" fill="currentColor"></path></svg>
        </div>
      </template>
      មុខងារផ្សេងៗ
    </n-tooltip>
    <n-tooltip v-if="!show" trigger="hover">
      <template #trigger>
        <div :class=" 'record-status ' + ( parseInt( record.active ) == 1 ? ' text-green-500 ' : ' text-gray-500 ') " @click="toggleActions" >
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z" fill="currentColor"></path><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z" fill="currentColor"></path></svg>
        </div>
      </template>
      ស្ថានភាពព័ត៌មាន ៖ {{ ( parseInt( record.active ) == 1 ? ' កំពុងប្រើប្រាស់ ' : ' បិទការប្រើប្រាស់ ') }}
    </n-tooltip>
    <n-tooltip v-if="!show && record.pdf == true" trigger="hover">
      <template #trigger>
        <div class="record-pdf text-red-500 " @click="showPdfPreviewModal" >
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><path d="M531.3 574.4l.3-1.4c5.8-23.9 13.1-53.7 7.4-80.7c-3.8-21.3-19.5-29.6-32.9-30.2c-15.8-.7-29.9 8.3-33.4 21.4c-6.6 24-.7 56.8 10.1 98.6c-13.6 32.4-35.3 79.5-51.2 107.5c-29.6 15.3-69.3 38.9-75.2 68.7c-1.2 5.5.2 12.5 3.5 18.8c3.7 7 9.6 12.4 16.5 15c3 1.1 6.6 2 10.8 2c17.6 0 46.1-14.2 84.1-79.4c5.8-1.9 11.8-3.9 17.6-5.9c27.2-9.2 55.4-18.8 80.9-23.1c28.2 15.1 60.3 24.8 82.1 24.8c21.6 0 30.1-12.8 33.3-20.5c5.6-13.5 2.9-30.5-6.2-39.6c-13.2-13-45.3-16.4-95.3-10.2c-24.6-15-40.7-35.4-52.4-65.8zM421.6 726.3c-13.9 20.2-24.4 30.3-30.1 34.7c6.7-12.3 19.8-25.3 30.1-34.7zm87.6-235.5c5.2 8.9 4.5 35.8.5 49.4c-4.9-19.9-5.6-48.1-2.7-51.4c.8.1 1.5.7 2.2 2zm-1.6 120.5c10.7 18.5 24.2 34.4 39.1 46.2c-21.6 4.9-41.3 13-58.9 20.2c-4.2 1.7-8.3 3.4-12.3 5c13.3-24.1 24.4-51.4 32.1-71.4zm155.6 65.5c.1.2.2.5-.4.9h-.2l-.2.3c-.8.5-9 5.3-44.3-8.6c40.6-1.9 45 7.3 45.1 7.4zm191.4-388.2L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494z" fill="currentColor"></path></svg>
        </div>
      </template>
      ឯកសារយោង
    </n-tooltip>
    <!-- Form update account -->
    <update-form v-bind:model="model" v-bind:record="record" v-bind:show="editModal.show" :onClose="closeUpdate"/>
    <!-- Form update account -->
    <detail-form v-bind:model="model" v-bind:record="record" v-bind:show="detailModal.show" :onClose="closeDetail"/>
    <!-- Form upload picture -->
    <picture-form v-bind:model="model" v-bind:record="record" v-bind:show="pictureModal.show" :onClose="closePicture"/>
    <!-- Form upload pdf -->
    <pdf-form v-bind:model="model" v-bind:record="record" v-bind:show="pdfModal.show" :onClose="closePdf"/>
    <!-- Form upload pdf -->
    <pdf-preview-form v-bind:model="model" v-bind:record="record" v-bind:show="pdfPreviewModal.show" :onClose="closePdfPreview"/>
  </div>
</template>
<script>
import { reactive ,ref } from 'vue'
import { useStore } from 'vuex'
import { useDialog, useMessage, useNotification } from 'naive-ui'
import UpdateForm from './../widgets/update.vue'
import DetailForm from './../widgets/detail.vue'
import PictureForm from './../widgets/picture.vue'
import PdfForm from './../widgets/pdf.vue'
import PdfPreviewForm from './../widgets/pdfpreview.vue'
/**
 * CRUD component form
 */
export default {
  name: "ThumbnailActions" ,
  components: {
    UpdateForm ,
    DetailForm ,
    PictureForm ,
    PdfForm ,
    PdfPreviewForm
  } ,
  props: {
    crud: {
      required: true ,
      type: Object
    },
    model: {
      required: true ,
      type: Object
    },
    record: {
      required: true ,
      type: Object ,
    },
    onClose: {
      required: true ,
      type: Function
    }
  },
  setup(props){
    var store = useStore()
    const dialog = useDialog()
    const message = useMessage()
    const notify = useNotification()
    
    const show = ref(false)
    function toggleActions( actionStatus ){
      show.value = !show.value
      if( parseInt( actionStatus ) > 0 ) props.onClose( actionStatus )
    }

    function closeDetail(actionStatus){
      detailModal.show = false
      if( parseInt( actionStatus ) > 0 ) props.onClose( actionStatus )
    }

    function closePicture(actionStatus){
      pictureModal.show = false
      if( parseInt( actionStatus ) > 0 ) props.onClose( actionStatus )
    }

    function closePdf(actionStatus){
      pdfModal.show = false
      if( parseInt( actionStatus ) > 0 ) props.onClose( actionStatus )
    }

    function closePdfPreview(actionStatus){
      pdfPreviewModal.show = false
      if( parseInt( actionStatus ) > 0 ) props.onClose( actionStatus )
    }

    function closeUpdate(actionStatus){
      editModal.show = false
      if( parseInt( actionStatus ) > 0 ) props.onClose( actionStatus )
    }

    function closeActions(actionStatus){
      show.value = false
      if( parseInt( actionStatus ) > 0 ) props.onClose( actionStatus )
    }

    function toggleActive(record){
      show.value = false
      store.dispatch( props.model.name+'/toggleActive',{
        id: record.id
      }).then( res => {
        if( res.data.ok ){
          notify.success({
            title: 'ស្ថានភាពគណនី' ,
            description: 'ស្ថានភាពគណនីបានកែប្រែជោគជ័យ។' ,
            duration: 3000
          })
          closeActions( 1 )
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
      closeActions( 0 )
    }

    var editRecord = reactive({
      id: 0 ,
      name: "" ,
      desp: "" ,
      pid: 0 ,
      tpid: "" ,
      active: 0 ,
      image: null ,
      model: null ,
      pdf: null
    })
    var editModal = reactive({show:false})
    function showEditModal(record){
      editRecord.id = record.id
      editRecord.name = record.name
      editRecord.desp = record.desp
      editRecord.pid = record.pid
      editRecord.tpid = record.tpid
      editRecord.active = record.active
      editRecord.image = record.image
      editRecord.model = record.model
      editRecord.pdf = record.pdf
      editModal.show = true
      show.value = false
    }

    var detailModal = reactive({show:false})
    function showDetailModal(record){
      editRecord.id = record.id
      editRecord.name = record.name
      editRecord.desp = record.desp
      editRecord.pid = record.pid
      editRecord.tpid = record.tpid
      editRecord.active = record.active
      editRecord.image = record.image
      editRecord.model = record.model
      editRecord.pdf = record.pdf
      detailModal.show = true
      show.value = false
    }

    var pictureModal = reactive({show:false})
    function showPictureModal(record){
      editRecord.id = record.id
      editRecord.name = record.name
      editRecord.desp = record.desp
      editRecord.pid = record.pid
      editRecord.tpid = record.tpid
      editRecord.active = record.active
      editRecord.image = record.image
      editRecord.model = record.model
      editRecord.pdf = record.pdf
      pictureModal.show = true
      show.value = false
    }

    var pdfModal = reactive({show:false})
    function showPdfModal(record){
      editRecord.id = record.id
      editRecord.name = record.name
      editRecord.desp = record.desp
      editRecord.pid = record.pid
      editRecord.tpid = record.tpid
      editRecord.active = record.active
      editRecord.image = record.image
      editRecord.model = record.model
      editRecord.pdf = record.pdf
      pdfModal.show = true
      show.value = false
    }

    var pdfPreviewModal = reactive({show:false})
    function showPdfPreviewModal(record){
      editRecord.id = record.id
      editRecord.name = record.name
      editRecord.desp = record.desp
      editRecord.pid = record.pid
      editRecord.tpid = record.tpid
      editRecord.active = record.active
      editRecord.image = record.image
      editRecord.model = record.model
      editRecord.pdf = record.pdf
      pdfPreviewModal.show = true
      show.value = false
    }

    function deleteAccount(record){
      show.value = false
      dialog.warning({
        title: "លុបគណនី" ,
        content: "តើអ្នកចង់ លុប គណនីនេះមែនទេ ?" ,
        positiveText: 'បាទ / ចាស',
        negativeText: 'ទេ',
        onPositiveClick: () => {
          store.dispatch(props.model.name+'/delete',{id:record.id}).then( res => {
            if( res.data.ok ){
              notify.success({
                title: 'លុបទិន្នន័យ' ,
                description: 'លុបបានរួចរាល់។' ,
                duration: 3000
              })
              closeActions(1)
            }else{
              notify.success({
                title: 'លុបទិន្នន័យ' ,
                description: 'មានបញ្ហាក្នុងពេលលុបទិន្នន័យ។' ,
                duration: 3000
              })
            }
          }).catch( err => {
            message.error( err )
          })
          closeActions( 0 )
        },
        onNegativeClick: () => {
        }
      })
    }

    return {
      /**
       * Variables
       */
      /**
       * Editing
       */
      editModal ,
      showEditModal ,
      editRecord ,
      closeUpdate ,
      /**
       * Detail modal
       */
      showDetailModal ,
      detailModal ,
      closeDetail ,
      /**
       * Picture modal
       */
      showPictureModal ,
      pictureModal ,
      closePicture ,
      /**
       * Pdf modal
       */
      showPdfModal ,
      pdfModal ,
      closePdf ,
      /**
       * Pdf Preview modal
       */
      showPdfPreviewModal ,
      pdfPreviewModal ,
      closePdfPreview ,
      /**
       * Functions
       */
      toggleActive ,
      deleteAccount ,
      toggleActions ,
      show ,
      closeActions
    }
  }
}

</script>
<style type="text/css" scoped >
.vcb-thumbnail .actions {
  @apply flex flex-wrap justify-center absolute left-0 top-0 right-0 bottom-0;
}
.vcb-thumbnail .actions .action-toggle {
  @apply absolute top-1 right-1 w-6 h-6 p-1 rounded-full cursor-pointer ;
}
.vcb-thumbnail .actions .record-status {
  @apply absolute bottom-1 left-1 w-6 h-6 cursor-pointer ;
}
.vcb-thumbnail .actions .record-pdf {
  @apply absolute bottom-1 left-9 w-6 h-6 cursor-pointer ;
}
.vcb-thumbnail .actions .panel {
  @apply bg-white bg-opacity-90 absolute w-full top-0 bottom-0 flex flex-wrap content-center justify-center p-4 rounded-lg;
}
.vcb-thumbnail .actions .action {
  @apply cursor-pointer w-7 m-2 p-1 bg-white border border-gray-300 rounded-full hover:scale-125 transform-gpu duration-300 ;
}
</style>
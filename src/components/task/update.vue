<template>
  <!-- Form edit account -->
    <div class="vcb-pop-update font-ktr">
      <n-modal v-bind:show="show" :on-mask-click="closeModal" transform-origin="center" :on-after-enter="initial" >
        <n-card class="w-1/2 font-pvh text-xl" :title="'បន្ថែម ' + model.title" :bordered="false" size="small">
          <template #header-extra>
            <n-button type="success" :disabled="btnSavingLoadingRef" @click="update()" :loading="btnSavingLoadingRef" >
              <template #icon>
                <n-icon>
                  <Save20Regular />
                </n-icon>
              </template>
              រក្សារទុក
            </n-button>
          </template>
          <!-- Form edit account -->
          <div class="crud-update-form w-full border-t">
            <div class=" mx-auto p-4 flex-wrap">
              <div class="crud-form-panel w-full flex flex-wrap ">
                <n-form 
                  class="w-full text-left font-omc text-lg flex flex-wrap" 
                  :label-width="80"
                  :model="record"
                  :rules="rules"
                  size="large"
                  ref="formRef"
                >
                  <n-form-item label="បរិយាយពីការងារ" path="objective" class="w-4/5 mr-8" >
                    <n-input type="textarea" v-model:value="record.objective" placeholder="បរិយាយពីការងារ" />
                  </n-form-item>
                  <n-form-item label="រយះពេលកណត់បញ្ចប់ការងារ" path="minutes" class="w-4/5 mr-8" >
                    <n-input-number v-model:value="record.minutes" placeholder="រយះពេលកណត់បញ្ចប់ការងារ" />
                  </n-form-item>
                </n-form>
                <div class="w-1/2 h-8"></div>  
              </div>
            </div>
          </div>
          <!-- End form edit account -->
          <template #footer></template>
        </n-card>
      </n-modal>
    </div>
    <!-- End of edit account -->
</template>
<script>
import { reactive, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useMessage, useNotification } from 'naive-ui'
import dateFormat from "dateformat";

export default {
  components: {
  },
  props: {
    model: {
      type: Object ,
      required: true ,
      default: () => {
        return reactive({
          name: 'Undefined' ,
          title: 'No title'
        })
      },
      // validator: (val) => {}
    } , 
    record: {
      type: Object ,
      required: false ,
      default: () => {
        return reactive({
          id: 0 ,
          objective: '' ,
          minutes : 0 ,
          // contact_info: '' ,
          // start: '' ,
          // end: '' ,
          // date: new Date() ,
          // type_id: null
        })
      },
      // validator: (val) => {
      //   for(var field in ['id','username','firstname','lastname','email','phone','password','active'] ){
      //     if( !val.hasOwnProperty(field) ) return false
      //   }
      //   return true 
      // }
    },
    show: {
      type: Boolean ,
      default: false
    },
    onClose: {
      type: Function
    } ,
    // onShow: {
    //   type: Function
    // }
  },
  setup(props){
    const store = useStore()
    const message = useMessage()
    const notify = useNotification()
    const btnSavingLoadingRef = ref(false)
    
    const types = computed( () => {
      return store.getters['type/getRecords'].map( ( o ) => { 
        return { label: o.name , value: o.id } 
      })
    })
    const selectedType = ref(null)

    const today = ref( new Date() )

    const meetingDateTime = reactive({
      year: parseInt( dateFormat( today.value , 'yyyy') ) ,
      month: parseInt( dateFormat( today.value , 'mm') ) ,
      day: parseInt( dateFormat( today.value , 'dd') ) ,
      start: {
        hour : parseInt( dateFormat( today.value , 'H') ) ,
        minutes : parseInt( dateFormat( today.value , 'MM') )
      },
      end: {
        hour: parseInt( dateFormat( today.value , 'H') ) ,
        minutes: parseInt( dateFormat( today.value , 'MM') )
      }
    })

    /**
     * Variables
     */    
    const rules = {
        objective: {
          required: true,
          message: 'សូមបំពេញ ខ្លឹមសារ នៃកិច្ចប្រជុំ',
          trigger: [ 'blur']
        }
    }

    function clearForm(){
      props.record.id = 0
      props.record.objective = '' 
      props.record.minutes = 0
      // props.record.contact_info = '' 
      // props.record.type_id = null
      
      today.value = new Date()

      meetingDateTime.year = parseInt( dateFormat( today.value , 'yyyy') )
      meetingDateTime.month = parseInt( dateFormat( today.value , 'mm') )
      meetingDateTime.day = parseInt( dateFormat( today.value , 'dd') )
      meetingDateTime.start = {
        hour : parseInt( dateFormat( today.value , 'H') ) ,
        minutes : parseInt( dateFormat( today.value , 'MM') )
      }
      meetingDateTime.end = {
        hour: parseInt( dateFormat( today.value , 'H') ) ,
        minutes: parseInt( dateFormat( today.value , 'MM') )
      }

      // props.record.date = [meetingDateTime.year,meetingDateTime.month,meetingDateTime.day].join('-')
      // props.record.start = [meetingDateTime.start.hour,meetingDateTime.start.minutes].join(':')
      // props.record.end = [meetingDateTime.end.hour,meetingDateTime.end.minutes].join(':')

      if( props.show == true ){
        props.onClose()
      }
    }

    function update(){
      if( props.record.objective == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'សូមបំពេញ កម្មវត្ថុ' ,
          duration : 3000
        })
        return false
      }

      // Check date time
      // year: parseInt( dateFormat( new Date() , 'yyyy') ),
      // month: parseInt( dateFormat( new Date() , 'mm') ),
      // day: parseInt( dateFormat( new Date() , 'dd') )

      if( props.model === undefined || props.model.name == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'ទម្រង់នៃព័ត៌មានមិនទាន់បានកំណត់។' ,
          duration : 3000
        })
        return false
      }

      /**
       * Saving information of the regulator
       */
      // let year = new Date(props.record.year) 
      // notify.info({
      //   title: 'រក្សារទុកព័ត៌មាន' ,
      //   description: 'កំពុងរក្សារទុកព័ត៌មាន។' ,
      //   duration: 3000
      // })

      // props.record.date = [meetingDateTime.year,meetingDateTime.month,meetingDateTime.day].join('-')
      // props.record.start = [meetingDateTime.start.hour,meetingDateTime.start.minutes].join(':')
      // props.record.end = [meetingDateTime.end.hour,meetingDateTime.end.minutes].join(':')
      // props.record.type_id = selectedType.value > 0 ? selectedType.value : 0 

      btnSavingLoadingRef.value = true
      store.dispatch( props.model.name+'/update',{
        id: props.record.id ,
        objective: props.record.objective ,
        minutes: props.record.minutes
        // date: props.record.date  ,
        // start: props.record.start ,
        // end: props.record.end ,
        // type_id: props.record.type_id ,
        // contact_info : props.record.contact_info
      }).then( res => {
        switch( res.status ){
          case 200 : 
          notify.success({
            title: 'រក្សារទុកព័ត៌មាន' ,
            description: 'រក្សារទុកព័ត៌មានរបស់ឯកសាររួចរាល់។' ,
            duration: 3000
          })
          props.record.id = res.data.record.id
          clearForm()
          btnSavingLoadingRef.value = false
          break;
        }
      }).catch( err => {
        console.log( err )
        notify.error({
          'title' : 'រក្សារទុកព័ត៌មាន' ,
          'description' : 'មានបញ្ហាក្នុងពេលរក្សារទុកព័ត៌មាន។' ,
          duration : 3000
        })
      })
    }

    function closeModal(){
      console.log( props.show )
      if( props.show == true ){
        props.onClose()
      }
    }

    function getTypes(){
      store.dispatch('type/list',{page:1, perPage : 1000 , search : '' })
      .then( res => {
        store.commit('type/setRecords', res.data.records)
      }).catch( err => {
        notify.error( err )
      })
    }

    function initial(){
      getTypes()
      selectedType.value = props.record.type_id > 0 ? props.record.type_id : null
      today.value = props.record.date ? new Date( props.record.date ) : new Date()
      meetingDateTime.year = parseInt( dateFormat( today.value , 'yyyy') ) ,
      meetingDateTime.month = parseInt( dateFormat( today.value , 'mm') ) ,
      meetingDateTime.day = parseInt( dateFormat( today.value , 'dd') ) ,
      meetingDateTime.start = {
        hour : parseInt( props.record.start.split(":")[0] ) ,
        minutes : parseInt( props.record.start.split(":")[1] )
      }
      meetingDateTime.end = {
        hour : parseInt( props.record.end.split(":")[0] ) ,
        minutes : parseInt( props.record.end.split(":")[1] )
      }
    }

    return {
      /**
       * Variables
       */
      rules ,
      btnSavingLoadingRef ,
      types ,
      selectedType ,
      meetingDateTime ,
      /**
       * Functions
       */
      initial ,
      update ,
      closeModal
    }
  }
}
</script>
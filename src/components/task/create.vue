<template>
  <!-- Form edit account -->
    <div class="vcb-pop-create font-ktr">
      <n-modal v-bind:show="show" :on-mask-click="closeModal" transform-origin="center" :on-after-enter="initial" >
        <n-card class="w-1/2 font-pvh text-xl" :title="'បន្ថែម ' + model.title" :bordered="false" size="small">
          <template #header-extra>
            <n-button type="success" :disabled="btnSavingLoadingRef" @click="create()" :loading="btnSavingLoadingRef" >
              <template #icon>
                <n-icon>
                  <Save20Regular />
                </n-icon>
              </template>
              រក្សារទុក
            </n-button>
          </template>
          <!-- Form edit account -->
          <div class="crud-create-form w-full border-t">
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
          minutes: 0
        })
      }
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
    
    /**
     * Variables
     */    
    const rules = {
        objective: {
          required: true,
          message: 'សូមបំពេញ ការបរិយាយអំពីការងារ។',
          trigger: [ 'blur']
        }
    }

    function clearForm(){
      props.record.id = 0
      props.record.objective = '' 
      props.record.minutes = 0
      if( props.show == true ){
        props.onClose()
      }
    }

    function create(){
      if( props.record.objective == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'សូមបំពេញ ការបរិយាយអំពីការងារ។' ,
          duration : 3000
        })
        return false
      }

      if( props.record.minutes < 1 ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'រយះពេលបញ្ចប់ការងារ ត្រូវធំជាង សូន្យ។ (រាប់ជានាទី)' ,
          duration : 3000
        })
        return false
      }

      if( props.model === undefined || props.model.name == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'ទម្រង់នៃព័ត៌មានមិនទាន់បានកំណត់។' ,
          duration : 3000
        })
        return false
      }
      
      btnSavingLoadingRef.value = true
      store.dispatch( props.model.name+'/create',{
        objective: props.record.objective ,
        minutes: props.record.minutes
      }).then( res => {
        switch( res.status ){
          case 200 : 
          notify.success({
            title: 'រក្សារទុកព័ត៌មាន' ,
            description: 'រក្សារទុកព័ត៌មានរួចរាល់។' ,
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

    function initial(){
      
    }

    return {
      /**
       * Variables
       */
      rules ,
      btnSavingLoadingRef ,
      /**
       * Functions
       */
      initial ,
      create ,
      closeModal
    }
  }
}
</script>
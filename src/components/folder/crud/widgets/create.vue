<template>
  <!-- Form edit account -->
    <div class="vcb-pop-create font-ktr">
      <n-modal v-bind:show="show" :on-esc="maskOrEscClick" :on-mask-click="maskOrEscClick" :on-after-enter="initial" transform-origin="center">
        <n-card class="w-10/12 sm:w-3/4 md:w-8/12 lg:w-3/5 xl:w-7/12 " :title="'បន្ថែម ' + model.title" :bordered="false" size="small">
          <template #header-extra>
            <n-button type="success" @click="create" >
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M3 5a2 2 0 0 1 2-2h8.379a2 2 0 0 1 1.414.586l1.621 1.621A2 2 0 0 1 17 6.621V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm2-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1v-4.5A1.5 1.5 0 0 1 6.5 10h7a1.5 1.5 0 0 1 1.5 1.5V16a1 1 0 0 0 1-1V6.621a1 1 0 0 0-.293-.707l-1.621-1.621A1 1 0 0 0 13.379 4H13v2.5A1.5 1.5 0 0 1 11.5 8h-4A1.5 1.5 0 0 1 6 6.5V4H5zm2 0v2.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5V4H7zm7 12v-4.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5V16h8z" fill="currentColor"></path></g></svg>
              </template>
              រក្សារទុក
            </n-button>
          </template>
          <!-- Form edit account -->
          <div class="crud-create-form w-full border-t">
            <div class=" mx-auto p-4 flex-wrap">
              <div class="crud-form-panel w-full flex flex-wrap ">
                <n-form 
                  :id="model.name"
                  :name="model.name"
                  class="w-full text-left font-omc flex flex-wrap" 
                  :label-width="80"
                  :model="record"
                  :rules="rules"
                  size="large"
                  ref="formRef"
                >
                  <n-form-item label="ឈ្មោះ" path="name" class="w-full p-1" >
                    <n-input type="text" v-model:value="record.name" placeholder="ឈ្មោះ" />
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
import Crud from '@classes/Crud.js'
import { reactive , ref } from 'vue'
import { useStore } from 'vuex'
import { useMessage, useNotification } from 'naive-ui'

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
          name: ''
        })
      }
    },
    show: {
      type: Boolean ,
      default: false
    },
    onClose: {
      type: Function
    }
  },
  setup(props){
    const store = useStore()
    const message = useMessage()
    const notify = useNotification()

    store.commit( props.model.name+"/setColumns", [ 'id' , 'name' ] )
    store.commit( props.model.name+"/setModel", props.model )

    const crud = new Crud()
    crud.setConfig( import.meta.env.VITE_API_SERVER , store.getters[props.model.name+'/model'] , store.getters[props.model.name+'/columns'].all )

    /**
     * Variables
     */    
    const rules = {
        name: {
          required: true,
          message: 'សូមបញ្ចូលឈ្មោះ' + props.model.title ,
          trigger: [ 'blur']
        }
    }
    /**
     * Functions
     */
    function clearRecord(){
      props.record.id = 0 
      props.record.name = '' 
    }

    function create(){
      if( props.record.name == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'សូមបំពេញឈ្មោះ' + props.model.title ,
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

      crud.create( 
        {
          name: props.record.name
        },
        ( res ) => {
          switch( res.status ){
            case 200 : 
            notify.success({
              'title' : 'រក្សារទុកព័ត៌មាន' ,
              'description' : res.data.message ,
              duration : 3000
            })
            clearRecord()
            props.onClose( 1 )
            break;
          }
        }
      )
    }
    
    function maskOrEscClick(){
      props.onClose( 0 )
    }
    function initial(){
      
    }

    return {
      /**
       * Variables
       */
      rules ,
      /**
       * Functions
       */
      create ,
      initial ,
      maskOrEscClick
    }
  }
}
</script>
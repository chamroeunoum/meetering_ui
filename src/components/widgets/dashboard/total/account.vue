<template >
  <!-- Total Meetings -->
   <Transition name="slide-fade" >
  <div v-if="total>0" @click="$router.push('/users')" class="bg-gray-100 rounded border border-gray-200 hover:border-blue-400 duration-300 p-8 m-8 cursor-pointer ">
      <svg class="flex-none mx-auto w-14 h-14 mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12.5 10c0-1.65-1.35-3-3-3s-3 1.35-3 3s1.35 3 3 3s3-1.35 3-3zm-3 1c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1zm6.5 2c1.11 0 2-.89 2-2c0-1.11-.89-2-2-2c-1.11 0-2.01.89-2 2c0 1.11.89 2 2 2zM11.99 2.01c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10zM5.84 17.12c.68-.54 2.27-1.11 3.66-1.11c.07 0 .15.01.23.01c.24-.64.67-1.29 1.3-1.86A9.05 9.05 0 0 0 9.5 14c-1.3 0-3.39.45-4.73 1.43c-.5-1.04-.78-2.2-.78-3.43c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.2-.27 2.34-.75 3.37c-1-.59-2.36-.87-3.24-.87c-1.52 0-4.5.81-4.5 2.7v2.78a7.935 7.935 0 0 1-5.66-2.86z" fill="currentColor"></path></svg>
      <div class="m-auto mb-2 ">គណនី</div>
      <div class="m-auto font-bold text-blue-600 " v-html="total" ></div>
  </div>
</Transition>
  <!-- End Total Meetings -->
</template>
<script >
import { useNotification } from 'naive-ui'
import { ref , computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { authLogout } from './../../../../plugins/authentication'


export default {
  name: 'TotalAccount',
  components: {
  },
  setup() {
    const router = useRouter()
    const store = useStore()
    const notify = useNotification()

    /**
     * Account
     */
    const response = ref(null)
    const total = computed(() => {
        return response.value !== null ? response.value.total : 0 
    })
    function getRecords(){
      store.dispatch('user/total').then( res => {
          if( res.data.ok ){
            response.value = res.data.result
          }else{
            response.value = null
          }
      }).catch( err => {
        switch( err.response.status ) {
          case 401 :
            authLogout()
            router.push('/login')
            break;
          default: 
            notify.error({
              title: "អានព័ត៌មានឯកសារគិតយុត្ត" ,
              content: "មានបញ្ហាពេលអានឯកសារគតិយុត្ត។" ,
              duration: 3000 ,
              background: true
            })
            break;
          }
      })
    }
    
    onMounted( () => {
      getRecords()
    })

    return {
      total
    }
  }
}

</script >
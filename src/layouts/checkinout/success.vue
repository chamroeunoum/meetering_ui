<!--
  CheckInOutSuccess — Confirmation screen after attendance check-in/out
  Shows success message with organization logo and redirect option.
-->
<template>
  <div class="absolute left-0 top-0 right-0 bottom-0 " >
    <div class="w-11/12 sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-6/12 2xl:w-6/12 m-4 p-8 mx-auto mt-2 mb-24 relative z-40">
      <Transition name="fade" >
        <div class="w-full flex flex-wrap justify-between" >
          <div class="w-full p-1 mx-auto" >
            <div class="p-2 w-full leading-5 flex flex-wrap relative cursor-pointer" >
              <div class="identification-checking-panel mx-auto w-full mb-4" >
                <div class="w-full text-center m-2 relative" >
                  <div class="w-20 h-20 mx-auto bg-contain bg-no-repeat bg-center" :style="' background-image: url(' + ocmLogoUrl + '); '" ></div>
                  <div class="w-full font-moul mb-0 text-yellow-600 leading-8 text-xs" >ទីស្ដីការគណៈរដ្ឋមន្ត្រី</div>
                  <div v-if="organization != null " class="w-full font-moul mb-8 leading-6 text-xs " >{{ organization.name }}</div>
                  អ្នកបានចុះវត្តមានរួចរាល់
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <div class="fixed left-0 bottom-0 right-0" >
      <Footer />
    </div>
  </div>
</template>
<script>
import { reactive ,ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter , useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import Vue3Barcode from 'vue3-barcode'
import { useDialog, useMessage, useNotification } from 'naive-ui'
import dateFormat from "dateformat";
import Frame4Corner from '../../components/widgets/frame/corner4.vue'
import Footer from '../../components/footer/copy-right.vue'
import ocmLogoUrl from './../../assets/logo.svg'
import DigitalClock from '../../components/widgets/DigitalClock.vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import Camera from '../../components/widgets/Camera.vue'

/**
 * CRUD component form
 */
export default {
  name: "QRCode" ,
  components: {
    QrcodeVue ,
    Vue3Barcode ,
    Frame4Corner ,
    Footer ,
    DigitalClock ,
    GoogleMap ,
    Marker ,
    Camera
  },
  setup(){
    const store = useStore()
    const dialog = useDialog()
    const message = useMessage()
    const router = useRouter()
    const route = useRoute()
    const notify = useNotification()
    const organization = ref(null)
    /**
     * Variables
     */    
    var model = reactive( {
      name: "organizations" ,
      title: "QR វត្តមាន នៃក្រសួងស្ថាប័ន"
    })

    function getOrganization(){
      store.dispatch( 'organization/read' , { id: route.params.id } ).then(
        res => {
          organization.value = res.data.record
        }
      ).catch( 
        err => {
          console.log( err )
        }
      )
    }

    getOrganization()

    return {
      /**
       * Variables
       */
      store ,
      model ,
      organization ,
      ocmLogoUrl ,
      /**
       * Functions
       */
      /**
       * Camera Moduls
       */
    }
  }
}

</script>

<style scoped >
  .vcb-table-cell {
    @apply p-2 ;
  }
</style>
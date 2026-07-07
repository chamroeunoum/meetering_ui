<template>
  <div class="absolute left-0 top-0 right-0 bottom-0 overflow-y-auto overflow-x-hidden bg-repeat bg-yellow-50" :style="'background-image: url('+ocmCardBackgroundImage+'); '"  >
    <div class="relative p-2 mb-16 mx-auto w-4/5 sm:w-3/5 md:w-2/5 lg:w-2/5 xl:w-2/5" >
      <Transition name="slide-fade" >
        <div v-if="officer!=null " class="mx-auto w-full p-0 flex flex-wrap " >
          <div class="w-full mb-0" >
            <div class=" mx-auto " ><img :src="ocmLogoUrl" class="mt-8 w-20 mx-auto" /></div>
            <div class=" mx-auto my-2 font-moul text-yellow-500" >ទីស្ដីការគណៈរដ្ឋមន្ត្រី</div>
            <div class=" mx-auto font-ktr text-yellow-800 font-bold" >Office of the Council of Ministers</div>
          </div>
          <div class="w-full p-8" >
            <!-- <div class="mx-auto rounded-full border border-gray-200 shadow-sm p-8 w-40 h-40 bg-center bg- bg-cover bg-no-repeat" :style="'background-image: url( '+ (officer.image!=''&&officer.image!=null? officer.image: ocmLogoUrl ) +' ); '" ></div> -->
            <img :src="(officer.image!=''&&officer.image!=null? officer.image: ocmLogoUrl )" class="rounded-lg overflow-hidden w-32 mx-auto border border-gray-300 p-0 bg-white" />
          </div>
          <div class="font-moul text-left w-full text-gray-800" >
              <div class="font-omc font-bold pb-1 leading-6 text-center text-gray-700"  >{{ 
                officer.card != undefined && officer.card != null && officer.card.id > 0 
                  ? officer.card.number 
                  : (
                    officer.organization != undefined && officer.organization != null && officer.organization.id > 0 ? $toKhmer( officer.organization.prefix + '-' + ( officer.id + '' ).padStart( 4 , '0' ) ) : 'OCM-ORG-' + officer.id
                  )
                }}
              </div>
              <div v-if="officer.countesy!=undefined&&officer.countesy!=null" class="font-moul pb-1 leading-6 text-center" >{{ officer.countesy.name }}</div>
              <div class="pb-1leading-7 text-center" >
                <div class="w-full font-moul mb-1 " >{{ officer.people.lastname + " " + officer.people.firstname }}</div>
                <div class="w-full" >{{ officer.people.enlastname + " " + officer.people.enfirstname }}</div>
              </div>
              <div class="py-4 w-full flex flex-wrap" >
                <div v-if="officer != null && officer.position != undefined && officer.position != null " class="w-1/2 pb-1 font-moul leading-7 text-right pr-8" >{{ officer.position.name }}</div>
                <div v-if="officer != null && officer.organization != undefined && officer.organization != null " class="w-1/2 pb-1  font-moul leading-7 text-left pl-8" >{{ officer.organization.name }}</div>
              </div>
              <!-- <div v-if="officer != null && officer.organization_people != null && officer.organization_people != undefined && officer.organization_people.length > 0 " class="p-2" >
                <div v-for="(organizationPivot, index) in officer.organization_people" :key="index"
                style="vertical-align: top; text-align: left;" class="p-2 leading-7 text-sm font-bold"  >{{ organizationPivot.organization.code != "" && organizationPivot.organization.code != undefined && organizationPivot.organization.code.length > 0 ? organizationPivot.organization.code : 'OCM' }}{{ organizationPivot.code != "" && organizationPivot.code != undefined && organizationPivot.code.length > 0 ? "-" + organizationPivot.code : '-' + officer.id }}</div>
              </div> -->
          </div>
          <div class="w-full my-2" >
            <qrcode-vue :value="getPublicCardUrl(officer)" :size="100" level="H" class=" mx-auto p-1 border border-gray-300 rounded-md bg-white" :render-as="'svg'" />
          </div>
          <!-- User current location in the map -->
          <Transition name="slide-fade" >
            <div class="w-full p-1 my-4 mx-auto" 
              v-if="currentGeolocation.lat != null && currentGeolocation.lat != undefined && currentGeolocation.lng != null && currentGeolocation.lng != undefined && false "
              >
              <div 
                class="google-map border border-gray-200 p-1" >
                <GoogleMap
                  api-key="AIzaSyDObCQ64io6LBvly6qFPP2dHlOKjBXz5tw"
                  style="width: 100%; height: 200px"
                  :center="currentGeolocation"
                  :zoom="15"
                  >
                  <Marker :options="{ position: currentGeolocation }" />
                </GoogleMap>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
    <div class="fixed bottom-0 left-0 right-0 ">
      <div class="w-full my-2 leading-8">
        <div class="text-center copy-right text-gray-700">ទីស្ដីការគណៈរដ្ឋមន្ត្រី &copy; រក្សារសិទ្ធិគ្រប់យ៉ាង ២០២៤</div>
      </div>
    </div>
  </div>

</template>
<script>
  import { reactive , ref , onMounted , computed , watch } from 'vue'
  import { useStore } from 'vuex'
  import { useMessage, useNotification } from 'naive-ui'
  import { useRouter, useRoute } from 'vue-router'
  import QrcodeVue from 'qrcode.vue'
  import ocmLogoUrl from './../../assets/logo.svg'
  import ocmLogoEnUrl from './../../assets/logo.png'
  import ocmCardBackgroundImage from './../../assets/pkachan.png'
  import { GoogleMap, Marker } from 'vue3-google-map'
  import Camera from './../../components/widgets/Camera.vue'

  export default {
    name: "CardComponent" ,
    components: {
      QrcodeVue ,
      ocmCardBackgroundImage ,
      GoogleMap ,
      Marker ,
      Camera
    },
    setup(props){
      const router = useRouter()
      const store = useStore()
      const route = useRoute()
      const message = useMessage()
      const notify = useNotification()
      const officer = ref(null)

      const userCountesies = computed( () => {
        return officer != undefined && Array.isArray( officer.value.countesies ) ? officer.value.countesies.map( ( c ) => c.name ).join(', ') : ''
      })
      
      watch( () => route.params.id, (newValue, oldValue) => {
        readOfficer( )
      })

      function readOfficer(){
        if( route.params.id != undefined && route.params.id != null && route.params.id.length > 0 ) {
          store.dispatch('officer/read',{id: route.params.id } ).then( res => {
            if( res.data.ok == true ){
              officer.value = res.data.record
              officer.value.countesies
            }else{
              console.log( res )
            }
          }).catch( err => {
            console.log( err )
          })
        }
      }

      onMounted(()=>{
        readOfficer()
      })

      function getPublicCardUrl(record){
        return window.location.origin+'/#/officer/card/'+record.id
      }

      const allowGetLocation = ref( false )
      const currentGeolocation = reactive({ lat: null , lng: null })
      function getLocation() {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(showPosition, showError);
              allowGetLocation.value = true
          } else {
              notify.error( "មានបញ្ហាចាប់ទីតាំងស្កេនកូត។")
              allowGetLocation.value = false 
          }
      }

      function showPosition(position) {
        currentGeolocation.lat = position.coords.latitude
        currentGeolocation.lng = position.coords.longitude
      }

      function showError(error) {
        allowGetLocation.value = false 
        switch(error.code) {
            case error.PERMISSION_DENIED:
                notify.error( {
                  title: 'ចាប់ទីតាំង' ,
                  content: "ការស្នើរសុំទីតាំង ត្រូវបានបដិសេធ៏ដោយអ្នកប្រើប្រាស់។"
                } )
                break;
            case error.POSITION_UNAVAILABLE:
                notify.error( {
                  title: 'ចាប់ទីតាំង' ,
                  content: "ព័ត៌មានពីទីតាំអ្នកប្រើប្រាស់មិនមានឡើយ។"
                } )
                break;
            case error.TIMEOUT:
                notify.error( {
                  title: 'ចាប់ទីតាំង' ,
                  content: "អស់ពេលស្នើរសុំព័ត៌មានទីតាំងរបស់អ្នកប្រើប្រាស់។"
                } )
                break;
            case error.UNKNOWN_ERROR:
            notify.error( {
                  title: 'ចាប់ទីតាំង' ,
                  content: "មានកំហុសដែលមិនបានរំពឹងទុកកើតឡើង។"
                } )
                break;
        }
      }

      // getLocation()

      return {
        userCountesies ,
        getPublicCardUrl ,
        officer ,
        ocmLogoUrl ,
        ocmCardBackgroundImage ,
        ocmLogoEnUrl ,
        currentGeolocation ,
        getLocation ,
        showPosition ,
        allowGetLocation
      } 
    }
  }
</script>
  
<style scoped>
  
</style>
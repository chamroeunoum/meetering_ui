<template>
  <div class="relative w-full min-h-screen bg-gray-50 bg-center bg-cover bg-background" >
    <div class="absolute p-0 top-0 right-0 bottom-0 left-0 p-4">
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in" >
          <component :is="Component" :model="model" />
        </Transition>
      </router-view>
    </div>
    <Dock />
    <BottomMenuFloatItems />
  </div>
</template>
<script >
import BottomMenuFloatItems from '@components/menu/bottommenu-float-items.vue'
import Dock from '@components/widgets/Dock.vue'
import { reactive } from 'vue'
export default {
  watch: {
  },
  components: { 
    BottomMenuFloatItems ,
    Dock
  },
  setup() {
    const model = reactive({
      name: 'meeting' ,
      module: 'meetings' ,
      title: 'កិច្ចប្រជុំ'
    })

    return {
      model
    }
  },
  name: "MeetingPage", 
  data() {
      return {};
  },
  computed: {},
  mounted() {
  },
  methods: {}
}
</script>
<style scoped>
/* we will explain what these classes do next! */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

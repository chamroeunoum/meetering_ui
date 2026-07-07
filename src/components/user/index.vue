<template>
  <div class="relative w-full min-h-screen bg-gray-50 bg-center bg-cover bg-background">
    <div class="absolute p-0 top-0 right-0 bottom-0 left-0">
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :model="model" />
        </Transition>
      </router-view>
    </div>
    <Dock />
    <BottomMenuFloatItems />
  </div>
</template>

<script>
import BottomMenuFloatItems from '@components/menu/bottommenu-float-items.vue'
import Dock from '@components/widgets/Dock.vue'
import { reactive } from 'vue'

export default {
  components: {
    BottomMenuFloatItems,
    Dock
  },
  setup() {
    const model = reactive({
      name: 'user',
      module: 'users',
      title: 'គណនីអ្នកប្រើប្រាស់'
    })
    return {
      model
    }
  },
  name: "UserPage"
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

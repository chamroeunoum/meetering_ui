<template>
  <div>
    <router-view v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" :model="model" />
      </Transition>
    </router-view>
  </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  setup() {
    const model = reactive({
      name: 'meeting',
      module: 'meetings',
      title: 'កិច្ចប្រជុំ'
    })
    return { model }
  },
  name: "CardPage",
}
</script>
<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

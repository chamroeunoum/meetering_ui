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
      name: 'folder',
      module: 'folders',
      title: 'ថតឯកសារ'
    })
    return { model }
  },
  name: "FolderPage",
}
</script>
<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

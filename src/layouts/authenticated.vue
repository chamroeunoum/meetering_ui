<template>
  <div class="flex h-screen overflow-hidden bg-secondary">
    <ModuleSidebar v-model="sidebarOpen" @update:modelValue="sidebarOpen = $event" />
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-y-auto bg-secondary">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import ModuleSidebar from '../components/sidebars/module-sidebar.vue'

export default {
  name: 'AuthenticatedLayout',
  components: { ModuleSidebar },
  setup() {
    const sidebarOpen = ref(true)
    return { sidebarOpen }
  },
}
</script>

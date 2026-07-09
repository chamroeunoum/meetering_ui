<template>
  <div class="flex h-screen overflow-hidden bg-secondary">
    <!-- ── Sidebar ──────────────────────────────────────────── -->
    <div
      :class="[
        'flex flex-col bg-card border-r border-default transition-all duration-300 flex-shrink-0',
        sidebarOpen ? 'w-60' : 'w-14',
      ]"
    >
      <!-- Brand / Toggle row -->
      <div class="flex items-center h-14 px-3 border-b border-default">
        <button
          class="flex-none w-8 h-8 flex items-center justify-center rounded-lg hover-bg-gray-100 transition-colors"
          @click="$emit('update:modelValue', !sidebarOpen)"
          :title="sidebarOpen ? 'បិទម៉ឺនុយ' : 'បើកម៉ឺនុយ'"
        >
          <svg class="w-5 h-5 text-muted transition-transform duration-300"
               :class="{ 'rotate-180': !sidebarOpen }"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <div v-show="sidebarOpen" class="ml-3 flex items-center gap-2 overflow-hidden">
          <div class="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">M</div>
          <span class="text-sm font-semibold text-primary whitespace-nowrap">ប្រព័ន្ធរៀបចំកិច្ចប្រជុំ</span>
        </div>
      </div>

      <!-- Navigation modules -->
      <div class="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
        <div
          v-for="item in modules"
          :key="item.path"
          class="flex items-center rounded-lg cursor-pointer transition-all duration-150 sidebar-item"
          :class="[
            sidebarOpen ? 'px-3 py-2.5 gap-3' : 'px-0 py-2 justify-center',
            isActive(item.path) ? 'active' : '',
          ]"
          @click="navigate(item)"
          :title="!sidebarOpen ? item.label : ''"
        >
          <span class="flex-none w-5 h-5 flex items-center justify-center" v-html="item.icon"></span>
          <span v-show="sidebarOpen" class="flex-grow text-sm font-medium truncate text-left ">{{ item.khLabel || item.label }}</span>
        </div>
      </div>

      <!-- Bottom actions -->
      <div class="border-t border-default py-2 px-2 space-y-0.5">
        <!-- Theme toggle -->
        <div
          class="flex items-center rounded-lg cursor-pointer transition-all duration-150 sidebar-item  text-left "
          :class="sidebarOpen ? 'px-3 py-2.5 gap-3' : 'px-0 py-2 justify-center'"
          @click="toggleTheme"
          :title="isDark ? 'ប្ដូរទៅពន្លឺ' : 'ប្ដូរទៅងងឹត'"
        >
          <span class="flex-none w-5 h-5 flex items-center justify-center">
            <svg v-if="isDark" viewBox="0 0 24 24" class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </span>
          <span v-show="sidebarOpen" class="flex-grow text-sm font-medium truncate text-secondary">
            {{ isDark ? 'ពន្លឺ' : 'ងងឹត' }}
          </span>
        </div>

        <!-- Profile -->
        <div
          class="flex items-center rounded-lg cursor-pointer transition-all duration-150 sidebar-item  text-left "
          :class="sidebarOpen ? 'px-3 py-2.5 gap-3' : 'px-0 py-2 justify-center'"
          @click="$router.push('/profile')"
          title="ព័ត៌មានខ្ញុំ"
        >
          <span class="flex-none w-5 h-5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
          <span v-show="sidebarOpen" class="flex-grow text-sm font-medium truncate">ព័ត៌មានខ្ញុំ</span>
        </div>

        <!-- Logout -->
        <div
          class="flex items-center rounded-lg cursor-pointer transition-all duration-150 sidebar-item text-red-600  text-left "
          :class="sidebarOpen ? 'px-3 py-2.5 gap-3' : 'px-0 py-2 justify-center'"
          @click="confirmLogout"
          title="ចាកចេញ"
        >
          <span class="flex-none w-5 h-5 flex items-center justify-center">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span v-show="sidebarOpen" class="flex-grow text-sm font-medium truncate">ចាកចេញ</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from './../../composables/useTheme'
import { authLogout, isAuth } from './../../plugins/authentication'
import { useDialog } from 'naive-ui'

export default {
  name: 'ModuleSidebar',
  props: {
    modelValue: { type: Boolean, default: true },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const route = useRoute()
    const router = useRouter()
    const { isDark, toggleTheme } = useTheme()
    const sidebarOpen = computed(() => props.modelValue)
    const dialog = useDialog()

    function isActive(path) {
      if (path === '/') return false
      return route.path.startsWith(path)
    }

    function navigate(item) {
      router.push(item.path)
    }

    function confirmLogout() {
      if (!isAuth()) return
      dialog.warning({
        title: 'ចាកចេញ',
        content: 'តើអ្នកចង់ចាកចេញពីប្រព័ន្ធមែនទេ?',
        positiveText: 'បាទ / ចាស',
        negativeText: 'ទេ',
        onPositiveClick: () => {
          authLogout()
          router.push('/login')
        },
      })
    }

    const modules = [
      {
        path: '/dashboard',
        label: 'Dashboard',
        khLabel: 'ផ្ទាំងគ្រប់គ្រង',
        icon: '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
      },
      {
        path: '/meetings',
        label: 'Meetings',
        khLabel: 'កិច្ចប្រជុំ',
        icon: '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/></svg>',
      },
      {
        path: '/rooms',
        label: 'Rooms',
        khLabel: 'បន្ទប់',
        icon: '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      },
    ]

    return {
      sidebarOpen,
      modules,
      isActive,
      navigate,
      isDark,
      toggleTheme,
      confirmLogout,
    }
  },
}
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar { width: 4px; }
.overflow-y-auto::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
</style>

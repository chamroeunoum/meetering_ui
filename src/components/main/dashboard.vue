<template>
  <div class="ocm-dashboard relative">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64 mt-12">
      <n-spin size="large" />
    </div>

    <!-- Dashboard content -->
    <div v-else class="dashboard-content p-4">
      <!-- Section: Summary Cards -->
      <div class="mb-6">
        <div class="font-moul text-sm text-secondary mb-8 px-2">សង្ខេបទិន្នន័យ</div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <!-- Users -->
          <div @click="router.push('/users')"
            class="dashboard-card cursor-pointer border-l-4 border-blue-500">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-muted">គណនីអ្នកប្រើប្រាស់</div>
                <div class="text-2xl font-bold text-blue-600">{{ summary.users }}</div>
              </div>
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.5 10c0-1.65-1.35-3-3-3s-3 1.35-3 3s1.35 3 3 3s3-1.35 3-3zm-3 1c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1zm6.5 2c1.11 0 2-.89 2-2c0-1.11-.89-2-2-2c-1.11 0-2.01.89-2 2c0 1.11.89 2 2 2zM11.99 2.01c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10zM5.84 17.12c.68-.54 2.27-1.11 3.66-1.11c.07 0 .15.01.23.01c.24-.64.67-1.29 1.3-1.86A9.05 9.05 0 0 0 9.5 14c-1.3 0-3.39.45-4.73 1.43c-.5-1.04-.78-2.2-.78-3.43c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.2-.27 2.34-.75 3.37c-1-.59-2.36-.87-3.24-.87c-1.52 0-4.5.81-4.5 2.7v2.78a7.935 7.935 0 0 1-5.66-2.86z" fill="currentColor"/></svg>
              </div>
            </div>
          </div>

          <!-- Meetings -->
          <div @click="router.push('/meetings')"
            class="dashboard-card cursor-pointer border-l-4 border-green-500">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-muted">កិច្ចប្រជុំ</div>
                <div class="text-2xl font-bold text-green-600">{{ summary.meetings }}</div>
              </div>
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="none"><path d="M14.708 6a5.938 5.938 0 0 0-5.736 4.403l-1.773 6.623c.181-.017.365-.026.55-.026h2.045l1.593-5.951a3.438 3.438 0 0 1 3.32-2.549h18.587a3.438 3.438 0 0 1 3.32 2.549l4.756 17.77a3.72 3.72 0 0 1-3.594 4.681H21V36h16.776c4.09 0 7.066-3.878 6.01-7.828l-4.756-17.77A5.938 5.938 0 0 0 33.294 6H14.708zM34.75 40.5H20.995c.003-.083.005-.166.005-.25V38h13.751a1.25 1.25 0 0 1 0 2.5zM11.501 29a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5zM4 22.75A3.75 3.75 0 0 1 7.75 19h7.5A3.75 3.75 0 0 1 19 22.75v17.5A3.75 3.75 0 0 1 15.25 44h-7.5A3.75 3.75 0 0 1 4 40.25v-17.5z" fill="currentColor"/></g></svg>
              </div>
            </div>
          </div>

          <!-- Regulators -->
          <!-- <div @click="router.push('/folders')"
            class="dashboard-card cursor-pointer border-l-4 border-orange-500">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-muted">ឯកសារគតិយុត្ត</div>
                <div class="text-2xl font-bold text-orange-600">{{ summary.regulators }}</div>
              </div>
              <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" fill="currentColor"/></svg>
              </div>
            </div>
          </div> -->

          <!-- Tasks: New -->
          <!-- <div @click="router.push('/tasks')"
            class="dashboard-card cursor-pointer border-l-4 border-purple-500">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-muted">កិច្ចការថ្មី</div>
                <div class="text-2xl font-bold text-purple-600">{{ taskStats.new }}</div>
              </div>
              <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/></svg>
              </div>
            </div>
          </div> -->

          <!-- Tasks: In Progress -->
          <!-- <div @click="router.push('/tasks')"
            class="dashboard-card cursor-pointer border-l-4 border-cyan-500">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-xs text-muted">កំពុងអនុវត្ត</div>
                <div class="text-2xl font-bold text-cyan-600">{{ taskStats.in_progress }}</div>
              </div>
              <div class="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-cyan-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>
              </div>
            </div>
          </div> -->
        </div>
      </div>

      <!-- Section: Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <!-- Meetings by Type -->
        <div class="bg-card rounded-lg border border-default p-4">
          <div class="font-moul text-sm text-secondary mb-3">កិច្ចប្រជុំតាមប្រភេទ</div>
          <div v-if="meetingsByType.length === 0" class="text-center text-muted py-8 text-sm">
            មិនមានទិន្នន័យ
          </div>
          <div v-else class="space-y-2">
            <div v-for="(item, idx) in meetingsByType" :key="idx"
              class="flex items-center gap-2">
              <div class="w-32 text-xs text-secondary truncate" :title="item.name || item.type">
                {{ item.name || item.type || 'ផ្សេងៗ' }}
              </div>
              <div class="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700"
                  :class="barColors[idx % barColors.length]"
                  :style="{ width: barWidth(item.count) + '%' }">
                </div>
              </div>
              <div class="text-xs font-semibold text-primary w-10 text-right">{{ item.count }}</div>
            </div>
          </div>
        </div>

        <!-- Meetings by Status -->
        <div class="bg-card rounded-lg border border-default p-4">
          <div class="font-moul text-sm text-secondary mb-3">ស្ថានភាពកិច្ចប្រជុំ</div>
          <div v-if="meetingsByStatus.length === 0" class="text-center text-muted py-8 text-sm">
            មិនមានទិន្នន័យ
          </div>
          <div v-else class="space-y-2">
            <div v-for="(item, idx) in meetingsByStatus" :key="idx"
              class="flex items-center gap-2">
              <div class="w-32 text-xs text-secondary truncate" :title="item.name || item.status">
                {{ statusLabel(item.name || item.status) }}
              </div>
              <div class="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700"
                  :class="statusColors[idx % statusColors.length]"
                  :style="{ width: barWidth(item.count) + '%' }">
                </div>
              </div>
              <div class="text-xs font-semibold text-primary w-10 text-right">{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Meetings by Organization -->
      <div class="mb-6" v-if="meetingsByOrganization.length > 0">
        <div class="bg-card rounded-lg border border-default p-4">
          <div class="font-moul text-sm text-secondary mb-3">កិច្ចប្រជុំតាមស្ថាប័ន</div>
          <div class="space-y-2">
            <div v-for="(item, idx) in meetingsByOrganization.slice(0, 8)" :key="idx"
              class="flex items-center gap-2">
              <div class="w-40 text-xs text-secondary truncate" :title="item.name || item.organization">
                {{ item.name || item.organization || 'ផ្សេងៗ' }}
              </div>
              <div class="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700"
                  :class="orgColors[idx % orgColors.length]"
                  :style="{ width: barWidth(item.count) + '%' }">
                </div>
              </div>
              <div class="text-xs font-semibold text-primary w-10 text-right">{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Quick Access -->
      <!-- <div class="mb-6">
        <div class="font-moul text-sm text-secondary mb-3 px-2">ច្រកចូលរហ័ស</div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div v-for="link in quickLinks" :key="link.url"
            @click="router.push(link.url)"
            class="quick-link-card">
            <div class="w-12 h-12 mx-auto mb-2 text-blue-500" v-html="link.svg"></div>
            <div class="text-xs font-pvh text-center text-secondary" v-html="link.name"></div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Dashboard',
  components: {},
  setup() {
    const store = useStore()
    const router = useRouter()

    const model = reactive({
      name: 'dashboard',
      title: 'ផ្ទាំងព័ត៌មាន'
    })

    // ─── Reactive data from store

    const summary = computed(() => store.state.dashboard.summary)
    const meetingsByType = computed(() => store.state.dashboard.meetingsByType)
    const meetingsByStatus = computed(() => store.state.dashboard.meetingsByStatus)
    const meetingsByOrganization = computed(() => store.state.dashboard.meetingsByOrganization)
    const taskStats = computed(() => store.state.dashboard.taskStats)
    const loading = computed(() => store.state.dashboard.loading)

    // ─── Chart helpers

    function barWidth(count) {
      const all = [
        ...meetingsByType.value,
        ...meetingsByStatus.value,
        ...meetingsByOrganization.value
      ]
      if (all.length === 0) return 0
      const max = Math.max(...all.map(i => i.count || 0), 1)
      return Math.max((count / max) * 100, 2)
    }

    const barColors = [
      'bg-blue-500', 'bg-green-500', 'bg-orange-500',
      'bg-purple-500', 'bg-cyan-500', 'bg-pink-500',
      'bg-teal-500', 'bg-indigo-500'
    ]

    const statusColors = [
      'bg-blue-400', 'bg-green-400', 'bg-yellow-400',
      'bg-red-400', 'bg-purple-400', 'bg-gray-400'
    ]

    const orgColors = [
      'bg-indigo-400', 'bg-teal-400', 'bg-amber-400',
      'bg-rose-400', 'bg-lime-400', 'bg-sky-400',
      'bg-fuchsia-400', 'bg-emerald-400'
    ]

    function statusLabel(status) {
      const map = {
        'new': 'ថ្មី',
        'meeting': 'កំពុងប្រជុំ',
        'continue': 'បន្ត',
        'delay': 'ពន្យារ',
        'finished': 'បានបញ្ចប់',
        'change': 'បានផ្លាស់ប្ដូរ',
      }
      return map[status] || status || 'ផ្សេងៗ'
    }

    // ─── Quick links

    const quickLinks = ref([
      {
        url: '/meetings',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="none"><path d="M14.708 6a5.938 5.938 0 0 0-5.736 4.403l-1.773 6.623c.181-.017.365-.026.55-.026h2.045l1.593-5.951a3.438 3.438 0 0 1 3.32-2.549h18.587a3.438 3.438 0 0 1 3.32 2.549l4.756 17.77a3.72 3.72 0 0 1-3.594 4.681H21V36h16.776c4.09 0 7.066-3.878 6.01-7.828l-4.756-17.77A5.938 5.938 0 0 0 33.294 6H14.708zM34.75 40.5H20.995c.003-.083.005-.166.005-.25V38h13.751a1.25 1.25 0 0 1 0 2.5zM11.501 29a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5zM4 22.75A3.75 3.75 0 0 1 7.75 19h7.5A3.75 3.75 0 0 1 19 22.75v17.5A3.75 3.75 0 0 1 15.25 44h-7.5A3.75 3.75 0 0 1 4 40.25v-17.5z" fill="currentColor"/></g></svg>',
        name: 'កិច្ចប្រជុំ'
      },
      // {
      //   url: '/attendants',
      //   svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 8h14v2H16z" fill="currentColor"/><path d="M6 10.59L3.41 8L2 9.41l4 4l8-8L12.59 4L6 10.59z" fill="currentColor"/><path d="M16 22h14v2H16z" fill="currentColor"/><path d="M6 24.59L3.41 22L2 23.41l4 4l8-8L12.59 18L6 24.59z" fill="currentColor"/></svg>',
      //   name: 'វត្តមាន'
      // },
      // {
      //   url: '/tasks',
      //   svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="currentColor"/></svg>',
      //   name: 'កិច្ចការ'
      // },
      {
        url: '/rooms',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 21h18V8l-7-5H3v18zm2-2V9h4v10H5zm6 0V5h2v14h-2zm4 0V9h4v10h-4z" fill="currentColor"/></svg>',
        name: 'សាលប្រជុំ'
      },
      // {
      //   url: '/folders',
      //   svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" fill="currentColor"/></svg>',
      //   name: 'ថតឯកសារ'
      // },
      // {
      //   url: '/cards',
      //   svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28"><g fill="none"><path d="M15 11.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75zm.75 3.25a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5zm-4.5-3.25a1.75 1.75 0 1 1-3.5 0a1.75 1.75 0 0 1 3.5 0zM7 14.5h5a1 1 0 0 1 1 1v.5s-.5 2.5-3.5 2.5S6 16 6 16v-.5a1 1 0 0 1 1-1zM2.004 6.75A2.75 2.75 0 0 1 4.754 4H23.25A2.75 2.75 0 0 1 26 6.75v14.5A2.75 2.75 0 0 1 23.25 24H4.755a2.75 2.75 0 0 1-2.75-2.75V6.75z" fill="currentColor"/></g></svg>',
      //   name: 'កាតមន្ត្រី'
      // },
      {
        url: '/profile',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 8a5 5 0 1 0 5 5a5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3a3.003 3.003 0 0 1-3 3z" fill="currentColor"/><path d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2zm-6 24.377V25a3.003 3.003 0 0 1 3-3h6a3.003 3.003 0 0 1 3 3v1.377a11.899 11.899 0 0 1-12 0zm13.992-1.451A5.002 5.002 0 0 0 19 20h-6a5.002 5.002 0 0 0-4.992 4.926a12 12 0 1 1 15.985 0z" fill="currentColor"/></svg>',
        name: 'គណនី'
      }
    ])

    // ─── Lifecycle

    onMounted(() => {
      store.dispatch('dashboard/fetchSummary')
    })

    return {
      router,
      model,
      summary,
      meetingsByType,
      meetingsByStatus,
      meetingsByOrganization,
      taskStats,
      loading,
      barWidth,
      barColors,
      statusColors,
      orgColors,
      statusLabel,
      quickLinks
    }
  }
}
</script>

<style scoped>
.dashboard-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1rem;
}
.dashboard-card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.quick-link-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.quick-link-card:hover {
  border-color: #93c5fd;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.dashboard-content {
  padding-bottom: 5rem;
}
</style>

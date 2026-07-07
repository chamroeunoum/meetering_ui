<template>
  <div class="w-full p-4">
    <!-- Top action panel -->
    <div class="flex title-bar border-b border-gray-200 p-2 h-12">
      <div class="flex w-64 h-8 title">
        <svg class="flex-none w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.5 10c0-1.65-1.35-3-3-3s-3 1.35-3 3s1.35 3 3 3s3-1.35 3-3zm-3 1c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1zm6.5 2c1.11 0 2-.89 2-2c0-1.11-.89-2-2-2c-1.11 0-2.01.89-2 2c0 1.11.89 2 2 2zM11.99 2.01c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10zM5.84 17.12c.68-.54 2.27-1.11 3.66-1.11c.07 0 .15.01.23.01c.24-.64.67-1.29 1.3-1.86A9.05 9.05 0 0 0 9.5 14c-1.3 0-3.39.45-4.73 1.43c-.5-1.04-.78-2.2-.78-3.43c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.2-.27 2.34-.75 3.37c-1-.59-2.36-.87-3.24-.87c-1.52 0-4.5.81-4.5 2.7v2.78a7.935 7.935 0 0 1-5.66-2.86z" fill="currentColor"/></svg>
        <div class="font-moul ml-2 h-8 leading-9" v-html="model.title"></div>
      </div>
      <div class="flex-grow action-buttons flex-row-reverse flex">
        <div class="w-3/5 md:w-2/5 relative h-8">
          <input type="text" @keypress.enter="filterRecords(false)" v-model="search"
            class="bg-gray-100 px-2 h-8 w-full rounded border border-gray-200 focus:border-blue-600 hover:border-blue-600 duration-300"
            placeholder="ស្វែងរក" />
          <svg class="absolute right-1 top-1 w-6 h-6 text-gray-400 cursor-pointer" @click="filterRecords(false)"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><g fill="none"><path d="M8.5 3a5.5 5.5 0 0 1 4.227 9.02l4.127 4.126a.5.5 0 0 1-.638.765l-.07-.057l-4.126-4.127A5.5 5.5 0 1 1 8.5 3zm0 1a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9z" fill="currentColor"/></g></svg>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-20">
      <n-spin size="medium" />
    </div>

    <!-- Empty state -->
    <div v-else-if="!Array.isArray(records) || records.length === 0" class="mt-24 text-center text-gray-500">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.5 10c0-1.65-1.35-3-3-3s-3 1.35-3 3s1.35 3 3 3s3-1.35 3-3zm-3 1c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1zm6.5 2c1.11 0 2-.89 2-2c0-1.11-.89-2-2-2c-1.11 0-2.01.89-2 2c0 1.11.89 2 2 2zM11.99 2.01c-5.52 0-10 4.48-10 10s4.48 10 10 10s10-4.48 10-10s-4.48-10-10-10zM5.84 17.12c.68-.54 2.27-1.11 3.66-1.11c.07 0 .15.01.23.01c.24-.64.67-1.29 1.3-1.86A9.05 9.05 0 0 0 9.5 14c-1.3 0-3.39.45-4.73 1.43c-.5-1.04-.78-2.2-.78-3.43c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.2-.27 2.34-.75 3.37c-1-.59-2.36-.87-3.24-.87c-1.52 0-4.5.81-4.5 2.7v2.78a7.935 7.935 0 0 1-5.66-2.86z" fill="currentColor"/></svg>
      <div class="text-lg">មិនមានព័ត៌មានអ្នកប្រើប្រាស់សម្រាប់បង្ហាញឡើយ។</div>
    </div>

    <!-- Table -->
    <div v-else class="mt-2 mb-12">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-gray-100 text-left text-xs text-gray-600 uppercase">
              <th class="p-3 w-12">#</th>
              <th class="p-3">ឈ្មោះ</th>
              <th class="p-3">អ៊ីមែល</th>
              <th class="p-3">លេខទូរសព្ទ</th>
              <th class="p-3">ស្ថានភាព</th>
              <th class="p-3 text-center w-24">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in records" :key="record.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td class="p-3 text-gray-400">{{ (pagination.page - 1) * pagination.perPage + index + 1 }}</td>
              <td class="p-3">
                <div class="font-semibold text-gray-800">{{ record.lastname }} {{ record.firstname }}</div>
                <div class="text-xs text-gray-400">@{{ record.username }}</div>
              </td>
              <td class="p-3 text-gray-600">{{ record.email }}</td>
              <td class="p-3 text-gray-600">{{ record.phone || '—' }}</td>
              <td class="p-3">
                <n-tag :type="record.active ? 'success' : 'error'" size="small" round>
                  {{ record.active ? 'សកម្ម' : 'អសកម្ម' }}
                </n-tag>
              </td>
              <td class="p-3 text-center">
                <div class="flex justify-center gap-1">
                  <n-tooltip trigger="hover">
                    <template #trigger>
                      <n-button size="tiny" quaternary type="primary" @click="toggleActive(record)">
                        <template #icon>
                          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>
                        </template>
                      </n-button>
                    </template>
                    {{ record.active ? 'បិទគណនី' : 'បើកគណនី' }}
                  </n-tooltip>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="fixed left-0 right-0 bottom-1 flex justify-center">
        <div class="flex items-center gap-1 bg-white rounded-full shadow border border-gray-200 px-2 py-1">
          <!-- Previous -->
          <n-tooltip trigger="hover">
            <template #trigger>
              <div class="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-100"
                :class="{ 'opacity-30 pointer-events-none': pagination.page <= 1 }"
                @click="pagination.page > 1 && goTo(pagination.page - 1)">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 0 1 0 1.414L9.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0z" fill="currentColor"/></svg>
              </div>
            </template>
            ទំព័រមុន
          </n-tooltip>

          <!-- Page buttons -->
          <div v-for="page in pagination.buttons" :key="page"
            class="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer text-xs font-semibold"
            :class="pagination.page === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-600'"
            @click="goTo(page)">
            {{ page }}
          </div>

          <!-- Next -->
          <n-tooltip trigger="hover">
            <template #trigger>
              <div class="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-100"
                :class="{ 'opacity-30 pointer-events-none': pagination.page >= pagination.totalPages }"
                @click="pagination.page < pagination.totalPages && goTo(pagination.page + 1)">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 0 1 0-1.414L10.586 10L7.293 6.707a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0z" fill="currentColor"/></svg>
              </div>
            </template>
            ទំព័របន្ទាប់
          </n-tooltip>

          <!-- Per page selector -->
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-popselect trigger="click" v-model:value="pagination.perPage"
                :options="[5, 10, 20, 30, 50, 100].map(v => ({ label: String(v), value: v }))"
                size="small" scrollable @update:value="goTo(1)">
                <div class="cursor-pointer text-xs font-semibold px-2 py-1 rounded hover:bg-gray-100 text-blue-600">
                  {{ pagination.perPage }}
                </div>
              </n-popselect>
            </template>
            ចំនួនព័ត៌មានបង្ហាញម្ដង
          </n-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useMessage, useNotification } from 'naive-ui'
import { authLogout } from '@plugins/authentication'

export default {
  name: 'UserList',
  props: {
    model: {
      type: Object,
      default: () => ({ name: 'user', module: 'users', title: 'គណនីអ្នកប្រើប្រាស់' })
    }
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    const message = useMessage()
    const notify = useNotification()

    // ─── Reactive state ────────────────────────────────────────────────

    const search = ref('')
    const loading = ref(false)
    const records = ref([])

    const pagination = reactive({
      page: 1,
      perPage: 10,
      totalRecords: 0,
      totalPages: 0,
      buttons: []
    })

    // ─── Computed ──────────────────────────────────────────────────────

    const totalPages = computed(() => pagination.totalPages)
    const pageButtons = computed(() => pagination.buttons)

    // ─── Methods ───────────────────────────────────────────────────────

    /** Build pagination buttons display */
    function buildPaginationButtons() {
      const total = pagination.totalPages
      const current = pagination.page
      const buttons = []
      const maxButtons = 5

      if (total <= maxButtons) {
        for (let i = 1; i <= total; i++) buttons.push(i)
      } else {
        let start = Math.max(1, current - 2)
        let end = Math.min(total, start + maxButtons - 1)
        if (end - start < maxButtons - 1) {
          start = Math.max(1, end - maxButtons + 1)
        }
        for (let i = start; i <= end; i++) buttons.push(i)
      }
      pagination.buttons = buttons
    }

    /** Fetch user records from API */
    async function filterRecords(resetPage = true) {
      if (resetPage) pagination.page = 1
      loading.value = true
      try {
        const res = await store.dispatch('user/list', {
          search: search.value,
          perPage: pagination.perPage,
          page: pagination.page
        })
        if (res.data?.ok && res.data?.records?.data) {
          records.value = res.data.records.data
          pagination.totalRecords = res.data.records.total || 0
          pagination.totalPages = Math.max(1, Math.ceil(pagination.totalRecords / pagination.perPage))
        } else if (res.data?.records?.data) {
          records.value = res.data.records.data
          pagination.totalRecords = res.data.records.total || 0
          pagination.totalPages = Math.max(1, Math.ceil(pagination.totalRecords / pagination.perPage))
        } else {
          records.value = []
        }
        buildPaginationButtons()
      } catch (err) {
        console.error('[UserList] Failed to fetch users:', err)
        if (err.response?.status === 401) {
          authLogout()
          router.push('/login')
        } else {
          notify.error({
            title: 'អានព័ត៌មានអ្នកប្រើប្រាស់',
            content: 'មានបញ្ហាពេលអានព័ត៌មានអ្នកប្រើប្រាស់។',
            duration: 3000
          })
        }
      } finally {
        loading.value = false
      }
    }

    /** Navigate to a specific page */
    function goTo(page) {
      pagination.page = page
      filterRecords(false)
    }

    /** Toggle user active/inactive status */
    async function toggleActive(record) {
      try {
        const res = await store.dispatch('user/update', {
          id: record.id,
          active: !record.active
        })
        if (res.data?.ok) {
          record.active = !record.active
          message.success(record.active ? 'គណនីត្រូវបានបើកដំណើរការ។' : 'គណនីត្រូវបានបិទដំណើរការ។')
        }
      } catch (err) {
        console.error('[UserList] Failed to toggle user active:', err)
        notify.error({
          title: 'បញ្ហា',
          content: 'មិនអាចផ្លាស់ប្ដូរស្ថានភាពគណនីបានទេ។',
          duration: 3000
        })
      }
    }

    // ─── Lifecycle ─────────────────────────────────────────────────────

    onMounted(() => {
      filterRecords()
    })

    return {
      search,
      loading,
      records,
      pagination,
      totalPages,
      pageButtons,
      filterRecords,
      goTo,
      toggleActive
    }
  }
}
</script>

<style scoped>
.vcb-pagination-page {
  @apply rounded-full cursor-pointer hover:bg-gray-100;
}
</style>

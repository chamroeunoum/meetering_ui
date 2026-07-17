<template>
  <div class="p-4">
    <!-- Header -->
    <div class="flex items-center gap-3 mb-4">
      <n-button size="small" quaternary @click="$router.push('/meetings')">
        <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.707 5.293a1 1 0 0 1 0 1.414L9.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0z"/></svg>
      </n-button>
      <h1 class="font-moul text-lg">តារាងកាលវិភាគប្រជុំ</h1>
      <div class="flex-1"></div>
      <n-input v-model:value="search" placeholder="ស្វែងរក..." clearable style="width:260px" @keypress.enter="fetchMeetings" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20"><n-spin size="medium" /></div>

    <!-- Table -->
    <div v-else class="overflow-x-auto rounded-lg border border-default">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-gray-50 dark:bg-gray-800 text-left">
            <th class="p-3 w-12 text-center">#</th>
            <th class="p-3">លេខកូដ</th>
            <th class="p-3">កម្មវត្ថុ</th>
            <th class="p-3">កាលបរិច្ឆេទ</th>
            <th class="p-3">ម៉ោង</th>
            <th class="p-3">ប្រភេទ</th>
            <th class="p-3">ប្រភព</th>
            <th class="p-3">ស្ថានភាព</th>
            <th class="p-3 text-center">សកម្មភាព</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rec, i) in records" :key="rec.id"
            class="border-t border-default hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <td class="p-3 text-center text-muted">{{ i + 1 + (page - 1) * perPage }}</td>
            <td class="p-3 whitespace-nowrap"><code class="text-xs font-bold text-gray-500 font-mono">{{ rec.meeting_code || '—' }}</code></td>
            <td class="p-3 max-w-xs">
              <div class="truncate font-semibold">{{ rec.objective || '—' }}</div>
            </td>
            <td class="p-3 whitespace-nowrap">{{ rec.date || '—' }}</td>
            <td class="p-3 whitespace-nowrap">{{ rec.start }} - {{ rec.end }}</td>
            <td class="p-3">{{ rec.type?.name || '—' }}</td>
            <td class="p-3 max-w-[180px]">
              <div class="truncate">{{ rec.organizations?.map(o => o.name).join(', ') || '—' }}</div>
            </td>
            <td class="p-3">
              <n-tag :type="statusType(rec.status)" size="tiny" round>{{ statusLabel(rec.status) }}</n-tag>
            </td>
            <td class="p-3 text-center">
              <n-button size="tiny" quaternary @click="$router.push('/meetings/' + rec.id)">
                <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </n-button>
            </td>
          </tr>
          <tr v-if="!records.length">
            <td colspan="8" class="p-10 text-center text-muted">មិនមានទិន្នន័យកិច្ចប្រជុំទេ។</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-4 space-x-1">
      <n-button size="tiny" :disabled="page <= 1" @click="goPage(page - 1)">មុន</n-button>
      <n-button size="tiny" v-for="p in pageButtons" :key="p" :type="p === page ? 'primary' : 'default'" @click="goPage(p)">{{ p }}</n-button>
      <n-button size="tiny" :disabled="page >= totalPages" @click="goPage(page + 1)">បន្ទាប់</n-button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useMessage } from 'naive-ui'

export default {
  name: 'MeetingSchedule',
  props: {
    model: { type: Object, required: true },
  },
  setup(props) {
    const store = useStore()
    const message = useMessage()
    const records = ref([])
    const loading = ref(false)
    const search = ref('')
    const page = ref(1)
    const perPage = ref(50)
    const totalPages = ref(1)

    const statusMap = {
      1: { label: 'ថ្មី', type: 'default' },
      2: { label: 'កំពុងប្រជុំ', type: 'warning' },
      4: { label: 'បន្ត', type: 'info' },
      8: { label: 'ផ្លាស់ប្តូរ', type: 'warning' },
      16: { label: 'ពន្យារ', type: 'error' },
      32: { label: 'បញ្ចប់', type: 'success' },
    }
    function statusLabel(s) { return statusMap[s]?.label || '—' }
    function statusType(s) { return statusMap[s]?.type || 'default' }

    async function fetchMeetings() {
      loading.value = true
      try {
        const res = await store.dispatch('meeting/list', {
          search: search.value,
          perPage: perPage.value,
          page: page.value,
        })
        if (res.data?.ok) {
          const d = res.data
          if (Array.isArray(d.records)) {
            records.value = d.records
            totalPages.value = Math.ceil((d.pagination?.totalRecords || records.value.length) / perPage.value)
          } else if (d.records?.data) {
            records.value = d.records.data
            totalPages.value = d.records.last_page || 1
          } else {
            records.value = []
          }
        }
      } catch (e) {
        console.error(e)
        records.value = []
      }
      loading.value = false
    }

    function goPage(p) { page.value = p; fetchMeetings() }

    const pageButtons = computed(() => {
      const pages = []
      const start = Math.max(1, page.value - 2)
      const end = Math.min(totalPages.value, page.value + 2)
      for (let i = start; i <= end; i++) pages.push(i)
      return pages
    })

    onMounted(() => fetchMeetings())

    return {
      records, loading, search, page, perPage, totalPages, pageButtons,
      fetchMeetings, goPage, statusLabel, statusType,
    }
  }
}
</script>

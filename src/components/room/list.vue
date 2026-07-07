<template>
  <div class="w-full p-4">
    <!-- Top bar -->
    <div class="flex title-bar border-b border-gray-200 p-2 h-12">
      <div class="flex w-64 h-8 title">
        <svg class="flex-none w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 21h18V8l-7-5H3v18zm2-2V9h4v10H5zm6 0V5h2v14h-2zm4 0V9h4v10h-4z" fill="currentColor"/></svg>
        <div class="font-moul ml-2 h-8 leading-9">សាលប្រជុំ</div>
      </div>
      <div class="flex-grow flex flex-row-reverse gap-2">
        <n-button type="success" size="small" @click="showCreateModal = true">
          <template #icon>+</template> បន្ថែម
        </n-button>
        <div class="w-2/5 relative h-8">
          <input type="text" @keypress.enter="fetchRooms(false)" v-model="search"
            class="bg-gray-100 px-2 h-8 w-full rounded border border-gray-200 focus:border-blue-600"
            placeholder="ស្វែងរក" />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20"><n-spin size="medium" /></div>

    <!-- Empty -->
    <div v-else-if="rooms.length === 0" class="mt-24 text-center text-gray-500">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 21h18V8l-7-5H3v18z" fill="currentColor"/></svg>
      <div class="text-lg">មិនមានសាលប្រជុំសម្រាប់បង្ហាញឡើយ។</div>
    </div>

    <!-- Room grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2 mb-12">
      <div v-for="room in rooms" :key="room.id"
        class="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
        @click="router.push('/rooms/' + room.id)">
        <div v-if="room.image" class="h-32 bg-cover bg-center" :style="'background-image:url(' + room.image + ')'"></div>
        <div v-else class="h-32 bg-gray-100 flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 21h18V8l-7-5H3v18z" fill="currentColor"/></svg>
        </div>
        <div class="p-3">
          <div class="font-moul text-sm text-gray-800 truncate">{{ room.name }}</div>
          <div class="text-xs text-gray-500 mt-1 truncate">{{ room.desp || '—' }}</div>
          <div class="flex gap-3 mt-1.5 text-xs text-gray-400">
            <span v-if="room.equipment_count !== undefined">🖥 {{ room.equipment_count || 0 }} ឧបករណ៍</span>
            <span v-if="room.seat_count !== undefined">🪑 {{ room.seat_count || 0 }} កៅអី</span>
          </div>
          <div class="flex justify-between items-center mt-2">
            <n-tag :type="room.active ? 'success' : 'error'" size="tiny" round class="cursor-pointer" @click.stop="toggleRoomActive(room)">{{ room.active ? 'សកម្ម' : 'អសកម្ម' }}</n-tag>
            <div class="flex gap-1">
              <n-button size="tiny" quaternary @click.stop="editRoom(room)">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z" fill="currentColor"/></svg>
              </n-button>
              <n-button size="tiny" quaternary type="error" @click.stop="deleteRoom(room)">
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="fixed left-0 right-0 bottom-1 flex justify-center">
      <div class="flex items-center gap-1 bg-white rounded-full shadow border px-2 py-1">
        <div v-for="page in pagination.buttons" :key="page"
          class="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer text-xs font-semibold"
          :class="pagination.page === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-600'"
          @click="goTo(page)">{{ page }}</div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <n-modal v-model:show="showCreateModal" :mask-closable="false">
      <n-card :title="editingRoom.id ? 'កែប្រែសាលប្រជុំ' : 'បន្ថែមសាលប្រជុំ'"
        style="width:500px" :bordered="false" size="small">
        <n-space vertical>
          <n-input v-model:value="form.name" placeholder="ឈ្មោះសាលប្រជុំ *" />
          <n-input v-model:value="form.desp" placeholder="ទីតាំង / ការពិពណ៌នា" type="textarea" :rows="2" />
        </n-space>
        <template #footer>
          <n-space justify="end">
            <n-button @click="closeModal">បោះបង់</n-button>
            <n-button type="primary" @click="saveRoom" :loading="saving">{{ editingRoom.id ? 'រក្សាទុក' : 'បន្ថែម' }}</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useMessage, useDialog } from 'naive-ui'
import { authLogout } from '@plugins/authentication'

export default {
  name: 'RoomList',
  setup() {
    const store = useStore()
    const router = useRouter()
    const message = useMessage()
    const dialog = useDialog()

    const search = ref('')
    const loading = ref(false)
    const saving = ref(false)
    const rooms = ref([])
    const showCreateModal = ref(false)
    const editingRoom = reactive({ id: null })
    const form = reactive({ name: '', desp: '' })

    const pagination = reactive({
      page: 1, perPage: 20, totalRecords: 0, totalPages: 0, buttons: []
    })

    function buildPaginationButtons() {
      const total = pagination.totalPages, current = pagination.page, max = 5
      const buttons = []
      if (total <= max) { for (let i = 1; i <= total; i++) buttons.push(i) }
      else {
        let start = Math.max(1, current - 2), end = Math.min(total, start + max - 1)
        if (end - start < max - 1) start = Math.max(1, end - max + 1)
        for (let i = start; i <= end; i++) buttons.push(i)
      }
      pagination.buttons = buttons
    }

    async function fetchRooms(resetPage = true) {
      if (resetPage) pagination.page = 1
      loading.value = true
      try {
        const res = await store.dispatch('meetingRoom/list', {
          search: search.value, perPage: pagination.perPage, page: pagination.page
        })
        if (res.data?.ok) {
          rooms.value = Array.isArray(res.data.records) ? res.data.records : (res.data.records?.data || [])
          pagination.totalRecords = res.data.pagination?.totalRecords || res.data.records?.total || 0
          pagination.totalPages = res.data.pagination?.totalPages || Math.max(1, Math.ceil(pagination.totalRecords / pagination.perPage))
        }
        buildPaginationButtons()
      } catch (err) {
        if (err.response?.status === 401) { authLogout(); router.push('/login') }
      } finally { loading.value = false }
    }

    function goTo(page) { pagination.page = page; fetchRooms(false) }

    function editRoom(room) {
      editingRoom.id = room.id
      form.name = room.name
      form.desp = room.desp || ''
      showCreateModal.value = true
    }

    function closeModal() {
      showCreateModal.value = false
      editingRoom.id = null
      form.name = ''; form.desp = ''
    }

    async function saveRoom() {
      if (!form.name.trim()) { message.warning('សូមបញ្ចូលឈ្មោះសាលប្រជុំ។'); return }
      saving.value = true
      try {
        if (editingRoom.id) {
          await store.dispatch('meetingRoom/update', { id: editingRoom.id, name: form.name, desp: form.desp })
          message.success('បានកែប្រែសាលប្រជុំ។')
        } else {
          await store.dispatch('meetingRoom/create', { name: form.name, desp: form.desp })
          message.success('បានបន្ថែមសាលប្រជុំ។')
        }
        closeModal()
        fetchRooms()
      } catch (err) { message.error('មានបញ្ហា។') }
      finally { saving.value = false }
    }

    function deleteRoom(room) {
      dialog.warning({
        title: 'លុបសាលប្រជុំ',
        content: `តើអ្នកចង់លុប "${room.name}" មែនទេ?`,
        positiveText: 'លុប', negativeText: 'បោះបង់',
        onPositiveClick: async () => {
          try {
            await store.dispatch('meetingRoom/delete', { id: room.id })
            message.success('បានលុបសាលប្រជុំ។')
            fetchRooms()
          } catch (err) { message.error('មានបញ្ហា។') }
        }
      })
    }

    async function toggleRoomActive(room) {
      try {
        await store.dispatch('meetingRoom/toggleActive', { id: room.id })
        room.active = room.active ? 0 : 1
        message.success(room.active ? 'បានបើកសាលប្រជុំ។' : 'បានបិទសាលប្រជុំ។')
      } catch (e) { message.error('មានបញ្ហា។') }
    }

    onMounted(() => fetchRooms())

    return { router, search, loading, saving, rooms, pagination, showCreateModal, editingRoom, form, fetchRooms, goTo, editRoom, closeModal, saveRoom, deleteRoom, toggleRoomActive }
  }
}
</script>

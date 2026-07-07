<template>
  <div class="w-full p-4">
    <!-- Back + title -->
    <div class="flex items-center gap-3 mb-4">
      <n-button size="small" quaternary @click="$router.push('/rooms')">
        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 0 1 0 1.414L9.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0z" fill="currentColor"/></svg>
      </n-button>
      <div class="font-moul text-lg text-gray-800">{{ room.name }}</div>
      <n-tag :type="room.active ? 'success' : 'error'" size="small" round class="cursor-pointer" @click="toggleRoomActive">{{ room.active ? 'សកម្ម' : 'អសកម្ម' }}</n-tag>
      <n-upload accept="image/*" :show-file-list="false" :custom-request="uploadRoomPhoto" class="ml-auto">
        <n-button size="tiny" quaternary>📷 រូបថត</n-button>
      </n-upload>
    </div>

    <!-- Tabs -->
    <n-tabs v-model:value="activeTab" type="line" animated>
      <n-tab-pane name="equipment" tab="ឧបករណ៍">
        <div class="mt-2">
          <div class="flex justify-between items-center mb-3">
            <div class="text-xs text-gray-500">សរុប {{ equipment.length }} ឧបករណ៍</div>
            <n-button size="tiny" type="success" @click="openEquipModal()">+ បន្ថែម</n-button>
          </div>
          <div v-if="equipLoading" class="flex justify-center py-10"><n-spin size="small" /></div>
          <div v-else-if="equipment.length === 0" class="text-center text-gray-400 py-10 text-sm">មិនមានឧបករណ៍នៅឡើយទេ។</div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div v-for="eq in equipment" :key="eq.id" class="bg-white border rounded-lg p-3 hover:shadow transition-shadow">
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-semibold text-sm">{{ eq.name }} <span class="text-xs text-gray-400 font-mono ml-1">{{ eq.equipment_code }}</span></div>
                  <div class="text-xs text-gray-500">{{ eq.brand_model || '—' }} | ចំនួន: {{ eq.quantity }}</div>
                  <div class="text-xs text-gray-400" v-if="eq.serial_number">SN: {{ eq.serial_number }}</div>
                </div>
                <div class="flex gap-1">
                  <n-tag :type="eq.status === 'ok' ? 'success' : eq.status === 'attention' ? 'warning' : 'error'" size="tiny" round
                    @click="toggleEquipStatus(eq)" class="cursor-pointer">
                    {{ eq.status === 'ok' ? 'OK' : eq.status === 'attention' ? 'ប្រុងប្រយ័ត្ន' : 'ខូច' }}
                  </n-tag>
                </div>
              </div>
              <div class="text-xs text-gray-500 mt-1" v-if="eq.description">{{ eq.description }}</div>
              <div class="flex justify-end gap-1 mt-2">
                <n-button size="tiny" quaternary @click="editEquipment(eq)"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/></svg></n-button>
                <n-button size="tiny" quaternary type="error" @click="deleteEquipment(eq)"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z" fill="currentColor"/></svg></n-button>
              </div>
            </div>
          </div>
        </div>
      </n-tab-pane>

      <n-tab-pane name="seats" tab="កៅអី">
        <div class="mt-2">
          <div v-if="seatLoading" class="flex justify-center py-10"><n-spin size="small" /></div>
          <SeatLayout v-else :seats="seats" :room-id="roomId"
            @add="handleSeatAdd"
            @edit="handleSeatEdit"
            @delete="handleSeatDelete"
            @batch-add="handleSeatBatchAdd"
            @clear="handleSeatClear" />
        </div>
      </n-tab-pane>
    </n-tabs>

    <!-- Equipment Modal -->
    <n-modal v-model:show="showEquipModal" :mask-closable="false">
      <n-card :title="editingEquipId ? 'កែប្រែឧបករណ៍' : 'បន្ថែមឧបករណ៍'" style="width:500px" size="small">
        <n-space vertical>
          <n-input v-model:value="equipForm.name" placeholder="ឈ្មោះឧបករណ៍ *" />
          <n-select v-model:value="equipForm.category" :options="categoryOptions" placeholder="ប្រភេទ" />
          <n-input v-model:value="equipForm.brand_model" placeholder="ម៉ាក និងម៉ូដែល" />
          <n-input-number v-model:value="equipForm.quantity" :min="1" placeholder="ចំនួន" />
          <n-input v-model:value="equipForm.serial_number" placeholder="លេខស៊េរី" />
          <n-input v-model:value="equipForm.description" placeholder="ការពិពណ៌នា" type="textarea" :rows="2" />
        </n-space>
        <template #footer>
          <n-space justify="end">
            <n-button @click="showEquipModal = false">បោះបង់</n-button>
            <n-button type="primary" @click="saveEquipment">រក្សាទុក</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>

  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import SeatLayout from './seat-layout.vue'

export default {
  name: 'RoomDetail',
  components: { SeatLayout },
  setup() {
    const store = useStore()
    const route = useRoute()
    const message = useMessage()

    const roomId = computed(() => Number(route.params.id) || 0)
    const activeTab = ref('equipment')
    const room = reactive({ name: '', desp: '', active: 1, image: null })

    // Equipment
    const equipment = ref([]); const equipLoading = ref(false)
    const showEquipModal = ref(false); const editingEquipId = ref(null)
    const equipForm = reactive({ name: '', category: 'other', brand_model: '', quantity: 1, serial_number: '', description: '' })

    function openEquipModal(id = null) {
      editingEquipId.value = id
      if (id) {
        const eq = equipment.value.find(e => e.id === id)
        if (eq) Object.assign(equipForm, { name: eq.name, category: eq.category || 'other', brand_model: eq.brand_model || '', quantity: eq.quantity || 1, serial_number: eq.serial_number || '', description: eq.description || '' })
      } else {
        Object.assign(equipForm, { name: '', category: 'other', brand_model: '', quantity: 1, serial_number: '', description: '' })
      }
      showEquipModal.value = true
    }

    const categoryOptions = [
      { label: 'Audio/Visual', value: 'audio_visual' },
      { label: 'Furniture', value: 'furniture' },
      { label: 'IT', value: 'IT' },
      { label: 'Climate', value: 'climate' },
      { label: 'Other', value: 'other' },
    ]

    // Seats
    const seats = ref([]); const seatLoading = ref(false)

    // ─── Fetch room ──────────────────────────────────────────────────
    async function fetchRoom() {
      try {
        const res = await store.dispatch('meetingRoom/read', { id: roomId.value })
        if (res.data?.ok && res.data?.record) Object.assign(room, res.data.record)
      } catch (e) { console.error(e) }
    }

    async function toggleRoomActive() {
      try {
        await store.dispatch('meetingRoom/toggleActive', { id: roomId.value })
        room.active = room.active ? 0 : 1
        message.success(room.active ? 'បានបើកសាលប្រជុំ។' : 'បានបិទសាលប្រជុំ។')
      } catch (e) { message.error('មានបញ្ហា។') }
    }

    // ─── Equipment ───────────────────────────────────────────────────
    async function fetchEquipment() {
      equipLoading.value = true
      try {
        const res = await store.dispatch('meetingRoomEquipment/list', { room_id: roomId.value })
        if (res.data?.ok) equipment.value = Array.isArray(res.data.records) ? res.data.records : (res.data.records?.data || [])
      } catch (e) { console.error(e) }
      finally { equipLoading.value = false }
    }

    function editEquipment(eq) { openEquipModal(eq.id) }

    async function saveEquipment() {
      if (!equipForm.name.trim()) { message.warning('សូមបញ្ចូលឈ្មោះឧបករណ៍។'); return }
      try {
        if (editingEquipId.value) {
          await store.dispatch('meetingRoomEquipment/update', { id: editingEquipId.value, ...equipForm, room_id: roomId.value })
        } else {
          await store.dispatch('meetingRoomEquipment/create', { ...equipForm, room_id: roomId.value })
        }
        message.success('រួចរាល់។')
        showEquipModal.value = false
        fetchEquipment()
      } catch (e) { message.error('មានបញ្ហា។') }
    }

    async function toggleEquipStatus(eq) {
      try { await store.dispatch('meetingRoomEquipment/toggleStatus', { id: eq.id }); fetchEquipment() } catch (e) {}
    }

    async function deleteEquipment(eq) {
      try { await store.dispatch('meetingRoomEquipment/delete', { id: eq.id }); message.success('បានលុប។'); fetchEquipment() } catch (e) { message.error('មានបញ្ហា។') }
    }

    // ─── Seats ───────────────────────────────────────────────────────
    async function fetchSeats() {
      seatLoading.value = true
      try {
        const res = await store.dispatch('meetingRoomSeat/list', { room_id: roomId.value })
        if (res.data?.ok) seats.value = Array.isArray(res.data.records) ? res.data.records : (res.data.records?.data || [])
      } catch (e) { console.error(e) }
      finally { seatLoading.value = false }
    }

    async function handleSeatAdd(seat) {
      try { await store.dispatch('meetingRoomSeat/create', { ...seat, room_id: roomId.value }); message.success('បានបន្ថែមកៅអី។'); fetchSeats() } catch (e) { message.error('មានបញ្ហា។') }
    }
    function handleSeatEdit(seat) { message.info('សូមលុបហើយបន្ថែមថ្មីដើម្បីកែប្រែទីតាំងកៅអី។') }
    async function handleSeatDelete(seat) {
      try { await store.dispatch('meetingRoomSeat/delete', { id: seat.id }); message.success('បានលុបកៅអី។'); fetchSeats() } catch (e) { message.error('មានបញ្ហា។') }
    }
    async function handleSeatBatchAdd(batch) {
      try { await store.dispatch('meetingRoomSeat/batchCreate', { room_id: roomId.value, seats: batch }); message.success('បានបង្កើតកៅអី។'); fetchSeats() } catch (e) { message.error('មានបញ្ហា។') }
    }
    async function handleSeatClear() {
      try { await store.dispatch('meetingRoomSeat/clearAll', { room_id: roomId.value }); message.success('បានលុបទាំងអស់។'); fetchSeats() } catch (e) { message.error('មានបញ្ហា។') }
    }

    async function uploadRoomPhoto({ file }) {
      const fd = new FormData()
      fd.append('files', file.file)
      fd.append('id', roomId.value)
      try {
        await store.dispatch('meetingRoom/uploadPicture', fd)
        message.success('បានផ្ទុករូបថត។')
        fetchRoom()
      } catch (e) { message.error('មានបញ្ហា។') }
    }

    onMounted(() => { fetchRoom(); fetchEquipment(); fetchSeats() })

    return {
      room, activeTab, toggleRoomActive,
      equipment, equipLoading, showEquipModal, editingEquipId, equipForm, categoryOptions, openEquipModal, editEquipment, saveEquipment, toggleEquipStatus, deleteEquipment,
      seats, seatLoading, handleSeatAdd, handleSeatEdit, handleSeatDelete, handleSeatBatchAdd, handleSeatClear,
      uploadRoomPhoto
    }
  }
}
</script>

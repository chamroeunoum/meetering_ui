<template>
  <div class="seat-layout">
    <!-- Toolbar -->
    <div class="flex items-center gap-2 mb-3 flex-wrap">
      <n-dropdown trigger="click" :options="layoutTemplates" @select="applyTemplate">
        <n-button size="tiny" type="primary">ប្លង់កៅអី ▾</n-button>
      </n-dropdown>
      <n-button size="tiny" @click="addSeatManually">+ បន្ថែមកៅអី</n-button>
      <n-button size="tiny" quaternary type="error" @click="clearAllSeats">លុបទាំងអស់</n-button>
      <span class="text-xs text-gray-500 ml-auto">{{ seats.length }} កៅអី</span>
    </div>

    <!-- Layout grid -->
    <div v-if="seats.length === 0" class="text-center text-gray-400 py-12 border-2 border-dashed border-gray-200 rounded-lg">
      <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 21h18V8l-7-5H3v18z" fill="currentColor"/></svg>
      <div class="text-sm mb-2">មិនទាន់មានកៅអីនៅឡើយទេ។</div>
      <n-button size="small" type="primary" @click="autoLayout">បង្កើតកៅអីស្វ័យប្រវត្តិ</n-button>
    </div>

    <div v-else class="layout-canvas bg-gray-50 border border-gray-200 rounded-lg p-6 overflow-auto" @click.self="handleCanvasClick">
      <!-- Head table row -->
      <div v-if="headSeats.length > 0" class="mb-6">
        <div class="text-xs text-gray-500 mb-2 font-semibold">តុប្រធាន (Head Table)</div>
        <div class="flex justify-center gap-3">
          <div v-for="seat in headSeats" :key="seat.id"
            class="seat-box seat-head"
            :style="seatStyle(seat)">
            <div class="seat-label">{{ seat.seat_number }}</div>
            <div class="seat-actions">
              <svg @click.stop="$emit('edit', seat)" class="w-4 h-4 cursor-pointer hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/></svg>
              <svg @click.stop="$emit('delete', seat)" class="w-4 h-4 cursor-pointer hover:text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z" fill="currentColor"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Side rows -->
      <div v-if="sideSeats.length > 0" class="mb-6">
        <div class="text-xs text-gray-500 mb-2 font-semibold">ជួរចំហៀង (Side Rows)</div>
        <div v-for="(row, rIdx) in groupedSideRows" :key="rIdx" class="flex justify-center gap-3 mb-2">
          <div v-for="seat in row" :key="seat.id"
            class="seat-box seat-side"
            :style="seatStyle(seat)">
            <div class="seat-label">{{ seat.seat_number }}</div>
            <div class="seat-actions">
              <svg @click.stop="$emit('edit', seat)" class="w-4 h-4 cursor-pointer hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/></svg>
              <svg @click.stop="$emit('delete', seat)" class="w-4 h-4 cursor-pointer hover:text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z" fill="currentColor"/></svg>
            </div>
          </div>
          <div class="text-xs text-gray-400 self-center ml-2 w-16">ជួរ {{ rIdx + 1 }}</div>
        </div>
      </div>

      <!-- Audience area -->
      <div v-if="audienceSeats.length > 0">
        <div class="text-xs text-gray-500 mb-2 font-semibold">ទស្សនិកជន (Audience)</div>
        <div class="grid" :style="{ gridTemplateColumns: `repeat(${audienceCols}, 64px)`, gap: '8px', justifyContent: 'center' }">
          <div v-for="seat in audienceSeats" :key="seat.id"
            class="seat-box seat-audience"
            :style="seatStyle(seat)">
            <div class="seat-label">{{ seat.seat_number }}</div>
            <div class="seat-actions">
              <svg @click.stop="$emit('edit', seat)" class="w-4 h-4 cursor-pointer hover:text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/></svg>
              <svg @click.stop="$emit('delete', seat)" class="w-4 h-4 cursor-pointer hover:text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z" fill="currentColor"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Manual add modal -->
    <n-modal v-model:show="showAddModal" :mask-closable="false">
      <n-card title="បន្ថែមកៅអី" style="width:420px" size="small">
        <n-space vertical>
          <n-input v-model:value="newSeat.seat_number" placeholder="លេខកៅអី (ឧ. A1)" />
          <n-input v-model:value="newSeat.label" placeholder="ស្លាក (ឧ. ប្រធាន)" />
          <n-input-number v-model:value="newSeat.row_number" :min="1" placeholder="ជួរដេកទី" />
          <n-input-number v-model:value="newSeat.column_number" :min="1" placeholder="ជួរឈរទី" />
          <n-select v-model:value="newSeat.seat_type" :options="seatTypeOptions" placeholder="ប្រភេទ" />
        </n-space>
        <template #footer>
          <n-space justify="end">
            <n-button @click="showAddModal = false">បោះបង់</n-button>
            <n-button type="primary" @click="saveNewSeat">បន្ថែម</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useMessage } from 'naive-ui'

export default {
  name: 'SeatLayout',
  props: {
    seats: { type: Array, default: () => [] },
    roomId: { type: Number, default: 0 }
  },
  emits: ['edit', 'delete', 'add', 'batch-add', 'clear'],
  setup(props, { emit }) {
    const message = useMessage()
    const showAddModal = ref(false)
    const newSeat = reactive({ seat_number: '', label: '', row_number: 1, column_number: 1, seat_type: 'side_row' })

    const seatTypeOptions = [
      { label: 'តុប្រធាន', value: 'head_table' },
      { label: 'ជួរចំហៀង', value: 'side_row' },
      { label: 'ទស្សនិកជន', value: 'audience' },
    ]

    const headSeats = computed(() => props.seats.filter(s => s.seat_type === 'head_table').sort((a, b) => (a.column_number || 0) - (b.column_number || 0)))
    const sideSeats = computed(() => props.seats.filter(s => s.seat_type === 'side_row'))
    const audienceSeats = computed(() => props.seats.filter(s => s.seat_type === 'audience'))

    const groupedSideRows = computed(() => {
      const map = {}
      sideSeats.value.forEach(s => {
        const r = s.row_number || 1
        if (!map[r]) map[r] = []
        map[r].push(s)
      })
      return Object.values(map).map(row => row.sort((a, b) => (a.column_number || 0) - (b.column_number || 0)))
    })

    const audienceCols = computed(() => {
      const cols = audienceSeats.value.map(s => s.column_number || 1)
      return cols.length > 0 ? Math.max(...cols) : 4
    })

    function seatStyle(seat) {
      return {}
    }

    const layoutTemplates = [
      { label: 'លំនាំដើម (Default)', key: 'default' },
      { label: 'តុប្រជុំកណ្តាល (Boardroom)', key: 'boardroom' },
      { label: 'សាលសន្និសីទ (Conference)', key: 'conference' },
    ]

    function autoLayout() { applyTemplate('default') }

    function applyTemplate(key) {
      const batch = []
      if (key === 'default') {
        // Head table: 5 seats
        for (let c = 1; c <= 5; c++) {
          batch.push({ seat_number: `H${c}`, label: c === 3 ? 'ប្រធាន' : 'អនុប្រធាន', row_number: 1, column_number: c, seat_type: 'head_table', position_x: c * 110, position_y: 10 })
        }
        // Side rows: 3 rows x 4 seats
        for (let r = 1; r <= 3; r++) {
          for (let c = 1; c <= 4; c++) {
            batch.push({ seat_number: `S${r}-${c}`, label: `កៅអី ${r}-${c}`, row_number: r + 2, column_number: c, seat_type: 'side_row', position_x: c * 110, position_y: 100 + r * 80 })
          }
        }
      } else if (key === 'boardroom') {
        // Leader at head
        batch.push({ seat_number: 'L1', label: 'ប្រធាន', row_number: 1, column_number: 7, seat_type: 'head_table', position_x: 770, position_y: 10 })
        // Left side row: 6 seats
        for (let r = 1; r <= 6; r++) {
          batch.push({ seat_number: `L${r}`, label: `ឆ្វេង ${r}`, row_number: r + 2, column_number: 1, seat_type: 'side_row', position_x: 10, position_y: 100 + r * 60 })
        }
        // Right side row: 6 seats
        for (let r = 1; r <= 6; r++) {
          batch.push({ seat_number: `R${r}`, label: `ស្តាំ ${r}`, row_number: r + 2, column_number: 14, seat_type: 'side_row', position_x: 1540, position_y: 100 + r * 60 })
        }
        // Center table: 5 seats each side (10 total) facing each other
        for (let c = 1; c <= 5; c++) {
          batch.push({ seat_number: `T${c}`, label: `តុ ${c}`, row_number: 5, column_number: c + 3, seat_type: 'audience', position_x: 330 + c * 110, position_y: 250 })
          batch.push({ seat_number: `B${c}`, label: `តុក្រោម ${c}`, row_number: 8, column_number: c + 3, seat_type: 'audience', position_x: 330 + c * 110, position_y: 430 })
        }
      } else if (key === 'conference') {
        // Head table: 7 seats
        for (let c = 1; c <= 7; c++) {
          batch.push({ seat_number: `H${c}`, label: c === 4 ? 'ប្រធាន' : 'អនុប្រធាន', row_number: 1, column_number: c, seat_type: 'head_table', position_x: c * 110, position_y: 10 })
        }
        // Audience rows: 4 rows x 6 seats
        for (let r = 1; r <= 4; r++) {
          for (let c = 1; c <= 6; c++) {
            batch.push({ seat_number: `A${r}-${c}`, label: `កៅអី ${r}-${c}`, row_number: r + 2, column_number: c + 1, seat_type: 'audience', position_x: c * 110, position_y: 100 + r * 80 })
          }
        }
      }
      emit('batch-add', batch)
    }

    function clearAllSeats() { emit('clear') }

    function addSeatManually() {
      newSeat.seat_number = ''; newSeat.label = ''; newSeat.row_number = 1; newSeat.column_number = 1; newSeat.seat_type = 'side_row'
      showAddModal.value = true
    }

    function saveNewSeat() {
      if (!newSeat.seat_number.trim()) { message.warning('សូមបញ្ចូលលេខកៅអី។'); return }
      emit('add', { ...newSeat, position_x: (newSeat.column_number || 1) * 100, position_y: (newSeat.row_number || 1) * 80 })
      showAddModal.value = false
    }

    function handleCanvasClick(e) {
      // Only trigger if clicking on empty canvas (not on a seat)
      if (e.target === e.currentTarget) {
        addSeatManually()
      }
    }

    return { showAddModal, newSeat, seatTypeOptions, headSeats, sideSeats, groupedSideRows, audienceSeats, audienceCols, seatStyle, layoutTemplates, applyTemplate, autoLayout, clearAllSeats, addSeatManually, saveNewSeat, handleCanvasClick }
  }
}
</script>

<style scoped>
.seat-box {
  @apply w-14 h-14 rounded-lg border-2 flex flex-col items-center justify-center relative cursor-pointer transition-all duration-200 hover:shadow;
}
.seat-label {
  @apply text-xs font-semibold;
}
.seat-actions {
  @apply absolute -top-2 -right-1 flex gap-0.5 opacity-0 transition-opacity bg-white rounded px-0.5;
}
.seat-box:hover .seat-actions {
  @apply opacity-100;
}
.seat-head {
  @apply border-amber-400 bg-amber-50 text-amber-700;
}
.seat-side {
  @apply border-blue-400 bg-blue-50 text-blue-700;
}
.seat-audience {
  @apply border-gray-300 bg-gray-50 text-gray-600;
}
</style>

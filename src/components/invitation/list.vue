<template>
  <div class="w-full p-4">
    <!-- Top action panel -->
    <div class="flex title-bar border-b border-default p-2 h-12 items-center">
      <div class="flex w-64 h-8 title items-center">
        <svg class="flex-none w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>
        <div class="font-moul ml-2 h-8 leading-9 text-secondary">គ្រប់គ្រងការអញ្ជើញ</div>
      </div>
    </div>

    <div class="flex gap-4 mt-4 flex-wrap lg:flex-nowrap">
      <!-- Meeting sidebar -->
      <div class="flex-none w-full lg:w-80 border border-default rounded-lg bg-card overflow-hidden flex flex-col" style="height: calc(100vh - 140px);">
        <div class="p-2 border-b border-default">
          <div class="relative h-8">
            <input type="text" v-model="meetingSearch" @keypress.enter="loadMeetings"
              class="bg-gray-100 dark:bg-gray-700 px-2 h-8 w-full rounded border border-default focus:border-blue-600 duration-300 text-secondary text-sm"
              placeholder="ស្វែងរកកិច្ចប្រជុំ..." />
            <svg class="absolute right-1 top-1 w-6 h-6 text-muted cursor-pointer" @click="loadMeetings"
              viewBox="0 0 20 20"><g fill="none"><path d="M8.5 3a5.5 5.5 0 0 1 4.227 9.02l4.127 4.126a.5.5 0 0 1-.638.765l-.07-.057l-4.126-4.127A5.5 5.5 0 1 1 8.5 3zm0 1a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9z" fill="currentColor"/></g></svg>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div v-if="loadingMeetings" class="flex justify-center py-10"><n-spin size="small" /></div>
          <template v-else>
            <button v-for="m in meetings" :key="m.id" type="button" @click="selectMeeting(m)"
              :class="['w-full text-left p-3 border-b border-default transition-colors',
                selectedMeeting && selectedMeeting.id===m.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40']">
              <div class="font-bold text-sm truncate">{{ m.objective || 'គ្មានចំណងជើង' }}</div>
              <div v-if="m.meeting_code" class="text-xs text-muted mt-1 font-mono">{{ m.meeting_code }}</div>
              <div class="text-xs text-muted mt-1">{{ formatDate(m.date) }} · {{ m.start }} - {{ m.end }}</div>
            </button>
            <div v-if="!meetings.length" class="p-6 text-center text-muted text-sm">មិនមានកិច្ចប្រជុំ</div>
          </template>
        </div>
      </div>

      <!-- Main content -->
      <div class="flex-1 min-w-0 flex flex-col" style="height: calc(100vh - 140px);">
        <template v-if="selectedMeeting">
          <div class="flex items-center justify-between gap-3 p-3 border border-default rounded-lg bg-card mb-3 flex-wrap">
            <div class="min-w-0">
              <div class="font-bold text-secondary truncate">{{ selectedMeeting.objective }}</div>
              <div class="text-xs text-muted mt-0.5">
                <span v-if="selectedMeeting.meeting_code" class="font-mono">{{ selectedMeeting.meeting_code }}</span>
                · {{ formatDate(selectedMeeting.date) }} {{ selectedMeeting.start }}-{{ selectedMeeting.end }}
              </div>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <n-tag size="small" type="info">{{ invitations.length }} អ្នកចូលរួម</n-tag>
              <n-tag size="small" type="success">{{ sentCount }} បានផ្ញើ</n-tag>
              <n-tag size="small" type="warning">{{ checkedInCount }} បានចូល</n-tag>
              <n-button size="small" type="primary" :disabled="allCodesGenerated" :loading="generating" @click="handleGenerateCodes">
                បង្កើតលេខកូដទាំងអស់
              </n-button>
              <n-button size="small" type="success" :disabled="!hasUnsent" :loading="sendingAll" @click="handleSendAll">
                ផ្ញើអ៊ីមែលទាំងអស់
              </n-button>
              <n-button size="small" :loading="sendingTelegramAll" style="background:#26a5e4;color:#fff" @click="handleSendTelegramAll">
                Telegram ទាំងអស់
              </n-button>
            </div>
          </div>

          <div class="flex-1 overflow-auto border border-default rounded-lg bg-card">
            <div v-if="loadingInvitations" class="flex justify-center py-10"><n-spin size="small" /></div>
            <table v-else class="w-full text-sm border-collapse">
              <thead>
                <tr class="text-left text-xs text-muted uppercase">
                  <th class="p-3">ឈ្មោះ</th>
                  <th class="p-3">តួនាទី</th>
                  <th class="p-3">ទំនាក់ទំនង</th>
                  <th class="p-3">លេខកូដ</th>
                  <th class="p-3">ស្ថានភាព</th>
                  <th class="p-3 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="inv in invitations" :key="inv.id" class="border-b border-default hover:bg-gray-50 dark:hover:bg-gray-800/40 text-secondary">
                  <td class="p-3"><strong>{{ inv.name }}</strong></td>
                  <td class="p-3 text-muted">{{ roleLabel(inv.role) }}</td>
                  <td class="p-3 text-muted">
                    <div v-if="inv.email" class="truncate max-w-[180px]">{{ inv.email }}</div>
                    <div v-if="inv.telegram" class="text-xs" style="color:#26a5e4">{{ inv.telegram }}</div>
                    <div v-if="!inv.email && !inv.telegram">—</div>
                  </td>
                  <td class="p-3">
                    <template v-if="inv.unique_code">
                      <code class="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{{ inv.unique_code }}</code>
                      <n-button size="tiny" quaternary @click="copyCode(inv.unique_code)" title="ចម្លងលេខកូដ">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      </n-button>
                      <n-button size="tiny" quaternary @click="openQrModal(inv)" title="QR ចុះឈ្មោះចូលរួម">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M21 14h-.01M21 21h-3M14 21v-3"/></svg>
                      </n-button>
                    </template>
                    <n-button v-else size="tiny" quaternary type="primary" @click="handleGenerateSingleCode(inv)">បង្កើតលេខកូដ</n-button>
                  </td>
                  <td class="p-3">
                    <n-tag size="small" :type="inv.invitation_sent ? 'success' : 'warning'">{{ inv.invitation_sent ? 'បានផ្ញើ' : 'មិនទាន់ផ្ញើ' }}</n-tag>
                    <n-tag v-if="inv.checked_in" size="small" type="info" class="ml-1">បានចូលរួម</n-tag>
                  </td>
                  <td class="p-3 text-right whitespace-nowrap">
                    <template v-if="!inv.invitation_sent">
                      <n-button size="tiny" type="primary" :disabled="!inv.unique_code" @click="handleSendInvitation(inv)">អ៊ីមែល</n-button>
                      <n-button size="tiny" :disabled="!inv.unique_code" style="background:#26a5e4;color:#fff" @click="handleSendTelegram(inv)">Telegram</n-button>
                    </template>
                    <n-button v-else size="tiny" quaternary @click="handleMarkSent(inv)">មិនទាន់ផ្ញើ</n-button>
                  </td>
                </tr>
                <tr v-if="!invitations.length">
                  <td colspan="6" class="p-10 text-center text-muted">មិនមានអ្នកចូលរួម</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <div v-else class="flex-1 flex items-center justify-center text-muted border border-dashed border-default rounded-lg">
          សូមជ្រើសរើសកិច្ចប្រជុំ
        </div>
      </div>
    </div>

    <!-- QR modal -->
    <n-modal v-model:show="showQrModal" preset="card" title="QR សម្រាប់ចុះឈ្មោះចូលរួម" style="max-width:420px" :mask-closable="true">
      <div class="flex flex-col items-center gap-3" v-if="qrTarget">
        <div ref="qrWrapRef" class="p-3 bg-white rounded-lg border border-default">
          <qrcode-vue :value="qrCheckinUrl" :size="240" render-as="canvas" level="M" />
        </div>
        <div class="text-sm font-bold">{{ qrTarget.name }}</div>
        <div class="text-xs text-muted font-mono">{{ qrTarget.unique_code }}</div>
        <div class="text-xs text-muted break-all text-center px-2">{{ qrCheckinUrl }}</div>
        <div class="flex gap-2">
          <n-button size="small" type="primary" @click="downloadQr">ទាញយក PNG</n-button>
          <n-button size="small" @click="copyQrUrl">ចម្លងតំណ</n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useMessage, useNotification } from 'naive-ui'
import dateFormat from 'dateformat'
import QrcodeVue from 'qrcode.vue'

export default {
  name: 'InvitationList',
  components: { QrcodeVue },
  setup() {
    const store = useStore()
    const message = useMessage()
    const notify = useNotification()

    const meetings = ref([])
    const loadingMeetings = ref(false)
    const meetingSearch = ref('')
    const selectedMeeting = ref(null)
    const invitations = ref([])
    const loadingInvitations = ref(false)
    const generating = ref(false)
    const sendingAll = ref(false)
    const sendingTelegramAll = ref(false)
    const showQrModal = ref(false)
    const qrWrapRef = ref(null)

    function formatDate(d) {
      if (!d) return ''
      try { return dateFormat(new Date(d), 'dd-mm-yyyy') } catch { return d }
    }

    const roleLabels = { leader: 'អ្នកដឹកនាំប្រជុំ', deputy_leader: 'អនុប្រធាន', member: 'សមាជិក' }
    function roleLabel(r) { return roleLabels[r] || r || '—' }

    async function loadMeetings() {
      loadingMeetings.value = true
      try {
        const res = await store.dispatch('meeting/list', { search: meetingSearch.value, perPage: 100, page: 1 })
        const records = res.data?.records
        meetings.value = Array.isArray(records) ? records : (records?.data || [])
      } catch (e) {
        notify.error({ title: 'កំហុស', description: 'មិនអាចផ្ទុកបញ្ជីកិច្ចប្រជុំបានទេ' })
        meetings.value = []
      } finally {
        loadingMeetings.value = false
      }
    }

    async function selectMeeting(m) {
      selectedMeeting.value = m
      await loadInvitations()
    }

    async function loadInvitations() {
      if (!selectedMeeting.value) return
      loadingInvitations.value = true
      try {
        const res = await store.dispatch('meetingInvitation/list', { meeting_id: selectedMeeting.value.id })
        invitations.value = res.data?.data || []
      } catch (e) {
        invitations.value = []
      } finally {
        loadingInvitations.value = false
      }
    }

    const sentCount = computed(() => invitations.value.filter(i => i.invitation_sent).length)
    const checkedInCount = computed(() => invitations.value.filter(i => i.checked_in).length)
    const allCodesGenerated = computed(() => invitations.value.length > 0 && invitations.value.every(i => i.unique_code))
    const hasUnsent = computed(() => invitations.value.some(i => !i.invitation_sent && i.unique_code))

    async function handleGenerateCodes() {
      if (!selectedMeeting.value) return
      generating.value = true
      try {
        const res = await store.dispatch('meetingInvitation/generateCodes', { meeting_id: selectedMeeting.value.id })
        await loadInvitations()
        message.success(res.data?.message || 'បានបង្កើតលេខកូដ')
      } catch (e) {
        notify.error({ title: 'កំហុស', description: 'បង្កើតលេខកូដមិនបានជោគជ័យ' })
      } finally {
        generating.value = false
      }
    }

    async function handleGenerateSingleCode(inv) {
      if (!selectedMeeting.value) return
      try {
        const res = await store.dispatch('meetingInvitation/generateSingleCode', { meeting_id: selectedMeeting.value.id, member_id: inv.id })
        await loadInvitations()
        message.success(res.data?.message || 'បានបង្កើតលេខកូដ')
      } catch (e) {
        notify.error({ title: 'កំហុស', description: 'បង្កើតលេខកូដមិនបានជោគជ័យ' })
      }
    }

    function copyCode(code) {
      navigator.clipboard.writeText(code)
      message.success('បានចម្លងលេខកូដ')
    }

    async function handleMarkSent(inv) {
      if (!selectedMeeting.value) return
      try {
        await store.dispatch('meetingInvitation/markSent', { meeting_id: selectedMeeting.value.id, member_id: inv.id })
        await loadInvitations()
        message.success('បានសម្គាល់ថាបានផ្ញើការអញ្ជើញ')
      } catch (e) {
        notify.error({ title: 'កំហុស', description: 'ដំណើរការមិនបានជោគជ័យ' })
      }
    }

    async function handleSendInvitation(inv) {
      if (!selectedMeeting.value) return
      try {
        const res = await store.dispatch('meetingInvitation/sendInvitation', { meeting_id: selectedMeeting.value.id, member_id: inv.id })
        await loadInvitations()
        message.success(res.data?.message || 'បានផ្ញើការអញ្ជើញតាមអ៊ីមែល')
      } catch (e) {
        notify.error({ title: 'កំហុស', description: e.response?.data?.message || 'ផ្ញើអ៊ីមែលមិនបានជោគជ័យ' })
      }
    }

    async function handleSendAll() {
      if (!selectedMeeting.value) return
      sendingAll.value = true
      try {
        const res = await store.dispatch('meetingInvitation/sendAllInvitations', { meeting_id: selectedMeeting.value.id })
        await loadInvitations()
        message.success(res.data?.message || 'បានផ្ញើការអញ្ជើញទាំងអស់')
      } catch (e) {
        notify.error({ title: 'កំហុស', description: e.response?.data?.message || 'ផ្ញើអ៊ីមែលមិនបានជោគជ័យ' })
      } finally {
        sendingAll.value = false
      }
    }

    async function handleSendTelegram(inv) {
      if (!selectedMeeting.value) return
      try {
        const res = await store.dispatch('meetingInvitation/sendTelegram', { meeting_id: selectedMeeting.value.id, member_id: inv.id })
        message.success(res.data?.message || 'បានផ្ញើតាម Telegram')
      } catch (e) {
        notify.error({ title: 'កំហុស', description: e.response?.data?.message || 'ផ្ញើ Telegram មិនបានជោគជ័យ' })
      }
    }

    async function handleSendTelegramAll() {
      if (!selectedMeeting.value) return
      sendingTelegramAll.value = true
      try {
        const res = await store.dispatch('meetingInvitation/sendTelegramAll', { meeting_id: selectedMeeting.value.id })
        message.success(res.data?.message || 'បានផ្ញើតាម Telegram ទាំងអស់')
      } catch (e) {
        notify.error({ title: 'កំហុស', description: e.response?.data?.message || 'ផ្ញើ Telegram មិនបានជោគជ័យ' })
      } finally {
        sendingTelegramAll.value = false
      }
    }

    // Check-in verification (InvitationController::verifyCode) looks up the
    // scanned code against each attendee's own participant_invitations.unique_code
    // — there is no meeting-wide code — so the QR is generated per attendee.
    const participantServer = import.meta.env.VITE_PARTICIPANT_SERVER || 'http://127.0.0.1:3008'
    const qrTarget = ref(null)
    const qrCheckinUrl = computed(() => {
      if (!qrTarget.value?.unique_code) return ''
      return participantServer + '/checkin?code=' + encodeURIComponent(qrTarget.value.unique_code)
    })

    function openQrModal(inv) {
      qrTarget.value = inv
      showQrModal.value = true
    }

    function downloadQr() {
      const canvas = qrWrapRef.value?.querySelector('canvas')
      if (!canvas) return
      const link = document.createElement('a')
      link.download = (qrTarget.value?.unique_code || 'qrcode') + '.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    function copyQrUrl() {
      if (!qrCheckinUrl.value) return
      navigator.clipboard.writeText(qrCheckinUrl.value)
      message.success('បានចម្លងតំណ')
    }

    loadMeetings()

    return {
      meetings, loadingMeetings, meetingSearch, selectedMeeting, invitations, loadingInvitations,
      generating, sendingAll, sendingTelegramAll, showQrModal, qrWrapRef, qrTarget,
      formatDate, roleLabel, loadMeetings, selectMeeting,
      sentCount, checkedInCount, allCodesGenerated, hasUnsent,
      handleGenerateCodes, handleGenerateSingleCode, copyCode, handleMarkSent,
      handleSendInvitation, handleSendAll, handleSendTelegram, handleSendTelegramAll,
      qrCheckinUrl, openQrModal, downloadQr, copyQrUrl,
    }
  },
}
</script>

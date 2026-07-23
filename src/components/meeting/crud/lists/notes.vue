<template>
  <div class="speech-notes-page">
    <!-- Header -->
    <div class="sn-header">
      <div class="sn-header-left">
        <n-button size="small" quaternary @click="goBack">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M12.707 5.293a1 1 0 0 1 0 1.414L9.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0z"/></svg>
        </n-button>
        <div>
          <h1 class="sn-title">កំណត់ហេតុកិច្ចប្រជុំ</h1>
          <p v-if="meeting" class="sn-objective">{{ meeting.objective }}</p>
        </div>
      </div>
      <div class="sn-header-right">
        <n-button size="small" secondary :loading="generating" :disabled="speechNotes.length === 0" @click="generateBrief">
          <template #icon>
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </template>
          បង្កើតរបាយការណ៍សង្ខេប
        </n-button>
      </div>
    </div>

    <!-- Split panel -->
    <div class="sn-body">
      <!-- Left: Participant list -->
      <div class="sn-panel-left">
        <div class="sn-panel-title">អ្នកចូលរួម</div>
        <div class="sn-search-box">
          <svg class="sn-search-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
          <input v-model="searchQuery" type="text" class="sn-search-input" placeholder="ស្វែងរកតាមឈ្មោះ ឬលេខកៅអី..." />
        </div>
        <div class="sn-participants">
          <div
            v-for="p in filteredParticipants"
            :key="p.member_id"
            class="sn-participant"
            :class="{ active: selectedMemberId === p.member_id, hasNote: p.has_note }"
            @click="selectParticipant(p)"
          >
            <div class="sn-avatar">{{ p.initials }}</div>
            <div class="sn-p-info">
              <div class="sn-p-name">
                <span v-if="p.seat" class="sn-seat-badge">{{ p.seat }}</span>
                {{ p.name }}
              </div>
            </div>
            <div v-if="p.has_note" class="sn-dot" title="មានកំណត់ហេតុ"></div>
          </div>
          <div v-if="filteredParticipants.length === 0" class="sn-empty">
            {{ participants.length === 0 ? 'គ្មានអ្នកចូលរួម' : 'រកមិនឃើញ' }}
          </div>
        </div>
      </div>

      <!-- Right: Speech note editor -->
      <div class="sn-panel-right">
        <template v-if="selectedParticipant">
          <div class="sn-editor-header">
            <span class="sn-editor-label">កំណត់ហេតុសម្រាប់: <strong>{{ selectedParticipant.name }}</strong></span>
            <n-button size="tiny" type="primary" :loading="saving" :disabled="!dirty" @click="saveNote">
              រក្សាទុក
            </n-button>
          </div>
          <div class="sn-editor-body">
            <QuillEditor
              ref="quillRef"
              v-model:content="currentContent"
              content-type="html"
              :options="editorOptions"
              style="min-height: 400px; height: 100%;"
              @update:content="onContentChange"
            />
          </div>
        </template>
        <div v-else class="sn-no-selection">
          <svg class="w-16 h-16 text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          <p class="text-gray-400">សូមជ្រើសរើសអ្នកចូលរួម<br/>ដើម្បីកត់ត្រាសម្ដី</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useMessage } from 'naive-ui'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { getAuthorization } from '../../../../plugins/authentication'
import axios from 'axios'

export default {
  components: { QuillEditor },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const message = useMessage()

    const meeting = ref(null)
    const participants = ref([])
    const speechNotes = ref([])
    const selectedMemberId = ref(null)
    const currentContent = ref('')
    const saving = ref(false)
    const generating = ref(false)
    const dirty = ref(false)
    const quillRef = ref(null)
    const searchQuery = ref('')
    // seat data now comes from API as m.seat_number

    const server = import.meta.env.VITE_API_SERVER || 'http://127.0.0.1:8888/api/meeting'

    function getMeetingId() {
      if (route.params.id) return route.params.id
      try {
        const m = window.location.pathname.match(/\/meetings\/([^\/]+)\/notes/)
        if (m) return m[1]
        const m2 = window.location.pathname.match(/\/meetings\/([^\/]+)/)
        if (m2 && !m2[1].match(/^(notes|schedule)$/)) return m2[1]
      } catch {}
      return null
    }

    const meetingId = computed(getMeetingId)

    function goBack() {
      const id = getMeetingId()
      if (id) router.push('/meetings/' + id)
      else router.push('/meetings')
    }

    const editorOptions = {
      theme: 'snow',
      placeholder: 'វាយបញ្ចូលសម្ដីរបស់អ្នកចូលរួមនៅទីនេះ...',
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
      },
    }

    const filteredParticipants = computed(() => {
      var q = searchQuery.value.toLowerCase().trim()
      if (!q) return participants.value
      return participants.value.filter(function(p) {
        var seatStr = p.seat ? String(p.seat).toLowerCase() : ''
        var matchName = p.name.toLowerCase().includes(q)
        var matchSeat = seatStr.includes(q)
        return matchName || matchSeat
      })
    })

    const selectedParticipant = computed(() => {
      return participants.value.find(p => p.member_id === selectedMemberId.value) || null
    })

    async function loadMeeting() {
      var mid = meetingId.value
      if (!mid) return
      try {
        const res = await store.dispatch('meeting/read', { id: mid })
        meeting.value = res?.data?.record || res?.data || res
      } catch (e) { console.error('[notes] loadMeeting error:', e) }
    }

    async function loadMembers() {
      var mid = meetingId.value
      if (!mid) return
      try {
        const res = await axios.get(server + '/meetings/' + mid + '/read', {
          headers: { Authorization: getAuthorization() }
        })
        const json = res.data
        const record = json?.record || json?.data?.record || json
        const members = record?.members || record?.listMembers || []
        console.log('[notes] member IDs:', members.map(function(x) { return x.id }))
        participants.value = members.map(function(m) {
          var fn = ''
          var ln = ''
          // Support both flat member and nested member object
          var memberData = m.member || m
          fn = memberData.firstname || ''
          ln = memberData.lastname || ''
          var mid2 = m.meeting_member_id || m.id
          var name = (fn || ln) ? (fn + ' ' + ln).trim() : 'មិនស្គាល់'
          var seatNum = m.seat_number || null
          return {
            member_id: mid2,
            people_id: m.people_id || memberData?.id,
            name: name,
            initials: (fn.charAt(0) || '') + (ln.charAt(0) || '?'),
            seat: seatNum,
            has_note: false,
          }
        })
      } catch (e) { console.error('[notes] loadMembers error:', e) }
    }

    async function loadSpeechNotes() {
      var mid = meetingId.value
      if (!mid) return
      try {
        const res = await axios.get(server + '/meetings/' + mid + '/speech-notes', {
          headers: { Authorization: getAuthorization() }
        })
        speechNotes.value = res.data?.data || []
        applyNoteStatus()
      } catch (e) { console.error('[notes] loadSpeechNotes error:', e) }
    }

    function selectParticipant(p) {
      selectedMemberId.value = p.member_id
      dirty.value = false

      // Force-clear editor via Quill API
      var q = quillRef.value
      if (q && q.getQuill) {
        var inst = q.getQuill()
        if (inst) inst.setText('')
      }
      currentContent.value = ''
      const existing = speechNotes.value.find(n => n.meeting_member_id === p.member_id)
      if (existing?.content) {
        setTimeout(function() { currentContent.value = existing.content }, 50)
      }
    }

    function onContentChange() {
      dirty.value = true
    }

    async function saveNote() {
      if (!selectedMemberId.value) return
      saving.value = true
      try {
        const p = selectedParticipant.value
        const res = await axios.post(server + '/meetings/' + meetingId.value + '/speech-notes', {
          meeting_member_id: selectedMemberId.value,
          people_id: p?.people_id || null,
          content: currentContent.value || '',
        }, {
          headers: { Authorization: getAuthorization() }
        })
        if (res.data?.success) {
          dirty.value = false
          // Update local cache
          const idx = speechNotes.value.findIndex(n => n.meeting_member_id === selectedMemberId.value)
          if (idx >= 0) {
            speechNotes.value[idx].content = currentContent.value
            speechNotes.value[idx].updated_at = res.data.data?.updated_at
          } else {
            speechNotes.value.push({
              meeting_member_id: selectedMemberId.value,
              people_id: p?.people_id || null,
              content: currentContent.value,
              id: res.data.data?.id,
            })
          }
          // Mark participant
          const part = participants.value.find(x => x.member_id === selectedMemberId.value)
          if (part) part.has_note = true
          message.success('បានរក្សាទុក')
        }
      } catch (e) {
        console.error('[notes] saveNote error:', e)
        message.error('មិនអាចរក្សាទុកបានទេ')
      } finally {
        saving.value = false
      }
    }

    async function generateBrief() {
      generating.value = true
      try {
        const res = await axios.post(server + '/meetings/' + meetingId.value + '/speech-notes/generate-brief', {}, {
          headers: { Authorization: getAuthorization() }
        })
        if (res.data?.success) {
          message.success('បានបង្កើតរបាយការណ៍សង្ខេប')
        } else {
          message.error(res.data?.message || 'មិនអាចបង្កើតបានទេ')
        }
      } catch (e) {
        console.error('[notes] generateBrief error:', e)
        message.error('មិនអាចបង្កើតបានទេ')
      } finally {
        generating.value = false
      }
    }

    async function applyNoteStatus() {
      const notedIds = new Set(speechNotes.value.map(n => n.meeting_member_id))
      participants.value.forEach(p => {
        p.has_note = notedIds.has(p.member_id)
      })
    }

    onMounted(async () => {
      loadMeeting()
      await loadMembers()
      await loadSpeechNotes()
    })

    return {
      meeting,
      participants,
      speechNotes,
      selectedMemberId,
      selectedParticipant,
      currentContent,
      saving,
      generating,
      dirty,
      searchQuery,
      filteredParticipants,
      editorOptions,
      goBack,
      selectParticipant,
      saveNote,
      generateBrief,
      onContentChange,
    }
  }
}
</script>

<style scoped>
.speech-notes-page { display: flex; flex-direction: column; height: calc(100vh - 64px); padding: 16px; }
.sn-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; flex-shrink: 0; }
.sn-header-left { display: flex; align-items: flex-start; gap: 12px; }
.sn-header-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.sn-title { font-family: 'Moul', serif; font-size: 18px; color: #1B2142; line-height: 1.3; }
.sn-objective { font-size: 13px; color: #64748b; margin-top: 2px; }

.sn-body { display: flex; gap: 16px; flex: 1; min-height: 0; }

/* Left panel */
.sn-panel-left { width: 240px; flex-shrink: 0; display: flex; flex-direction: column; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.sn-panel-title { padding: 12px 16px; font-weight: 700; font-size: 13px; color: #1B2142; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
.sn-search-box { position: relative; padding: 8px 12px; border-bottom: 1px solid #e2e8f0; }
.sn-search-icon { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #94a3b8; pointer-events: none; }
.sn-search-input { width: 100%; padding: 8px 8px 8px 32px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; outline: none; transition: border-color 0.15s; box-sizing: border-box; }
.sn-search-input:focus { border-color: #3b82f6; }
.sn-participants { flex: 1; overflow-y: auto; padding: 8px; }
.sn-participant { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; transition: background 0.15s; margin-bottom: 4px; text-align: left; justify-content: flex-start; }
.sn-participant:hover { background: #f1f5f9; }
.sn-participant.active { background: #eff6ff; border: 1px solid #bfdbfe; }
.sn-participant.hasNote { border-left: 3px solid #22c55e; }
.sn-avatar { width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #475569; flex-shrink: 0; }
.sn-p-info { flex: 1; min-width: 0; }
.sn-p-name { font-size: 13px; color: #1B2142; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sn-seat-badge { display: inline-block; background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 700; padding: 0 6px; border-radius: 4px; margin-right: 6px; font-family: "Courier New", monospace; vertical-align: middle; }
.sn-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; flex-shrink: 0; margin-left: auto; }
.sn-empty { padding: 24px; text-align: center; color: #94a3b8; font-size: 13px; }

/* Right panel */
.sn-panel-right { flex: 1; display: flex; flex-direction: column; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.sn-editor-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; flex-shrink: 0; }
.sn-editor-label { font-size: 13px; color: #475569; }
.sn-editor-body { flex: 1; display: flex; flex-direction: column; }
.sn-editor-body :deep(.ql-container) { flex: 1; }
.sn-no-selection { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; font-size: 14px; text-align: center; }
</style>

<template>
  <div class="draft-viewer-page font-ktr h-screen">
    <draft-pdf-section
      mode="page"
      :pdf-url="draft.pdf_url"
      :docx-url="draft.docx_url"
      :editable="meetingEditable"
      :title="draft.title"
      :version="draft.version_number"
      :status="draft.status"
      :regulator="draft.regulator"
      :meeting-id="meetingId"
      :start-with-sidebar="true"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import DraftPdfSection from '../widgets/draft-pdf-section.vue'

export default {
  name: 'DraftViewerPage',
  components: { DraftPdfSection },
  setup() {
    const route = useRoute()
    const store = useStore()
    const draft = ref({})
    // Route is defined as ':id/draft/:draft_id' (see plugins/route.js) — :id is the meeting id.
    const meetingId = computed(() => route.params.id || 0)
    const meetingStatus = ref(0)
    const meetingDate = ref('')
    const isPastMeeting = computed(() => {
      if (!meetingDate.value) return false
      const d = new Date(meetingDate.value)
      if (isNaN(d.getTime())) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      d.setHours(0, 0, 0, 0)
      return d < today
    })
    // Allow comments unless finished (32) — same idea as meeting detail
    const meetingEditable = computed(() => meetingStatus.value !== 32 && !isPastMeeting.value)

    async function loadDraft() {
      if (!meetingId.value) return
      try {
        const res = await store.dispatch('meeting/read', { id: meetingId.value })
        const record = res.data?.ok ? res.data.record : null
        meetingStatus.value = Number(record?.status) || 0
        meetingDate.value = record?.date || ''
        draft.value = record?.legalDraft || {}
      } catch (e) {
        console.error(e)
        draft.value = {}
      }
    }

    onMounted(() => {
      loadDraft()
    })

    return { draft, meetingId, meetingEditable }
  }
}
</script>

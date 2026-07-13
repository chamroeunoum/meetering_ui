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
import DraftPdfSection from '../widgets/draft-pdf-section.vue'

function getMockDraft() {
  return {
    id: 1,
    title: 'សេចក្តីព្រាងគោលនយោបាយទូរគមនាគមន៍',
    status: 'progressing',
    version_number: 4,
    regulator: 'ប្រកាសលេខ ១២៣ ស្តីពីទូរគមនាគមន៍',
    pdf_url: '#',
    docx_url: '#'
  }
}

export default {
  name: 'DraftViewerPage',
  components: { DraftPdfSection },
  setup() {
    const route = useRoute()
    const draft = ref({})
    const meetingId = computed(() => route.query.meeting_id || route.params.meeting_id || 0)
    const meetingStatus = computed(() => parseInt(route.query.meeting_status) || 0)
    const meetingDate = computed(() => route.query.meeting_date || '')
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

    onMounted(() => {
      draft.value = getMockDraft()
    })

    return { draft, meetingId, meetingEditable }
  }
}
</script>

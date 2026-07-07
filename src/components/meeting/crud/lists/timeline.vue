<template>
  <div class="draft-timeline-page font-ktr bg-gray-50 min-h-screen p-4 md:p-6">
    <!-- Header -->
    <div class="mb-6">
      <router-link :to="{name:'MeetingDetail',params:{id:meetingId}}" class="inline-flex items-center text-sm text-gray-500 hover:text-blue-500 transition-colors mb-3">
        <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M10.295 19.716a1 1 0 0 0 1.404-1.424l-5.37-5.292h13.67a1 1 0 0 0 0-2H6.336L11.7 5.707a1 1 0 0 0-1.404-1.424l-6.924 6.822a1.25 1.25 0 0 0 0 1.79l6.924 6.822z" fill="currentColor"></path></g></svg>ត្រឡប់ទៅកិច្ចប្រជុំ
      </router-link>
      <h1 class="font-moul text-xl text-gray-800">ប្រវត្តិកំណែសេចក្តីព្រាង</h1>
      <p class="text-sm text-gray-500 mt-1">{{ draftTitle }}</p>
    </div>

    <!-- Timeline -->
    <div v-if="timeline.length===0" class="text-center text-gray-400 py-12 bg-white rounded-lg border border-dashed border-gray-300">
      <svg class="w-16 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM11.75 6a.75.75 0 0 1 .75.75V12h3.75a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75V6.75a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></g></svg>
      <div>មិនទាន់មានប្រវត្តិកំណែ</div>
    </div>
    <div v-else class="relative">
      <!-- Vertical line -->
      <div class="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>

      <div v-for="(entry,ei) in timeline" :key="ei" class="relative pl-10 md:pl-16 pb-8 last:pb-0">
        <!-- Dot -->
        <div class="absolute left-2 md:left-6 mt-1.5 w-5 h-5 rounded-full border-2 bg-white z-10"
          :class="ei===0?'border-blue-500 bg-blue-500':'border-gray-300'"></div>

        <!-- Meeting card -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-sm transition-all">
          <!-- Meeting header -->
          <div class="flex flex-wrap items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M17.75 3A3.25 3.25 0 0 1 21 6.25v11.5A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3h11.5zm0 1.5H6.25A1.75 1.75 0 0 0 4.5 6.25v11.5c0 .966.784 1.75 1.75 1.75h11.5a1.75 1.75 0 0 0 1.75-1.75V6.25a1.75 1.75 0 0 0-1.75-1.75zM7.75 7a.75.75 0 0 1 .75.75V9.5h7V7.75a.75.75 0 0 1 1.5 0V9.5h.75c.966 0 1.75.784 1.75 1.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.25.25 0 0 0-.25-.25h-.75v.75a.75.75 0 0 1-1.5 0v-.75h-7v.75a.75.75 0 0 1-1.5 0v-.75H7.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h4a.75.75 0 0 1 0 1.5h-4A1.75 1.75 0 0 1 5.5 18.75v-7.5c0-.966.784-1.75 1.75-1.75H8V7.75A.75.75 0 0 1 8.75 7h-1z" fill="currentColor"></path></g></svg>
              <span class="font-bold text-gray-800 text-sm">{{ entry.meeting_date }}</span>
            </div>
            <span v-if="ei===0" class="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">បច្ចុប្បន្ន</span>
            <span v-else class="text-xs text-gray-400">កិច្ចប្រជុំលើកទី {{ timeline.length-ei }}</span>
          </div>

          <!-- Versions for this meeting -->
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-bold text-gray-700 text-sm">កំណែ v{{ entry.version_number }}</h3>
              <span class="text-xs px-2 py-0.5 rounded-full"
                :class="entry.status==='final'?'bg-green-100 text-green-700':'bg-blue-100 text-blue-700'">
                {{ entry.status==='final'?'ចុងក្រោយ':'កំពុងដំណើរការ' }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-3">{{ entry.note || 'មិនមានកំណត់ចំណាំសម្រាប់កំណែនេះ' }}</p>

            <!-- Changes list -->
            <div v-if="entry.changes&&entry.changes.length>0" class="space-y-2">
              <div class="text-xs text-gray-400 font-bold uppercase tracking-wide mb-2">ការផ្លាស់ប្ដូរ</div>
              <div v-for="(change,ci) in entry.changes" :key="ci" class="flex items-start space-x-2 text-sm">
                <svg class="w-4 h-4 text-green-500 flex-none mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM15.78 9.28a.75.75 0 0 1 .073.977l-.073.083l-4.5 4.5a.75.75 0 0 1-.977.073l-.083-.073l-2-2a.75.75 0 0 1 .977-1.133l.083.073L10.75 13.25l3.97-3.97a.75.75 0 0 1 1.06 0z" fill="currentColor"></path></g></svg>
                <span class="text-gray-700">{{ change }}</span>
              </div>
            </div>

            <!-- Regulator references -->
            <div v-if="entry.regulators&&entry.regulators.length>0" class="mt-3 pt-3 border-t border-gray-100">
              <div class="text-xs text-gray-400 font-bold uppercase tracking-wide mb-2">គតិយុត្តយោង</div>
              <div class="flex flex-wrap gap-1">
                <span v-for="(r,ri) in entry.regulators" :key="ri" class="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{{ r }}</span>
              </div>
            </div>

            <!-- Link to view this version's draft -->
            <div class="mt-3 text-right">
              <router-link :to="{name:'DraftViewer',params:{meeting_id:entry.meeting_id,draft_id:entry.meeting_id}}" class="text-xs text-blue-600 hover:text-blue-800 font-bold">
                បើកមើលសេចក្តីព្រាង →
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

function getMockTimeline() {
  return [
    {
      meeting_id: 1,
      meeting_date: '2026-07-15',
      version_number: 4,
      status: 'progressing',
      note: 'កែសម្រួលតាមមតិយោបល់ពីក្រសួងសេដ្ឋកិច្ច — ត្រៀមដាក់អនុម័តក្នុងកិច្ចប្រជុំនេះ',
      changes: [
        'បន្ថែមនិយមន័យ ISP និងប្រតិបត្តិករទូរគមនាគមន៍',
        'កែសម្រួលតារាងទោសប្បញ្ញត្តិ',
        'ពន្យារពេលអនុវត្តពី ៦ ខែ ទៅ ១២ ខែ'
      ],
      regulators: ['ប្រកាសលេខ ១២៣ ស្តីពីទូរគមនាគមន៍', 'អនុក្រឹត្យស្តីពី ISP']
    },
    {
      meeting_id: 2,
      meeting_date: '2026-06-28',
      version_number: 3,
      status: 'final',
      note: 'កែសម្រួលផ្នែកវិសាលភាព និងបន្ថែមទិន្នន័យថវិកា',
      changes: [
        'កំណត់វិសាលភាពឱ្យបានច្បាស់លាស់',
        'បន្ថែមទិន្នន័យថវិកាសម្រាប់ឆមាសទី២'
      ],
      regulators: ['ប្រកាសលេខ ១២៣ ស្តីពីទូរគមនាគមន៍']
    },
    {
      meeting_id: 3,
      meeting_date: '2026-06-15',
      version_number: 2,
      status: 'final',
      note: 'កំណែដំបូងដែលបានពិនិត្យដោយក្រុមការងារបច្ចេកទេស',
      changes: [
        'បញ្ចូលមតិពីក្រុមការងារបច្ចេកទេស',
        'កែសម្រួលរចនាសម្ព័ន្ធឯកសារ'
      ],
      regulators: ['ប្រកាសលេខ ១២៣ ស្តីពីទូរគមនាគមន៍']
    },
    {
      meeting_id: 4,
      meeting_date: '2026-06-01',
      version_number: 1,
      status: 'final',
      note: 'សេចក្តីព្រាងដំបូង — រៀបចំដោយក្រុមការងារគតិយុត្ត',
      changes: [
        'បង្កើតសេចក្តីព្រាងដំបូង'
      ],
      regulators: ['ប្រកាសលេខ ១២៣ ស្តីពីទូរគមនាគមន៍']
    }
  ]
}

export default {
  name:'DraftTimelinePage',
  setup(){
    const route=useRoute()
    const timeline=ref([])
    const meetingId=computed(()=>route.params.meeting_id||0)
    const draftTitle='សេចក្តីព្រាងគោលនយោបាយទូរគមនាគមន៍'

    onMounted(()=>{
      timeline.value=getMockTimeline()
    })

    return {timeline,meetingId,draftTitle}
  }
}
</script>

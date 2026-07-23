<template>
  <div class="draft-timeline-page font-ktr min-h-screen p-4 md:p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-wrap ">
      <router-link :to="{name:'MeetingDetail',params:{id:meetingId}}" class="inline-flex items-center text-sm transition-colors mb-3 float-left">
        <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M10.295 19.716a1 1 0 0 0 1.404-1.424l-5.37-5.292h13.67a1 1 0 0 0 0-2H6.336L11.7 5.707a1 1 0 0 0-1.404-1.424l-6.924 6.822a1.25 1.25 0 0 0 0 1.79l6.924 6.822z" fill="currentColor"></path></g></svg>ត្រឡប់ទៅកិច្ចប្រជុំ
      </router-link>
      <h1 class="font-moul text-xl w-full text-center ">ប្រវត្តិកំណែសេចក្តីព្រាង</h1>
      <p class="text-sm mt-1 font-moul mt-4 ">{{ draftTitle }}</p>
    </div>

    <!-- Timeline -->
    <div v-if="loading" class="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
      <svg class="animate-spin w-8 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48s48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.491-48-48-48z" fill="currentColor"></path></svg>
      <div class="mt-3">កំពុងអាន...</div>
    </div>
    <div v-else-if="timeline.length===0" class="text-center  py-12 bg-white rounded-lg border border-dashed border-gray-300">
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
        <div class="bg-card rounded-lg border border-default overflow-hidden hover:border-blue-300 hover:shadow-sm transition-all">
          <!-- Meeting header -->
          <div class="flex flex-wrap items-center justify-between px-4 py-3 border-b border-default">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M17.75 3A3.25 3.25 0 0 1 21 6.25v11.5A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3h11.5zm0 1.5H6.25A1.75 1.75 0 0 0 4.5 6.25v11.5c0 .966.784 1.75 1.75 1.75h11.5a1.75 1.75 0 0 0 1.75-1.75V6.25a1.75 1.75 0 0 0-1.75-1.75zM7.75 7a.75.75 0 0 1 .75.75V9.5h7V7.75a.75.75 0 0 1 1.5 0V9.5h.75c.966 0 1.75.784 1.75 1.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.25.25 0 0 0-.25-.25h-.75v.75a.75.75 0 0 1-1.5 0v-.75h-7v.75a.75.75 0 0 1-1.5 0v-.75H7.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h4a.75.75 0 0 1 0 1.5h-4A1.75 1.75 0 0 1 5.5 18.75v-7.5c0-.966.784-1.75 1.75-1.75H8V7.75A.75.75 0 0 1 8.75 7h-1z" fill="currentColor"></path></g></svg>
              <span class="font-bold text-sm">{{ entry.meeting_date }}</span>
            </div>
            <span v-if="ei===0" class="text-xs font-bold px-2 py-0.5 rounded-full border border-green-500 text-green-500">បច្ចុប្បន្ន</span>
            <span v-else class="text-xs">កិច្ចប្រជុំលើកទី {{ timeline.length-ei }}</span>
          </div>

          <!-- Versions for this meeting -->
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-bold  text-sm">កំណែ v{{ entry.version_number }}</h3>
              <span class="text-xs px-2 py-0.5 rounded-full"
                :class="entry.status==='final'?'bg-green-100 text-green-700':'bg-blue-100 text-blue-700'">
                {{ entry.status==='final'?'ចុងក្រោយ':'កំពុងដំណើរការ' }}
              </span>
            </div>
            <p class="text-sm  mb-3">{{ entry.note || 'មិនមានកំណត់ចំណាំសម្រាប់កំណែនេះ' }}</p>

            <!-- Changes list -->
            <div v-if="entry.changes&&entry.changes.length>0" class="space-y-2">
              <div class="text-xs  font-bold uppercase tracking-wide mb-2">ការផ្លាស់ប្ដូរ</div>
              <div v-for="(change,ci) in entry.changes" :key="ci" class="flex items-start space-x-2 text-sm">
                <svg class="w-4 h-4 text-green-500 flex-none mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM15.78 9.28a.75.75 0 0 1 .073.977l-.073.083l-4.5 4.5a.75.75 0 0 1-.977.073l-.083-.073l-2-2a.75.75 0 0 1 .977-1.133l.083.073L10.75 13.25l3.97-3.97a.75.75 0 0 1 1.06 0z" fill="currentColor"></path></g></svg>
                <span class="">{{ change }}</span>
              </div>
            </div>

            <!-- Regulator references -->
            <div v-if="entry.regulators&&entry.regulators.length>0" class="mt-3 pt-3 border-t border-gray-100">
              <div class="text-xs  font-bold uppercase tracking-wide mb-2">គតិយុត្តយោង</div>
              <div class="flex flex-wrap gap-1">
                <span v-for="(r,ri) in entry.regulators" :key="ri" class="text-xs border px-2 py-0.5 rounded-full">{{ r }}</span>
              </div>
            </div>

            <!-- Link to view this version's draft -->
            <div class="mt-3 text-right">
              <router-link :to="{name:'DraftViewer',params:{id:entry.meeting_id,draft_id:entry.meeting_id}}" class="text-xs font-bold">
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
import { useStore } from 'vuex'

// A meeting's legal draft "version" is its 1-based position in the chain of
// meetings sharing that legal_draft_id (built via pid continuation) — see
// MeetingController::history()/buildLegalDraftPayload(). There is no separate
// per-version change-summary in the database yet, so entries only carry what
// each meeting in the chain actually has (date/objective/status).
export default {
  name:'DraftTimelinePage',
  setup(){
    const route=useRoute()
    const store=useStore()
    const timeline=ref([])
    const loading=ref(true)
    const meetingId=computed(()=>route.params.id||0)
    const draftTitle=ref('សេចក្តីព្រាង')

    function statusLabel(status){
      return Number(status)===32 ? 'final' : 'progressing'
    }

    async function loadTimeline(){
      loading.value=true
      try{
        const res=await store.dispatch('meeting/history',{id:meetingId.value})
        const draft=res.data?.ok?res.data.record:null
        draftTitle.value=draft?.objective||draft?.title||'សេចក្តីព្រាង'
        const meetings=Array.isArray(draft?.meetings)?draft.meetings:[]
        // Backend returns oldest→newest; show newest first (index 0 = current).
        timeline.value=meetings.slice().reverse().map((m,idx)=>({
          meeting_id:m.id,
          meeting_date:m.date,
          version_number:meetings.length-idx,
          status:statusLabel(m.status),
          note:m.objective||'',
          changes:[],
          regulators:[]
        }))
      }catch(e){
        console.error(e)
        timeline.value=[]
      }finally{
        loading.value=false
      }
    }

    onMounted(()=>{
      loadTimeline()
    })

    return {timeline,meetingId,draftTitle,loading}
  }
}
</script>

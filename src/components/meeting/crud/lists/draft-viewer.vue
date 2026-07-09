<template>
  <div class="draft-viewer-page font-ktr min-h-screen flex flex-col">
    <!-- Header -->
    <div class="border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between flex-none">
      <div class="flex items-center space-x-3 min-w-0">
        <router-link :to="{name:'MeetingDetail',params:{id:meetingId}}" class="flex-none text-blue-500 transition-colors">
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M10.295 19.716a1 1 0 0 0 1.404-1.424l-5.37-5.292h13.67a1 1 0 0 0 0-2H6.336L11.7 5.707a1 1 0 0 0-1.404-1.424l-6.924 6.822a1.25 1.25 0 0 0 0 1.79l6.924 6.822z" fill="currentColor"></path></g></svg>
        </router-link>
        <div class="min-w-0">
          <h1 class="font-moul text-lg truncate">{{ draft.title || 'សេចក្តីព្រាង' }}</h1>
          <div class="flex items-center space-x-2 text-xs ">
            <span class="px-2 py-0.5 rounded-full font-bold" :class="statusClass">{{ statusLabel }}</span>
            <span v-if="draft.version_number">v{{ draft.version_number }}</span>
            <span v-if="draft.regulator">{{ draft.regulator }}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-2 flex-none">
        <n-button size="small" quaternary @click="activeTab='pdf'" :type="activeTab==='pdf'?'primary':'default'">
          <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg>PDF
        </n-button>
        <n-button size="small" quaternary @click="activeTab='docx'" :type="activeTab==='docx'?'primary':'default'">
          <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M8.75 11.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0 2.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0 2.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5z" fill="currentColor"></path></g></svg>DOCX
        </n-button>
        <n-button size="small" @click="downloadFile">
          <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c.38 0 .702.283.745.648L12.75 3v10.305l3.543-3.37a.75.75 0 1 1 1.04 1.08l-4.773 4.573a.75.75 0 0 1-1.06.003L6.707 11.04a.75.75 0 1 1 1.046-1.076l3.497 3.4V3a.75.75 0 0 1 .75-.75zM3.5 15.25a.75.75 0 0 1 .75.75V19c0 .138.112.25.25.25h15a.25.25 0 0 0 .25-.25v-3a.75.75 0 0 1 1.5 0v3a1.75 1.75 0 0 1-1.75 1.75h-15A1.75 1.75 0 0 1 3 19v-3a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></g></svg>ទាញយក
        </n-button>
      </div>
    </div>

    <!-- Locked banner when meeting has started or date has passed -->
    <div v-if="!meetingEditable" class="bg-amber-50 border-b border-amber-200 px-4 py-2 text-sm text-amber-700 flex items-center flex-none">
      <svg class="w-4 h-4 mr-2 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM11 7a1 1 0 1 0 2 0a1 1 0 0 0-2 0zm1 3.75v5.5a.75.75 0 0 0 1.5 0v-5.5a.75.75 0 0 0-1.5 0z" fill="currentColor"></path></g></svg>
      <span v-if="isPastMeeting">កាលបរិច្ឆេទប្រជុំបានកន្លងផុតហើយ — </span>
      <span v-else>កិច្ចប្រជុំបានចាប់ផ្ដើមហើយ — </span>
      ការបន្ថែមមតិ កំណត់ចំណាំ និងការគូសចំណាំត្រូវបានបិទ។ អាចមើលបានតែប៉ុណ្ណោះ។
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- PDF / DOCX Viewer -->
      <div class="flex-1 relative bg-gray-200 overflow-auto">
        <!-- PDF View -->
        <div v-if="activeTab==='pdf'" class="h-full flex flex-col">
          <!-- Page toolbar -->
          <div class="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between flex-none">
            <div class="flex items-center space-x-2">
              <n-button size="tiny" quaternary @click="prevPage" :disabled="currentPage<=1"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M15.707 4.293a1 1 0 0 1 0 1.414L9.414 12l6.293 6.293a1 1 0 0 1-1.414 1.414l-7-7a1 1 0 0 1 0-1.414l7-7a1 1 0 0 1 1.414 0z" fill="currentColor"></path></g></svg></n-button>
              <span class="text-sm text-gray-600">ទំព័រ {{ currentPage }} / {{ totalPages }}</span>
              <n-button size="tiny" quaternary @click="nextPage" :disabled="currentPage>=totalPages"><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M8.293 4.293a1 1 0 0 0 0 1.414L14.586 12l-6.293 6.293a1 1 0 1 0 1.414 1.414l7-7a1 1 0 0 0 0-1.414l-7-7a1 1 0 0 0-1.414 0z" fill="currentColor"></path></g></svg></n-button>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-xs text-gray-400">{{ pageAnnotations.length }} ចំណាំនៅទំព័រនេះ</span>
              <n-button size="tiny" type="primary" ghost @click="startHighlight" :disabled="highlighting || !meetingEditable">
                <svg class="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M15.583 3.5a3.585 3.585 0 0 0-2.526 1.044l-.812.812l-.763-.763A3.58 3.58 0 0 0 8.941 3.5a3.58 3.58 0 0 0-2.527 6.123l.057.053L12 15.165l5.53-5.49a3.58 3.58 0 0 0-1.947-6.175z" fill="currentColor"></path></g></svg>គូសចំណាំ
              </n-button>
            </div>
          </div>
          <!-- PDF iframe -->
          <div class="flex-1 relative">
            <iframe v-if="draft.pdf_url && draft.pdf_url !== '#'" :src="draft.pdf_url+'#page='+currentPage" class="w-full h-full border-0"></iframe>
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <div class="text-center"><svg class="w-16 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg><div>មិនមានឯកសារ PDF</div></div>
            </div>
            <!-- Annotation markers (simulated overlay) -->
            <div class="absolute right-3 top-3 space-y-1">
              <div v-for="ann in pageAnnotations" :key="ann.id"
                @click="selectAnnotation(ann)"
                :class="['px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all hover:shadow-md border-2',
                  selectedAnnotation&&selectedAnnotation.id===ann.id?'bg-yellow-200 border-yellow-500 shadow-md':'bg-white border-gray-200 hover:border-yellow-300']"
                :style="{borderLeftColor:ann.color||'#FFEB3B',borderLeftWidth:'4px'}">
                <div class="flex items-center space-x-2">
                  <span class="truncate max-w-[180px]">{{ ann.selected_text || 'អត្ថបទដែលបានគូស' }}</span>
                  <span v-if="ann.pole_count>0" class="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">{{ ann.pole_count }} 💬</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- DOCX View -->
        <div v-else class="flex items-center justify-center h-full">
          <div class="text-center p-8">
            <div class="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-12 h-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M8.75 11.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0 2.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0 2.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5z" fill="currentColor"></path></g></svg>
            </div>
            <h3 class="font-moul text-lg text-gray-700 mb-2">ឯកសារ DOCX</h3>
            <p class="text-gray-500 mb-4">ឯកសារប្រភេទ DOCX មិនអាចបង្ហាញដោយផ្ទាល់បានទេ</p>
            <n-button type="primary" @click="downloadFile">ទាញយកឯកសារ DOCX</n-button>
          </div>
        </div>
      </div>

      <!-- Sidebar: Poles / Notes -->
      <div class="w-80 lg:w-96 bg-white border-l border-gray-200 flex flex-col flex-none overflow-hidden">
        <!-- Sidebar Tabs -->
        <div class="flex border-b border-gray-200 flex-none">
          <button @click="sidebarTab='poles';selectedPole=null"
            :class="['flex-1 py-2.5 text-sm font-bold text-center transition-colors',sidebarTab==='poles'?'text-blue-600 border-b-2 border-blue-500 bg-blue-50':'text-gray-500 hover:text-gray-700']">
            💬 ពិភាក្សា ({{ poles.length }})
          </button>
          <button @click="sidebarTab='notes';selectedPole=null"
            :class="['flex-1 py-2.5 text-sm font-bold text-center transition-colors',sidebarTab==='notes'?'text-purple-600 border-b-2 border-purple-500 bg-purple-50':'text-gray-500 hover:text-gray-700']">
            📝 កំណត់ ({{ notes.length }})
          </button>
        </div>

        <!-- Poles Panel -->
        <template v-if="sidebarTab==='poles'">
          <template v-if="!selectedPole">
            <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-none">
              <h3 class="font-moul text-md text-gray-800">ចំណុចពិភាក្សា</h3>
              <n-button size="tiny" type="primary" @click="openNewPole" :disabled="!meetingEditable">+ ថ្មី</n-button>
            </div>
            <div class="px-3 py-2 border-b border-gray-100 flex space-x-1 flex-none">
            <n-button size="tiny" :type="poleFilter==='all'?'primary':'default'" quaternary @click="poleFilter='all'">ទាំងអស់</n-button>
            <n-button size="tiny" :type="poleFilter==='open'?'warning':'default'" quaternary @click="poleFilter='open'">បើក ({{ openPoles.length }})</n-button>
            <n-button size="tiny" :type="poleFilter==='resolved'?'success':'default'" quaternary @click="poleFilter='resolved'">ដោះស្រាយ ({{ resolvedPoles.length }})</n-button>
          </div>
          <div class="flex-1 overflow-y-auto">
            <div v-if="filteredPoles.length===0" class="text-center text-gray-400 py-12">
              <svg class="w-12 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM11.75 7a.75.75 0 0 1 .75.75V11.25h3.5a.75.75 0 0 1 0 1.5H12.5v3.5a.75.75 0 0 1-1.5 0v-3.5H7.5a.75.75 0 0 1 0-1.5H11V7.75a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></g></svg>
              <div>មិនទាន់មានចំណុចពិភាក្សា</div>
            </div>
            <div v-for="pole in filteredPoles" :key="pole.id"
              @click="selectPole(pole)"
              class="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
              :class="{'bg-blue-50 border-l-4 border-l-blue-500':selectedAnnotation&&pole.annotation_id===selectedAnnotation.id}">
              <div class="flex items-start justify-between mb-1">
                <span class="text-xs font-bold px-2 py-0.5 rounded-full"
                  :class="pole.status==='open'?'bg-amber-100 text-amber-700':'bg-green-100 text-green-700'">
                  {{ pole.status==='open'?'បើក':'ដោះស្រាយ' }}
                </span>
                <span class="text-xs text-gray-400">{{ pole.created_at||'' }}</span>
              </div>
              <h4 class="font-bold text-gray-800 text-sm mb-1">{{ pole.title }}</h4>
              <div class="flex items-center space-x-3 text-xs text-gray-500">
                <span>{{ pole.creator||'មិនស្គាល់' }}</span>
                <span>{{ pole.comment_count||0 }} មតិ</span>
                <span v-if="pole.annotation_id">📍 ទំ.{{ pole.page_number||'?' }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Pole Detail -->
        <template v-else>
          <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-none">
            <n-button size="tiny" quaternary @click="selectedPole=null">
              <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M15.707 4.293a1 1 0 0 1 0 1.414L9.414 12l6.293 6.293a1 1 0 0 1-1.414 1.414l-7-7a1 1 0 0 1 0-1.414l7-7a1 1 0 0 1 1.414 0z" fill="currentColor"></path></g></svg>ត្រឡប់
            </n-button>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full"
              :class="selectedPole.status==='open'?'bg-amber-100 text-amber-700':'bg-green-100 text-green-700'">
              {{ selectedPole.status==='open'?'បើក':'ដោះស្រាយ' }}
            </span>
          </div>
          <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Pole Info -->
            <div class="px-4 py-3 border-b border-gray-100 flex-none">
              <h3 class="font-bold text-gray-800 mb-2">{{ selectedPole.title }}</h3>
              <p v-if="selectedPole.description" class="text-sm text-gray-600 mb-2">{{ selectedPole.description }}</p>
              <div class="flex items-center space-x-2 text-xs text-gray-400">
                <span>ដោយ {{ selectedPole.creator||'មិនស្គាល់' }}</span>
                <span>·</span>
                <span>{{ selectedPole.created_at||'' }}</span>
              </div>
              <!-- Highlighted text -->
              <div v-if="selectedPole.annotation_text" class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-700 italic">
                "{{ selectedPole.annotation_text }}"
                <n-button size="tiny" text @click="goToAnnotationPage(selectedPole)" class="ml-1">📍 ទៅទំព័រ {{ selectedPole.page_number }}</n-button>
              </div>
            </div>
            <!-- Comments -->
            <div class="flex-1 overflow-y-auto px-4 py-2 space-y-3">
              <div v-if="selectedPoleComments.length===0" class="text-center text-gray-400 py-8 text-sm">មិនទាន់មានមតិយោបល់</div>
              <div v-for="c in selectedPoleComments" :key="c.id" class="flex space-x-2">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-none">
                  <span class="text-xs font-bold text-blue-600">{{ (c.creator||'?').charAt(0) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-baseline space-x-2">
                    <span class="text-sm font-bold text-gray-700">{{ c.creator||'មិនស្គាល់' }}</span>
                    <span class="text-xs text-gray-400">{{ c.created_at||'' }}</span>
                  </div>
                  <p class="text-sm text-gray-600 mt-0.5">{{ c.comment }}</p>
                  <div v-if="c.attachment" class="mt-1">
                    <span class="inline-flex items-center text-xs text-blue-600 bg-blue-50 rounded px-2 py-0.5">
                      <svg class="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M19.25 14.5v5.25a1.75 1.75 0 0 1-1.75 1.5H5.75A1.75 1.75 0 0 1 4 19.75V7.25C4 6.284 4.784 5.5 5.75 5.5H9a.75.75 0 0 1 0 1.5H5.75a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h11.75a.25.25 0 0 0 .25-.25V14.5a.75.75 0 0 1 1.5 0z" fill="currentColor"></path></g></svg>
                      {{ c.attachment }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Add Comment -->
            <div v-if="meetingEditable" class="px-4 py-3 border-t border-gray-200 flex-none">
              <div class="flex items-center space-x-2">
                <input v-model="newCommentText" @keyup.enter="addComment"
                  placeholder="សរសេរមតិយោបល់..." class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
                <n-button size="small" type="primary" @click="addComment" :disabled="!newCommentText.trim()">ផ្ញើ</n-button>
              </div>
            </div>
            <!-- Resolve / Close -->
            <div v-if="selectedPole.status==='open' && meetingEditable" class="px-4 py-2 border-t border-gray-100 flex-none">
              <div class="flex space-x-2">
                <n-button size="small" type="success" @click="resolvePole" class="flex-1">✓ ដោះស្រាយរួច</n-button>
                <n-button size="small" type="default" @click="closePole" class="flex-1">✕ បិទ</n-button>
              </div>
            </div>
          </div>
        </template>
        </template>

        <!-- Notes Panel -->
        <template v-if="sidebarTab==='notes'">
        <div class="flex-1 flex flex-col overflow-hidden">
          <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-none">
            <h3 class="font-moul text-md text-purple-800">កំណត់ចំណាំផ្ទាល់ខ្លួន</h3>
            <n-button size="tiny" type="primary" @click="showNewNote=true" :disabled="!meetingEditable">+ ថ្មី</n-button>
          </div>
          <div class="flex-1 overflow-y-auto">
            <div v-if="notes.length===0" class="text-center text-gray-400 py-12">
              <svg class="w-12 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M15.583 3.5a3.585 3.585 0 0 0-2.526 1.044l-.812.812l-.763-.763A3.58 3.58 0 0 0 8.941 3.5a3.58 3.58 0 0 0-2.527 6.123l.057.053L12 15.165l5.53-5.49a3.58 3.58 0 0 0-1.947-6.175z" fill="currentColor"></path></g></svg>
              <div>មិនទាន់មានកំណត់ចំណាំ</div>
              <div class="text-xs mt-1">សរសេរការយល់ឃើញ ឬសង្ខេបរបស់អ្នក</div>
            </div>
            <div v-for="n in notes" :key="n.id" class="px-4 py-3 border-b border-gray-50 hover:bg-purple-50 transition-colors group">
              <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ n.note }}</p>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center space-x-2 text-xs text-gray-400">
                  <span>{{ n.creator||'ខ្ញុំ' }}</span>
                  <span>·</span>
                  <span>{{ n.created_at||'' }}</span>
                </div>
                <div v-if="meetingEditable" class="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <n-button size="tiny" quaternary @click="editNote(n)"><svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M21.03 2.97a3.578 3.578 0 0 1 0 5.06L9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L15.97 2.97a3.578 3.578 0 0 1 5.06 0z" fill="currentColor"></path></g></svg></n-button>
                  <n-button size="tiny" quaternary @click="deleteNote(n.id)"><svg class="w-3.5 h-3.5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1z" fill="currentColor"></path></g></svg></n-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </template>
      </div>
    </div>

    <!-- New Pole Modal -->
    <n-modal v-model:show="showNewPole" preset="card" title="បង្កើតចំណុចពិភាក្សាថ្មី" style="max-width:520px" :mask-closable="false">
      <n-form label-placement="top" size="medium">
        <n-form-item label="ចំណងជើង" required><n-input v-model:value="newPole.title" placeholder="ឧ. ត្រូវការបញ្ជាក់អំពីវិសាលភាព..." /></n-form-item>
        <n-form-item label="ពណ៌នា"><n-input v-model:value="newPole.description" type="textarea" :autosize="{minRows:2,maxRows:4}" placeholder="ពណ៌នាលម្អិតអំពីអ្វីដែលត្រូវពិភាក្សា..." /></n-form-item>
        <n-form-item v-if="highlightedText" label="អត្ថបទដែលបានគូស">
          <div class="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-gray-700 italic">"{{ highlightedText }}"</div>
        </n-form-item>
      </n-form>
      <template #footer><div class="flex justify-end space-x-2"><n-button @click="showNewPole=false">បោះបង់</n-button><n-button type="primary" @click="createPole" :disabled="!newPole.title.trim()">បង្កើត</n-button></div></template>
    </n-modal>

    <!-- New Note Modal -->
    <n-modal v-model:show="showNewNote" preset="card" :title="editingNoteId?'កែប្រែកំណត់ចំណាំ':'កំណត់ចំណាំថ្មី'" style="max-width:480px" :mask-closable="false">
      <n-form label-placement="top" size="medium">
        <n-form-item label="កំណត់ចំណាំ">
          <n-input v-model:value="newNoteText" type="textarea" :autosize="{minRows:4,maxRows:10}"
            placeholder="សរសេរការយល់ឃើញ សង្ខេប ឬកំណត់ចំណាំរបស់អ្នក..." />
        </n-form-item>
      </n-form>
      <template #footer><div class="flex justify-end space-x-2"><n-button @click="showNewNote=false">បោះបង់</n-button><n-button type="primary" @click="saveNote" :disabled="!newNoteText.trim()">{{ editingNoteId?'រក្សាទុក':'បន្ថែម' }}</n-button></div></template>
    </n-modal>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'

// ─── Mock Data ──────────────────────────────────────────────────────────
function getMockDraft() {
  return {
    id:1, title:'សេចក្តីព្រាងគោលនយោបាយទូរគមនាគមន៍', status:'progressing', version_number:4,
    regulator:'ប្រកាសលេខ ១២៣ ស្តីពីទូរគមនាគមន៍',
    pdf_url:'#', docx_url:'#',
  }
}

function getMockAnnotations() {
  return [
    {id:1, page_number:3, selected_text:'គោលនយោបាយនេះអនុវត្តចំពោះរាល់ប្រតិបត្តិករទូរគមនាគមន៍ និងអ្នកផ្តល់សេវាអ៊ីនធឺណិត។', color:'#FFEB3B', pole_count:2},
    {id:2, page_number:5, selected_text:'ទោសប្បញ្ញត្តិត្រូវកំណត់ឱ្យបានច្បាស់លាស់ និងសមស្របទៅតាមកម្រិតនៃការរំលោភបំពាន។', color:'#FF9800', pole_count:1},
    {id:3, page_number:8, selected_text:'ពេលវេលាអនុវត្តគឺ ៦ ខែ គិតចាប់ពីថ្ងៃចុះហត្ថលេខា។', color:'#4CAF50', pole_count:1},
  ]
}

function getMockPoles() {
  return [
    {id:1, annotation_id:1, page_number:3, annotation_text:'គោលនយោបាយនេះអនុវត្តចំពោះរាល់ប្រតិបត្តិករទូរគមនាគមន៍ និងអ្នកផ្តល់សេវាអ៊ីនធឺណិត។',
      title:'តើត្រូវបញ្ចូល ISP ដោយផ្ទាល់ឬប្រើពាក្យទូលំទូលាយ?', status:'open',
      description:'គួរបញ្ជាក់ឈ្មោះ ISP ឬប្រើពាក្យទូលំទូលាយ? វាប៉ះពាល់ដល់ការអនុវត្តច្បាប់។',
      creator:'H.E. សុខ ហេង', created_at:'2026-07-05 09:45', comment_count:3,
      comments:[
        {id:1,creator:'H.E. សុខ ហេង',created_at:'2026-07-05 09:45',comment:'ខ្ញុំគិតថាគួរបញ្ជាក់ ISP ដោយផ្ទាល់ ព្រោះពួកគេមានតម្រូវការអាជ្ញាបណ្ណខុសពីប្រតិបត្តិករទូរស័ព្ទ។'},
        {id:2,creator:'លោក ជា វណ្ណៈ',created_at:'2026-07-05 10:12',comment:'យល់ស្រប។ ប៉ុន្តែគួរបន្ថែមផ្នែកនិយមន័យដើម្បីបញ្ជាក់ថា ISP មានន័យដូចម្តេច។',attachment:'isp_definition_draft.pdf'},
        {id:3,creator:'អ្នកស្រី គឹម ស្រីនាង',created_at:'2026-07-05 11:30',comment:'ចំណុចល្អ។ ខ្ញុំនឹងរៀបចំនិយមន័យសម្រាប់កំណែបន្ទាប់។'},
      ]
    },
    {id:2, annotation_id:1, page_number:3, annotation_text:'គោលនយោបាយនេះអនុវត្តចំពោះរាល់ប្រតិបត្តិករទូរគមនាគមន៍ និងអ្នកផ្តល់សេវាអ៊ីនធឺណិត។',
      title:'តើគួរបន្ថែមនិយមន័យ "ប្រតិបត្តិករ" ដែរឬទេ?', status:'open',
      creator:'លោក ទូច ម៉េង', created_at:'2026-07-05 14:20', comment_count:1,
      comments:[{id:4,creator:'លោក ទូច ម៉េង',created_at:'2026-07-05 14:20',comment:'ពាក្យ "ប្រតិបត្តិករ" គួរតែមាននិយមន័យច្បាស់លាស់ដើម្បីចៀសវាងការយល់ច្រឡំ។'}]
    },
    {id:3, annotation_id:2, page_number:5, annotation_text:'ទោសប្បញ្ញត្តិត្រូវកំណត់ឱ្យបានច្បាស់លាស់ និងសមស្របទៅតាមកម្រិតនៃការរំលោភបំពាន។',
      title:'ទោសប្បញ្ញត្តិទាបពេក', status:'open',
      creator:'លោក ទូច ម៉េង', created_at:'2026-07-04 15:00', comment_count:2,
      comments:[
        {id:5,creator:'លោក ទូច ម៉េង',created_at:'2026-07-04 15:00',comment:'ទោសប្បញ្ញត្តិបច្ចុប្បន្នទាបពេក មិនអាចរារាំងការរំលោភបានទេ។'},
        {id:6,creator:'H.E. សុខ ហេង',created_at:'2026-07-04 16:30',comment:'យល់ស្រប។ សូមស្នើឱ្យក្រុមការងារពិនិត្យឡើងវិញនូវតារាងទោសប្បញ្ញត្តិ។'},
      ]
    },
    {id:4, annotation_id:3, page_number:8, annotation_text:'ពេលវេលាអនុវត្តគឺ ៦ ខែ គិតចាប់ពីថ្ងៃចុះហត្ថលេខា។',
      title:'រយៈពេល ៦ ខែមិនអាចអនុវត្តបាន', status:'resolved',
      description:'បានពិភាក្សា និងឯកភាពថានឹងពន្យារជា ១២ ខែ។',
      creator:'អ្នកស្រី លី សុខា', created_at:'2026-07-04 11:00', comment_count:4,
      resolution:'ឯកភាពពន្យារជា ១២ ខែ និងកែសម្រួលក្នុងកំណែ v5។', resolved_by:'H.E. សុខ ហេង', resolved_at:'2026-07-05',
      comments:[
        {id:7,creator:'អ្នកស្រី លី សុខា',created_at:'2026-07-04 11:00',comment:'៦ ខែមិនគ្រប់គ្រាន់សម្រាប់ការរៀបចំប្រព័ន្ធថ្មីទេ។'},
        {id:8,creator:'លោក ជា វណ្ណៈ',created_at:'2026-07-04 11:30',comment:'យល់ស្រប។ យ៉ាងហោចណាស់ ១២ ខែ។'},
        {id:9,creator:'H.E. សុខ ហេង',created_at:'2026-07-04 14:00',comment:'តោះពន្យារជា ១២ ខែ។'},
        {id:10,creator:'អ្នកស្រី លី សុខា',created_at:'2026-07-05 08:00',comment:'អរគុណ។ នឹងកែសម្រួលក្នុងកំណែបន្ទាប់។'},
      ]
    },
  ]
}

export default {
  name:'DraftViewerPage',
  setup(){
    const route=useRoute();const message=useMessage()

    const draft=ref({});const annotations=ref([]);const poles=ref([])
    const activeTab=ref('pdf')
    const currentPage=ref(1);const totalPages=ref(12)
    const highlighting=ref(false);const highlightedText=ref('')

    const selectedAnnotation=ref(null)
    const selectedPole=ref(null)
    const poleFilter=ref('all')
    const showNewPole=ref(false)
    const newPole=reactive({title:'',description:''})
    const newCommentText=ref('')
    const sidebarTab=ref('poles')
    const notes=ref([])
    const showNewNote=ref(false)
    const newNoteText=ref('')
    const editingNoteId=ref(null)
    const meetingId=computed(()=>route.query.meeting_id||route.params.meeting_id||0)
    const meetingStatus=computed(()=>parseInt(route.query.meeting_status)||0)
    const meetingDate=computed(()=>route.query.meeting_date||'')
    const isPastMeeting=computed(()=>{
      if(!meetingDate.value)return false
      const d=new Date(meetingDate.value)
      if(isNaN(d.getTime()))return false
      const today=new Date();today.setHours(0,0,0,0)
      d.setHours(0,0,0,0)
      return d<today
    })
    const meetingEditable=computed(()=>meetingStatus.value===1&&!isPastMeeting.value)

    // ─── Computed ───────────────────────────────────────────────────────
    const openPoles=computed(()=>poles.value.filter(p=>p.status==='open'))
    const resolvedPoles=computed(()=>poles.value.filter(p=>p.status==='resolved'))
    const filteredPoles=computed(()=>{
      if(poleFilter.value==='open')return openPoles.value
      if(poleFilter.value==='resolved')return resolvedPoles.value
      return poles.value
    })
    const pageAnnotations=computed(()=>annotations.value.filter(a=>a.page_number===currentPage.value))
    const selectedPoleComments=computed(()=>selectedPole.value&&selectedPole.value.comments?selectedPole.value.comments:[])

    const statusLabel=computed(()=>{
      const m={new:'ថ្មី',progressing:'កំពុងដំណើរការ',finished:'បញ្ចប់'}
      return m[draft.value.status]||draft.value.status||'មិនស្គាល់'
    })
    const statusClass=computed(()=>{
      const m={new:'bg-yellow-100 text-yellow-700',progressing:'bg-blue-100 text-blue-700',finished:'bg-green-100 text-green-700'}
      return m[draft.value.status]||'bg-gray-100 text-gray-700'
    })

    // ─── Page Navigation ────────────────────────────────────────────────
    function prevPage(){if(currentPage.value>1)currentPage.value--}
    function nextPage(){if(currentPage.value<totalPages.value)currentPage.value++}

    // ─── Annotation ─────────────────────────────────────────────────────
    function startHighlight(){
      highlighting.value=true
      highlightedText.value='អត្ថបទគំរូដែលបានគូសចំណាំពីទំព័រ '+currentPage.value
      message.info('ក្នុងការអនុវត្តជាក់ស្តែង សូមគូសអត្ថបទក្នុង PDF viewer ហើយប្រព័ន្ធនឹងចាប់យកកូអរដោណេ។ នេះជាការក្លែងធ្វើ។')
      setTimeout(()=>{highlighting.value=false},2000)
    }
    function selectAnnotation(ann){
      selectedAnnotation.value=ann
      // Find related poles
      const related=poles.value.filter(p=>p.annotation_id===ann.id)
      if(related.length===1){selectPole(related[0])}
      else if(related.length>0){poleFilter.value='all'}
    }

    // ─── Poles ──────────────────────────────────────────────────────────
    function selectPole(pole){selectedPole.value=pole;selectedAnnotation.value=annotations.value.find(a=>a.id===pole.annotation_id)||null}
    function openNewPole(){
      newPole.title='';newPole.description=''
      showNewPole.value=true
    }
    function createPole(){
      const p={
        id:Date.now(),annotation_id:selectedAnnotation.value?selectedAnnotation.value.id:null,
        page_number:currentPage.value,annotation_text:highlightedText.value||null,
        title:newPole.title.trim(),description:newPole.description.trim(),
        status:'open',creator:'អ្នកប្រើប្រាស់បច្ចុប្បន្ន',
        created_at:new Date().toISOString().slice(0,16).replace('T',' '),
        comment_count:0,comments:[]
      }
      poles.value.unshift(p)
      showNewPole.value=false
      selectPole(p)
      message.success('បានបង្កើតចំណុចពិភាក្សាថ្មី')
    }
    function addComment(){
      if(!newCommentText.value.trim()||!selectedPole.value)return
      const c={id:Date.now(),creator:'អ្នកប្រើប្រាស់បច្ចុប្បន្ន',created_at:new Date().toISOString().slice(0,16).replace('T',' '),comment:newCommentText.value.trim()}
      if(!selectedPole.value.comments)selectedPole.value.comments=[]
      selectedPole.value.comments.push(c)
      selectedPole.value.comment_count=selectedPole.value.comments.length
      newCommentText.value=''
    }
    function resolvePole(){
      if(!selectedPole.value)return
      selectedPole.value.status='resolved'
      selectedPole.value.resolved_by='អ្នកប្រើប្រាស់បច្ចុប្បន្ន'
      selectedPole.value.resolved_at=new Date().toISOString().slice(0,10)
      message.success('បានដោះស្រាយចំណុចពិភាក្សា')
    }
    function closePole(){
      if(!selectedPole.value)return
      selectedPole.value.status='closed'
      message.success('បានបិទចំណុចពិភាក្សា')
    }
    function goToAnnotationPage(pole){if(pole.page_number){currentPage.value=pole.page_number}}

    function downloadFile(){message.info('មុខងារទាញយកនឹងមាននៅពេលភ្ជាប់ទៅ Backend')}

    // ─── Notes ───────────────────────────────────────────────────────────
    function getMockNotes(){return[
      {id:1,note:'សេចក្តីព្រាងនេះគ្របដណ្តប់លើវិស័យទូរគមនាគមន៍ទាំងមូល។ ត្រូវពិនិត្យមើលថាតើវារួមបញ្ចូលសេវាកម្ម OTT ដែរឬទេ?',creator:'H.E. សុខ ហេង',created_at:'2026-07-05'},
      {id:2,note:'ផ្នែកទី ៤ ស្តីពីវិសាលភាពហាក់ដូចជាទូលំទូលាយពេក។ គួរកំណត់ឱ្យបានច្បាស់ថាអ្នកណាខ្លះត្រូវអនុវត្តតាម។',creator:'លោក ជា វណ្ណៈ',created_at:'2026-07-04'},
    ]}
    function saveNote(){
      if(!newNoteText.value.trim())return
      if(editingNoteId.value){
        const n=notes.value.find(x=>x.id===editingNoteId.value)
        if(n){n.note=newNoteText.value.trim();n.updated_at=new Date().toISOString().slice(0,10)}
      }else{
        notes.value.unshift({id:Date.now(),note:newNoteText.value.trim(),creator:'អ្នកប្រើប្រាស់បច្ចុប្បន្ន',created_at:new Date().toISOString().slice(0,16).replace('T',' ')})
      }
      showNewNote.value=false;editingNoteId.value=null;newNoteText.value=''
    }
    function editNote(n){editingNoteId.value=n.id;newNoteText.value=n.note;showNewNote.value=true}
    function deleteNote(id){notes.value=notes.value.filter(n=>n.id!==id);message.success('បានលុបកំណត់ចំណាំ')}

    // ─── Fetch ──────────────────────────────────────────────────────────
    function fetchDraft(){
      draft.value=getMockDraft()
      annotations.value=getMockAnnotations()
      poles.value=getMockPoles()
      notes.value=getMockNotes()
    }
    onMounted(()=>{fetchDraft()})

    return{
      draft,activeTab,currentPage,totalPages,highlighting,highlightedText,
      annotations,poles,poleFilter,selectedAnnotation,selectedPole,
      openPoles,resolvedPoles,filteredPoles,pageAnnotations,selectedPoleComments,
      statusLabel,statusClass,meetingId,meetingEditable,isPastMeeting,
      prevPage,nextPage,startHighlight,selectAnnotation,
      selectPole,openNewPole,createPole,addComment,resolvePole,closePole,goToAnnotationPage,
      downloadFile,newPole,showNewPole,newCommentText,
      sidebarTab,notes,showNewNote,newNoteText,editingNoteId,saveNote,editNote,deleteNote
    }
  }
}
</script>

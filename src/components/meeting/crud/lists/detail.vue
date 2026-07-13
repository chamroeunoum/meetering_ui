<template>
  <div class="meeting-detail-page font-ktr relative ">
    <Transition name="fade">
      <div v-if="loading" class="absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center h-64">
        <div class="spinner text-center">
          <svg class="animate-spin w-12 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48s48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.491-48-48-48z" fill="currentColor"></path></svg>
          <br/><br/><span class="">កំពុងអាន...</span>
        </div>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="error" class="flex items-center justify-center h-64">
        <div class="text-center text-red-500">
          <svg class="w-12 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zM11 7a1 1 0 1 0 2 0a1 1 0 0 0-2 0zm1 3.75v5.5a.75.75 0 0 0 1.5 0v-5.5a.75.75 0 0 0-1.5 0z" fill="currentColor"></path></g></svg>
          <div>មានបញ្ហាក្នុងពេលអានទិន្នន័យ។</div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="!loading && !error && record" class="p-4 pb-20">
        <!-- Info Card -->
        <div class="rounded-lg border border-default p-6 mb-6 bg-card">
          <div class="flex flex-wrap items-start justify-between mb-4">
            <div class="flex-1 min-w-0 mr-4">
              <h1 class="font-moul text-xl leading-relaxed">{{ record.objective || 'គ្មានចំណងជើង' }}</h1>
            </div>
            <div class="flex-none flex items-center gap-2">
              <n-button size="tiny" quaternary @click="showEditModal = true" class="!p-1">
                <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </n-button>
              <n-button size="tiny" :type="record.active ? 'warning' : 'primary'" @click="togglePublish(record)" class="!p-1">
                <template #icon>
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </template>
                <span class="text-xs">{{ record.active ? 'ឈប់ផ្សាយ' : 'ផ្សាយ' }}</span>
              </n-button>
              <span v-if="record.type" class="inline-block px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700 border border-blue-200">{{ record.type.name }}</span>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="flex items-start space-x-2"><svg class="w-5 h-5 text-blue-500 flex-none mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M17.75 3A3.25 3.25 0 0 1 21 6.25v11.5A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3h11.5zm0 1.5H6.25A1.75 1.75 0 0 0 4.5 6.25v11.5c0 .966.784 1.75 1.75 1.75h11.5a1.75 1.75 0 0 0 1.75-1.75V6.25a1.75 1.75 0 0 0-1.75-1.75zM7.75 7a.75.75 0 0 1 .75.75V9.5h7V7.75a.75.75 0 0 1 1.5 0V9.5h.75c.966 0 1.75.784 1.75 1.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.25.25 0 0 0-.25-.25h-.75v.75a.75.75 0 0 1-1.5 0v-.75h-7v.75a.75.75 0 0 1-1.5 0v-.75H7.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h4a.75.75 0 0 1 0 1.5h-4A1.75 1.75 0 0 1 5.5 18.75v-7.5c0-.966.784-1.75 1.75-1.75H8V7.75A.75.75 0 0 1 8.75 7h-1z" fill="currentColor"></path></g></svg><div><div class="text-xs ">កាលបរិច្ឆេទ</div><div class="font-bold ">{{ formatDate(record.date) }}</div></div></div>
            <div class="flex items-start space-x-2"><svg class="w-5 h-5 text-blue-500 flex-none mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 0 0 0-17zM11.75 6a.75.75 0 0 1 .75.75V12h3.75a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75V6.75a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></g></svg><div><div class="text-xs ">ម៉ោង</div><div class="font-bold ">{{ record.start }} - {{ record.end }}</div></div></div>
            <div class="flex items-start space-x-2"><svg class="w-5 h-5 text-blue-500 flex-none mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 13c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1l1.27.67c.33.18.73-.06.73-.44v-2.46c0-.38-.4-.62-.73-.44L18 14v-1zm-7.2-9.1l-6 4.5c-.5.38-.8.97-.8 1.6v9c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H6v-9l6-4.5l6 4.5v1h2v-1c0-.63-.3-1.22-.8-1.6l-6-4.5a2.01 2.01 0 0 0-2.4 0z" fill="currentColor"></path></svg><div><div class="text-xs ">បន្ទប់ប្រជុំ</div><div class="font-bold ">{{ record.rooms && record.rooms.length > 0 ? record.rooms.map(r => r.name).join(', ') : 'មិនបានកំណត់' }}</div></div></div>
            <div class="flex items-start space-x-2"><svg class="w-5 h-5 text-blue-500 flex-none mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4zm0 1.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM2 19v-.5C2 14.693 5.907 13 12 13s10 1.693 10 5.5v.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm1.5 0a.5.5 0 0 0 .5.5h16a.5.5 0 0 0 .5-.5v-.5c0-2.003-3.358-4-8.5-4s-8.5 1.997-8.5 4v.5z" fill="currentColor"></path></g></svg><div><div class="text-xs ">ក្រសួង ស្ថាប័ន</div><div class="font-bold ">{{ record.organizations && record.organizations.length > 0 ? record.organizations.map(o => o.name).join(', ') : 'មិនបានកំណត់' }}</div></div></div>
          </div>
          <div v-if="record.route" class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div class="flex items-start space-x-2">
              <svg class="w-5 h-5  flex-none mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c3.196 0 6.348 1.116 8.35 3.855C22.235 8.425 23 11.268 23 14c0 6.075-11 8-11 8S1 20.075 1 14c0-2.732.765-5.575 2.65-8.145C5.652 3.116 8.804 2 12 2zm0 1.5c-2.804 0-5.598 1.009-7.35 3.395C3.015 9.144 2.5 11.615 2.5 14c0 4.325 7.51 6.25 9.223 6.484L12 20.5c1.686-.02 8.5-1.96 8.5-6.5 0-2.385-.515-4.856-2.15-7.105C16.598 4.509 13.804 3.5 12 3.5zM12 7a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm0 1.5a2 2 0 1 0 0 4a2 2 0 0 0 0-4z" fill="currentColor"></path></g></svg>
              <div>
                <div class="text-xs  font-bold mb-1">ផ្លូវទៅកាន់ទីតាំងប្រជុំ</div>
                <p class="text-sm  leading-relaxed">{{ record.route }}</p>
              </div>
            </div>
          </div>
          <div v-if="meetingLeaders.length > 0" class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-start space-x-2"><svg class="w-5 h-5 text-yellow-500 flex-none mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2a4 4 0 1 0 0 8a4 4 0 0 0 0-8zM6 7a6 6 0 1 1 12 0A6 6 0 0 1 6 7zM3.5 19v-.5C3.5 15.693 7.307 14 12 14s8.5 1.693 8.5 4.5v.5a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1zm1.5 0h14v-.5c0-2.003-4.358-3-7.5-3S5 16.496 5 18.5v.5z" fill="currentColor"></path></g></svg><div><div class="text-xs ">អ្នកដឹកនាំប្រជុំ</div><div class="font-bold "><span v-for="(lm,i) in meetingLeaders" :key="i"><template v-if="lm.member&&lm.member.officers&&lm.member.officers.length">{{ lm.member.officers.map(o=>(o.countesy?o.countesy.name+' ':'')) }}{{ lm.member.lastname }} {{ lm.member.firstname }}</template><template v-else>{{ lm.member?lm.member.lastname+' '+lm.member.firstname:'' }}</template>{{ i<meetingLeaders.length-1?', ':'' }}</span></div></div></div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="rounded-lg shadow-sm border border-default bg-card">
          <n-tabs type="segment" animated>

            <!-- ═══ TAB 1: AGENDA ═══ -->
            <n-tab-pane name="agenda" tab="របៀបវារៈ" >
              <div class="p-4 md:p-6">
                <div class="p-4 rounded-lg border border-default mb-6">
                  <h3 class="font-moul text-md mb-2">កម្មវត្ថុ</h3>
                  <p class=" leading-relaxed">{{ record.objective || 'មិនបានកំណត់' }}</p>
                </div>
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-moul text-lg ">តារាងសកម្មភាព</h3>
                  <n-button type="primary" size="small" @click="openAddAgenda"><template #icon><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM11.75 7a.75.75 0 0 1 .75.75V11.25h3.5a.75.75 0 0 1 0 1.5H12.5v3.5a.75.75 0 0 1-1.5 0v-3.5H7.5a.75.75 0 0 1 0-1.5H11V7.75a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></g></svg></template>បន្ថែមសកម្មភាព</n-button>
                </div>
                <div v-if="agendas.length===0" class="text-center py-12  rounded-lg border border-dashed border-default">
                  <svg class="w-16 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM11.75 7a.75.75 0 0 1 .75.75V11.25h3.5a.75.75 0 0 1 0 1.5H12.5v3.5a.75.75 0 0 1-1.5 0v-3.5H7.5a.75.75 0 0 1 0-1.5H11V7.75a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></g></svg>
                  <div>មិនទាន់មានសកម្មភាពក្នុងរបៀបវារៈ</div>
                  <div class="text-sm mt-1">ចុច "បន្ថែមសកម្មភាព" ដើម្បីចាប់ផ្ដើម</div>
                </div>
                <div v-else class="space-y-3">
                  <div v-for="(item,index) in agendas" :key="item.id||index" class="flex group">
                    <div class="flex-none w-16 text-right pr-3 pt-1"><span class="text-sm font-bold text-blue-600">{{ item.start_time||'--:--' }}</span></div>
                    <div class="flex-none flex flex-col items-center mr-3"><div class="w-3 h-3 rounded-full bg-blue-500 border border-white shadow"></div><div v-if="index<agendas.length-1" class="w-0.5 flex-1 bg-blue-200"></div></div>
                    <div class="flex-1 pb-4">
                      <div class="rounded-lg border border-gray-200 p-3 hover:border-blue-300 hover:shadow-sm transition-all">
                        <div class="flex items-start justify-between">
                          <div class="flex-1 min-w-0">
                            <div class="flex items-center space-x-2 mb-1"><span class="text-xs font-bold text-gray-400">{{ index+1 }}</span><h4 class="font-bold text-sm">{{ item.topic }}</h4></div>
                            <span class="inline-flex items-center text-xs   rounded-full px-2 py-0.5 mr-2"><svg class="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM11.75 6a.75.75 0 0 1 .75.75V12h3.75a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75V6.75a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></g></svg>{{ item.duration }} នាទី</span>
                            <div v-if="item.handlers&&item.handlers.length>0" class="mt-2 flex flex-wrap items-center gap-1"><svg class="w-3.5 h-3.5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM6 7a6 6 0 1 1 12 0A6 6 0 0 1 6 7zM3.5 19v-.5C3.5 15.693 7.307 14 12 14s8.5 1.693 8.5 4.5v.5a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" fill="currentColor"></path></g></svg><span v-for="(h,hi) in item.handlers" :key="hi" class="text-xs rounded-full px-2 py-0.5">{{ h.name }}<span v-if="h.role" class="text-gray-400"> · {{ h.role }}</span></span></div>
                          </div>
                          <div class="flex-none flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <n-button size="tiny" quaternary @click="openEditAgenda(index)"><svg class="w-4 h-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M21.03 2.97a3.578 3.578 0 0 1 0 5.06L9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L15.97 2.97a3.578 3.578 0 0 1 5.06 0z" fill="currentColor"></path></g></svg></n-button>
                            <n-button size="tiny" quaternary @click="removeAgenda(index)"><svg class="w-4 h-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1zm-7.25 3.25a.75.75 0 0 0-.75.75l.25 7.5a.75.75 0 0 0 1.5 0l-.25-7.5a.75.75 0 0 0-.75-.75zm-4.5 0a.75.75 0 0 0-.75.75l.25 7.5a.75.75 0 0 0 1.5 0l-.25-7.5a.75.75 0 0 0-.75-.75z" fill="currentColor"></path></g></svg></n-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="agendas.length>0" class="mt-4 pt-4 border-t border-gray-200 flex items-center justify-end"><span class="text-sm  mr-2">សរុបរយៈពេល:</span><span class="font-bold text-blue-700">{{ totalDuration }} នាទី</span><span class="text-gray-400 ml-1">({{ formatDuration(totalDuration) }})</span></div>
                <div v-if="record.summary" class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100"><h3 class="font-moul text-md mb-2">សង្ខេបបឋម</h3><p class=" leading-relaxed">{{ record.summary }}</p></div>
              </div>
            </n-tab-pane>

            <!-- ═══ TAB 2: ROOM + PARTICIPANTS ═══ -->
            <n-tab-pane name="participants" tab="តារាងអង្គប្រជុំ">
              <div class="p-4 md:p-6">
                <h3 class="font-moul text-lg mb-4 flex items-center"><svg class="w-5 h-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 13c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1l1.27.67c.33.18.73-.06.73-.44v-2.46c0-.38-.4-.62-.73-.44L18 14v-1zm-7.2-9.1l-6 4.5c-.5.38-.8.97-.8 1.6v9c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H6v-9l6-4.5 6 4.5v1h2v-1c0-.63-.3-1.22-.8-1.6l-6-4.5a2.01 2.01 0 0 0-2.4 0z" fill="currentColor"></path></svg>ប្លង់តុប្រជុំ — {{ record.rooms&&record.rooms.length>0?record.rooms[0].name:'បន្ទប់ប្រជុំ' }}</h3>
                <div v-if="record.route" class="mb-6 p-4 rounded-lg border border-default">
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5  flex-none mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c3.196 0 6.348 1.116 8.35 3.855C22.235 8.425 23 11.268 23 14c0 6.075-11 8-11 8S1 20.075 1 14c0-2.732.765-5.575 2.65-8.145C5.652 3.116 8.804 2 12 2zm0 1.5c-2.804 0-5.598 1.009-7.35 3.395C3.015 9.144 2.5 11.615 2.5 14c0 4.325 7.51 6.25 9.223 6.484L12 20.5c1.686-.02 8.5-1.96 8.5-6.5 0-2.385-.515-4.856-2.15-7.105C16.598 4.509 13.804 3.5 12 3.5zM12 7a3.5 3.5 0 1 1 0 7a3.5 3.5 0 0 1 0-7zm0 1.5a2 2 0 1 0 0 4a2 2 0 0 0 0-4z" fill="currentColor"></path></g></svg>
                    <div>
                      <div class="text-xs font-bold mb-1">ផ្លូវទៅកាន់ទីតាំងប្រជុំ</div>
                      <p class="text-sm  leading-relaxed">{{ record.route }}</p>
                    </div>
                  </div>
                </div>
                <!-- Loading state for seat layout -->
                <div v-if="seatLoading" class="flex justify-center py-12  rounded-lg border border-default mb-8">
                  <n-spin size="small" />
                </div>
                <!-- Dynamic seat layout from room seats -->
                <div v-else class="bg-card rounded-lg border border-default p-6 mb-8 overflow-x-auto">
                  <!-- <div class="text-center text-xs mb-4 font-bold">ទ្វារចូល</div> -->
                  <div class="w-20 h-1 mx-auto mb-6 rounded"></div>

                  <!-- No seats configured -->
                  <div v-if="roomSeats.length === 0" class="text-center  py-8 border border-dashed border-default rounded-lg mb-4">
                    <div class="text-sm">មិនទាន់មានការកំណត់កៅអីសម្រាប់បន្ទប់នេះទេ។</div>
                  </div>

                  <!-- Seating area with actual room seats -->
                  <div v-else class="relative mx-auto" style="max-width:800px">
                    <!-- ── Head Table (ប្រធាន) ── -->
                    <div v-if="headTableSeats.length > 0" class="mb-6">
                      <div class="text-xs  mb-2 font-semibold text-center">តុប្រធាន</div>
                      <div class="flex justify-center gap-2 flex-wrap">
                        <div v-for="s in headTableSeats" :key="'ht'+s.id" class="flex flex-col items-center cursor-pointer" @click="handleSeatClick(s)">
                          <!-- Occupied: show photo + name + title -->
                          <div v-if="s.occupied" class="flex flex-col items-center rounded-lg border p-1.5 min-w-[90px] shadow-sm hover:shadow-md transition-all"
                               :class="roleBorderClass(s.role)">
                            <div class="w-8 h-8 rounded-full  flex items-center justify-center overflow-hidden mb-0.5 ring-2 ring-offset-1"
                                 :class="roleRingClass(s.role)">
                              <img v-if="s.photo_url" :src="s.photo_url" class="w-full h-full object-cover" />
                              <span v-else class="text-xs font-bold" :class="roleTextClass(s.role)">{{ s.full_name.charAt(0) || '?' }}</span>
                            </div>
                            <span class="text-[10px] font-bold leading-tight text-center truncate w-full" :class="roleTextClass(s.role)">{{ s.full_name }}</span>
                            <span class="text-[8px]  leading-tight truncate w-full text-center">{{ s.position }}</span>
                          </div>
                          <!-- Empty: show seat number, clickable to assign -->
                          <div v-else
                               class="w-12 h-10 p-2 rounded-lg border text-xs flex items-center justify-center font-bold border-default text-gray-400 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                               title="ចុចដើម្បីដាក់អ្នកចូលរួម">
                            {{ s.seat_number }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- ── Side rows around the table ── -->
                    <div v-if="leftSideSeats.length > 0 || rightSideSeats.length > 0" class="flex items-stretch gap-2">
                      <!-- Left side seats -->
                      <div v-if="leftSideSeats.length > 0" class="flex flex-col gap-2 justify-center">
                        <div v-for="s in leftSideSeats" :key="'ls'+s.id" class="flex items-center cursor-pointer" @click="handleSeatClick(s)">
                          <div v-if="s.occupied" class="flex items-center p-2  gap-1 rounded-lg border p-1 w-full shadow-sm hover:shadow-md transition-all"
                               :class="roleBorderClass(s.role)">
                            <div class="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden flex-none ring-2 ring-offset-1"
                                 :class="roleRingClass(s.role)">
                              <img v-if="s.photo_url" :src="s.photo_url" class="w-full h-full object-cover" />
                              <span v-else class="text-[9px] font-bold" :class="roleTextClass(s.role)">{{ s.full_name.charAt(0) || '?' }}</span>
                            </div>
                            <div class="min-w-0 flex-1">
                              <div class="text-[9px] font-bold leading-tight truncate" :class="roleTextClass(s.role)">{{ s.full_name }}</div>
                            </div>
                          </div>
                          <div v-else
                               class="w-full p-2 h-8 rounded-lg border text-xs flex items-center justify-center font-bold border-default hover:border-blue-400 transition-colors"
                               title="ចុចដើម្បីដាក់អ្នកចូលរួម">
                            {{ s.seat_number }}
                          </div>
                        </div>
                      </div>
                      <!-- Center table placeholder -->
                      <div class="flex-1 border border-dashed rounded bg-amber-50/50 flex items-center justify-center min-h-[120px]">
                        <span class="text-xs font-moul ">តុប្រជុំ</span>
                      </div>
                      <!-- Right side seats -->
                      <div v-if="rightSideSeats.length > 0" class="flex flex-col gap-2 justify-center items-end">
                        <div v-for="s in rightSideSeats" :key="'rs'+s.id" class="flex items-center cursor-pointer w-full" @click="handleSeatClick(s)">
                          <div v-if="s.occupied" class="flex items-center gap-1 rounded-lg border p-2 w-full shadow-sm hover:shadow-md transition-all"
                               :class="roleBorderClass(s.role)">
                            <div class="w-6 h-6 rounded-full  flex items-center justify-center overflow-hidden flex-none ring-2 ring-offset-1"
                                 :class="roleRingClass(s.role)">
                              <img v-if="s.photo_url" :src="s.photo_url" class="w-full h-full object-cover" />
                              <span v-else class="text-[9px] font-bold" :class="roleTextClass(s.role)">{{ s.full_name.charAt(0) || '?' }}</span>
                            </div>
                            <div class="min-w-0 flex-1">
                              <div class="text-[9px] font-bold leading-tight truncate" :class="roleTextClass(s.role)">{{ s.full_name }}</div>
                            </div>
                          </div>
                          <div v-else
                               class="w-full p-2 h-8 rounded-lg border text-xs flex items-center justify-center font-bold border-default text-gray-400 hover:border-blue-400 transition-colors"
                               title="ចុចដើម្បីដាក់អ្នកចូលរួម">
                            {{ s.seat_number }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- ── Audience seats (grid) ── -->
                    <div v-if="audienceSeats.length > 0" class="mt-6">
                      <div class="text-xs  mb-2 font-semibold text-center">ទស្សនិកជន</div>
                      <div class="grid gap-2 justify-center" :style="{ gridTemplateColumns: 'repeat(' + audienceCols + ', 90px)' }">
                        <div v-for="s in audienceSeats" :key="'aud'+s.id" class="flex flex-col items-center cursor-pointer" @click="handleSeatClick(s)">
                          <div v-if="s.occupied" class="flex flex-col items-center rounded-lg border p-1.5 w-full shadow-sm hover:shadow-md transition-all"
                               :class="roleBorderClass(s.role)">
                            <div class="w-7 h-7 rounded-full  flex items-center justify-center overflow-hidden mb-0.5 ring-2 ring-offset-1"
                                 :class="roleRingClass(s.role)">
                              <img v-if="s.photo_url" :src="s.photo_url" class="w-full h-full object-cover" />
                              <span v-else class="text-[9px] font-bold" :class="roleTextClass(s.role)">{{ s.full_name.charAt(0) || '?' }}</span>
                            </div>
                            <span class="text-[9px] font-bold leading-tight text-center truncate w-full" :class="roleTextClass(s.role)">{{ s.full_name }}</span>
                          </div>
                          <div v-else
                               class="w-14 h-10 rounded border text-xs flex items-center justify-center font-bold border-default text-gray-400 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                               title="ចុចដើម្បីដាក់អ្នកចូលរួម">
                            {{ s.seat_number }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Legend -->
                  <div class="flex flex-wrap gap-4 justify-center mt-6 text-xs">
                    <div class="flex items-center"><div class="w-3 h-3 bg-yellow-100 border border-yellow-500 rounded mr-1"></div>ប្រធាន</div>
                    <div class="flex items-center"><div class="w-3 h-3 bg-blue-100 border rounded mr-1"></div>អនុប្រធាន</div>
                    <div class="flex items-center"><div class="w-3 h-3 bg-green-100 border rounded mr-1"></div>សមាជិក</div>
                    <div class="flex items-center"><div class="w-3 h-3 border border-default rounded mr-1"></div>ទំនេរ</div>
                  </div>

                  <!-- Print labels -->
                  <div class="flex justify-center mt-4">
                    <n-button type="primary" ghost size="small" @click="showPrintPreview = true">
                      <template #icon><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6 7V3h12v4h2.75A3.25 3.25 0 0 1 24 10.25v6.5A3.25 3.25 0 0 1 20.75 20H18v1.5H6V20H3.25A3.25 3.25 0 0 1 0 16.75v-6.5A3.25 3.25 0 0 1 3.25 7H6zm13.25 1.5H3.25A1.75 1.75 0 0 0 1.5 10.25v6.5c0 .966.784 1.75 1.75 1.75h18.5a1.75 1.75 0 0 0 1.75-1.75v-6.5a1.75 1.75 0 0 0-1.75-1.75H19.25zM7.5 3v4h9V3h-9zm9.75 13a.75.75 0 0 0 0-1.5h-10.5a.75.75 0 0 0 0 1.5h10.5z" fill="currentColor"></path></g></svg></template>
                      បោះពុម្ពស្លាកឈ្មោះ
                    </n-button>
                  </div>
                </div>

                <!-- ═══ Seat Picker Modal ═══ -->
                <n-modal v-model:show="showSeatPicker" preset="card" title="ជ្រើសរើសអ្នកចូលរួមសម្រាប់កៅអី" style="max-width:480px" :mask-closable="true">
                  <div class="space-y-3">
                    <n-input v-model:value="memberSearchQuery" placeholder="ស្វែងរកតាមឈ្មោះ មុខតំណែង ឬអង្គភាព..." clearable />
                    <div v-if="filteredAvailableMembers.length === 0" class="text-center text-gray-400 py-6">
                      <div v-if="memberSearchQuery">រកមិនឃើញតាមការស្វែងរក</div>
                      <div v-else>
                        <div>មិនមានអ្នកចូលរួមដែលនៅទំនេរទេ។</div>
                        <div class="text-xs mt-1">សូមបន្ថែមសមាជិកក្នុងកិច្ចប្រជុំ ឬចុចលើកៅអីដែលមានមនុស្សដើម្បីផ្លាស់ប្តូរ</div>
                      </div>
                    </div>
                    <div v-else class="max-h-64 overflow-y-auto space-y-1">
                      <div v-for="m in filteredAvailableMembers" :key="m.id"
                           class="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
                           @click="assignMemberToSeat(m)">
                        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-none">
                          <img v-if="m.photo_url" :src="m.photo_url" class="w-full h-full object-cover" />
                          <span v-else class="text-xs font-bold ">{{ (m.full_name || '?').charAt(0) }}</span>
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="text-sm font-bold truncate">{{ m.full_name }}</div>
                          <div class="text-xs  truncate">{{ m.position }}{{ m.position && m.organization ? ' · ' : '' }}{{ m.organization }}</div>
                        </div>
                        <span class="text-xs px-2 py-0.5 rounded font-bold flex-none" :class="roleBadgeClass(m.role)">{{ roleLabel(m.role) }}</span>
                      </div>
                    </div>
                  </div>
                </n-modal>

                <!-- ═══ Print Preview Modal ═══ -->
                <n-modal v-model:show="showPrintPreview" preset="card" title="បោះពុម្ពស្លាកឈ្មោះ" style="max-width:95vw" :mask-closable="true" class="print-preview-modal">
                  <div class="flex items-center justify-between mb-4">
                    <div class="text-xs text-gray-500">ស្លាកឈ្មោះចំនួន {{ nameCardItems.length }} នាក់ · {{ record?.objective || 'កិច្ចប្រជុំ' }} · {{ record?.date ? formatDate(record.date) : '' }} {{ record?.start && record?.end ? record.start + '-' + record.end : '' }} {{ record?.rooms?.length ? record.rooms.map(r=>r.name).join(', ') : '' }}</div>
                    <n-button type="primary" size="small" @click="handlePrint">
                      <template #icon><svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6 7V3h12v4h2.75A3.25 3.25 0 0 1 24 10.25v6.5A3.25 3.25 0 0 1 20.75 20H18v1.5H6V20H3.25A3.25 3.25 0 0 1 0 16.75v-6.5A3.25 3.25 0 0 1 3.25 7H6zm13.25 1.5H3.25A1.75 1.75 0 0 0 1.5 10.25v6.5c0 .966.784 1.75 1.75 1.75h18.5a1.75 1.75 0 0 0 1.75-1.75v-6.5a1.75 1.75 0 0 0-1.75-1.75H19.25zM7.5 3v4h9V3h-9zm9.75 13a.75.75 0 0 0 0-1.5h-10.5a.75.75 0 0 0 0 1.5h10.5z" fill="currentColor"></path></g></svg></template>
                      បោះពុម្ព
                    </n-button>
                  </div>

                  <!-- Name cards grid - A4 layout -->
                  <div id="name-card-print-area" class="name-card-print-area">
                    <div v-if="nameCardItems.length === 0" class="text-center text-gray-400 py-12">មិនទាន់មានការកំណត់កៅអីនៅឡើយទេ។</div>

                    <!-- Group by role -->
                    <template v-for="(group, gIdx) in groupedNameCards" :key="gIdx">
                      <div class="print-group-header">{{ group.label }} ({{ group.items.length }})</div>
                      <div class="name-card-grid">
                        <div v-for="item in group.items" :key="item.seat_id" class="name-card" :class="item.organization_logo ? 'has-logo' : 'no-logo'">
                          <div class="name-card-seat">{{ item.seat_number }}</div>
                          <!-- Left column: Organization logo (only if exists) -->
                          <div v-if="item.organization_logo" class="name-card-logo-col">
                            <div class="name-card-logo">
                              <svg viewBox="0 0 100 100" class="w-full h-full">
                                <rect x="5" y="20" width="90" height="60" rx="5" fill="none" stroke="#333" stroke-width="2"/>
                                <path d="M20 20V10h60v10" fill="none" stroke="#333" stroke-width="2"/>
                                <rect x="30" y="35" width="40" height="30" rx="3" fill="none" stroke="#333" stroke-width="1.5"/>
                                <circle cx="50" cy="45" r="10" fill="none" stroke="#333" stroke-width="1.5"/>
                                <path d="M40 55 Q50 60 60 55" fill="none" stroke="#333" stroke-width="1.5"/>
                                <text x="50" y="78" text-anchor="middle" font-size="6" fill="#333">{{ (item.organization || '').substring(0,12) }}</text>
                              </svg>
                            </div>
                          </div>
                          <!-- Right column: Name + Position (full width when no logo) -->
                          <div class="name-card-info-col" :class="item.organization_logo ? '' : 'full-width'">
                            <div class="name-card-name font-moul mt-4">{{ item?.member?.lastname + ' ' + item?.member?.firstname }}</div>
                            <div class="name-card-bottom">
                              <div class="name-card-position font-moul mb-2">{{ item.position }}</div>
                              <div class="name-card-org font-moul">{{ item.organization }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </n-modal>

                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-moul text-lg ">បញ្ជីអ្នកចូលរួម ({{ record.listMembers?record.listMembers.length:0 }} នាក់)</h3>
                </div>
                <div class="flex gap-0">
                  <!-- Left: Search + People list -->
                  <div class="flex-none border border-gray-200 rounded-lg bg-white overflow-hidden" :style="{ width: memberPanelWidth + 'px' }">
                    <div class="p-2 border-b border-gray-200 flex gap-1">
                      <n-input v-model:value="inlineMemberSearch" placeholder="ស្វែងរក..." clearable size="small" @update:value="onSearchInput" class="flex-1" />
                      <n-button size="tiny" type="primary" @click="toggleAddForm">
                        <template #icon><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></template>
                        <span class="text-xs">ថ្មី</span>
                      </n-button>
                    </div>
                    <div v-if="inlineSearchResults.length > 0" class="overflow-y-auto" style="max-height: 400px;">
                      <div v-for="(p,i) in inlineSearchResults" :key="'sr'+i"
                        class="flex items-center gap-2 px-3 py-2 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors"
                        @click="addMemberToMeeting(p)">
                        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-none text-xs font-bold">{{ (p.lastname||'?').charAt(0) }}</div>
                        <div class="flex-1 min-w-0">
                          <div class="text-sm font-bold truncate">{{ p.lastname }} {{ p.firstname }}</div>
                          <div class="text-xs text-gray-500 truncate">{{ p.mobile_phone || '' }}{{ p.mobile_phone && p.email ? ' · ' : '' }}{{ p.email || '' }}</div>
                        </div>
                        <svg class="w-5 h-5 text-green-500 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>
                      </div>
                    </div>
                    <div v-else-if="inlineMemberSearch && inlineSearchResults.length === 0" class="text-center text-gray-400 py-8 text-sm">
                      រកមិនឃើញ
                    </div>
                    <div v-else class="text-center text-gray-400 py-8 text-sm">
                      សូមវាយបញ្ចូលឈ្មោះដើម្បីស្វែងរក
                    </div>
                    <!-- Add new person modal -->
                    <n-modal v-model:show="showAddPersonForm" preset="card" title="បន្ថែមសមាជិកថ្មី" style="max-width:500px" :mask-closable="true">
                      <n-form size="small" label-placement="top">
                        <n-form-item label="ងារ">
                          <n-select v-model:value="newPerson.countesy" :options="countesyOptions" filterable placeholder="ជ្រើសរើសងារ" />
                        </n-form-item>
                        <n-form-item label="គោត្តនាម" required>
                          <n-input v-model:value="newPerson.lastname" placeholder="គោត្តនាម" />
                        </n-form-item>
                        <n-form-item label="នាមខ្លួន" required>
                          <n-input v-model:value="newPerson.firstname" placeholder="នាមខ្លួន" />
                        </n-form-item>
                        <n-form-item label="ភេទ">
                          <n-select v-model:value="newPerson.gender" :options="[{label:'ប្រុស',value:1},{label:'ស្រី',value:0}]" />
                        </n-form-item>
                        <n-form-item label="ទូរស័ព្ទ">
                          <n-input v-model:value="newPerson.phone" placeholder="លេខទូរស័ព្ទ" />
                        </n-form-item>
                        <n-form-item label="អ៊ីមែល">
                          <n-input v-model:value="newPerson.email" placeholder="អ៊ីមែល" />
                        </n-form-item>
                        <n-form-item label="តួនាទី">
                          <n-select v-model:value="newPerson.position" :options="positionOptions" filterable placeholder="ជ្រើសរើសតួនាទី" />
                        </n-form-item>
                        <n-form-item label="ក្រសួង ស្ថាប័ន">
                          <n-select v-model:value="newPerson.organization" :options="organizationOptions" filterable placeholder="ជ្រើសរើសស្ថាប័ន" />
                        </n-form-item>
                        <n-button type="primary" size="small" block @click="saveNewPerson" :disabled="!newPerson.lastname || !newPerson.firstname">
                          រក្សាទុក និងបន្ថែម
                        </n-button>
                      </n-form>
                    </n-modal>
                  </div>
                  <!-- Draggable divider -->
                  <div class="w-2 flex-none cursor-col-resize flex items-center justify-center select-none hover:bg-blue-100 active:bg-blue-200 transition-colors"
                    @mousedown.prevent="startResizePanel">
                    <div class="w-0.5 h-8 bg-gray-300 rounded"></div>
                  </div>
                  <!-- Right: Participants table -->
                  <div class="flex-1 min-w-0">
                    <div v-if="!record.listMembers||record.listMembers.length===0" class="text-center text-gray-400 py-8">មិនមានសមាសភាពអង្គប្រជុំ</div>
                    <div v-else class="overflow-x-auto">
                      <table class="w-full border-collapse">
                        <thead class="print-hide"><tr class=" text-left"><th class="p-3 text-sm border-b border-gray-200 w-12">ល.រ</th><th class="p-3 text-sm border-b border-gray-200 w-16">កៅអី</th><th class="p-3 text-sm border-b border-gray-200">ឈ្មោះ</th><th class="p-3 text-sm border-b border-gray-200">តួនាទី</th><th class="p-3 text-sm border-b border-gray-200">ក្រុម</th><th class="p-3 text-sm border-b border-gray-200">វត្តមាន</th><th class="p-3 text-sm border-b border-gray-200 w-10"></th></tr></thead>
                        <tbody>
                          <tr v-for="(lm,index) in record.listMembers" :key="lm.id||index" class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="p-3">{{ index+1 }}</td>
                            <td class="p-3">
                              <span v-if="lm.seat" class="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold" :class="seatBadgeClass(lm)">{{ lm.seat }}</span>
                              <span v-else class="text-gray-300">{{ lm.room_seat_id || '—' }}</span>
                            </td>
                            <td class="p-3 text-left">
                              <div class="font-bold text-sm">
                                <template v-if="lm.member">
                                  <template v-if="lm.member.officers&&lm.member.officers.length">{{ lm.member.officers.map(o=>(o.countesy?o.countesy.name+' ':'')) }}{{ lm.member.lastname }} {{ lm.member.firstname }}</template>
                                  <template v-else>{{ lm.member.lastname }} {{ lm.member.firstname }}</template>
                                </template>
                                <template v-else>មិនស្គាល់</template>
                              </div>
                              <div v-if="lm.member&&lm.member.organizations&&lm.member.organizations.length" class="text-xs text-gray-500">{{ lm.member.organizations.map(o=>o.name).join(', ') }}</div>
                            </td>
                            <td class="p-3 text-left">
                              <n-select v-model:value="lm.role" :options="roleOptions" size="tiny" @update:value="updateMemberGroupAndRole(lm)" class="w-28" />
                            </td>
                            <td class="p-3 text-left">
                              <n-select v-model:value="lm.group" :options="groupOptions" size="tiny" @update:value="updateMemberGroupAndRole(lm)" class="w-32" />
                            </td>
                            <td class="p-3 text-left">
                              <n-popselect :value="attendantValue(lm)" :options="attendantOptions(lm)" size="small" trigger="click" @update:value="(val)=>updateAttendant(lm,val)">
                                <n-button size="tiny" quaternary :type="attendantType(lm)">
                                  <template #icon><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></template>
                                  {{ attendantLabel(lm) }}
                                </n-button>
                              </n-popselect>
                            </td>
                            <td class="p-3 text-center">
                              <n-button size="tiny" quaternary type="error" @click="removeMemberFromMeeting(lm)" class="!p-0">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </n-button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </n-tab-pane>

            <!-- ═══ TAB 3: REFERENCES ═══ -->
            <n-tab-pane name="references" tab="ឯកសារយោង">
              <div class="p-4 md:p-6">
                <div class="flex" style="height: 1024px;">
                  <!-- Left Sidebar: grouped file list -->
                  <div class="w-72 flex-none border border-gray-200 rounded-l-lg overflow-y-auto overflow-x-hidden">
                    <!-- Minister Preeng -->
                    <div class="border-b border-gray-200">
                      <div class="flex items-center justify-between px-3 py-2 bg-red-50 border-b border-red-100 sticky top-0 z-10">
                        <div class="flex items-center space-x-1.5">
                          <!-- <svg class="w-4 h-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg> -->
                          <span class="font-bold text-xs text-red-800">សេចក្តីប្រកាសពីរដ្ឋមន្ត្រី</span>
                          <span class="text-xs text-red-400">({{ docSections.ministerPreeng.files.length }})</span>
                        </div>
                        <n-upload accept=".pdf" :show-file-list="false" :custom-request="(opt)=>uploadDoc('ministerPreeng',opt)" class="w-4">
                          <n-button size="tiny" type="error" ghost>+</n-button>
                        </n-upload>
                      </div>
                      <div v-if="docSections.ministerPreeng.files.length===0" class="text-gray-400 text-xxs text-center py-3">គ្មានឯកសារ</div>
                      <div v-for="(f,i) in docSections.ministerPreeng.files" :key="'m'+i"
                        class="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 hover:cursor-pointer transition-colors"
                        :class="activeKey==='ministerPreeng'&&activeIdx===i?'bg-blue-50 border-l-2 border-l-blue-500':''"
                        @click="selectDoc('ministerPreeng',i)">
                        <div class="flex items-center space-x-2 min-w-0">
                          <!-- <svg class="w-3.5 h-3.5 text-red-400 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg> -->
                          <span class="text-xs  truncate">{{ f.name }}</span>
                        </div>
                        <n-button size="tiny" quaternary type="error" @click.stop="removeDoc('ministerPreeng',i)" style="opacity:0.4">✕</n-button>
                      </div>
                    </div>
                    <!-- Seichdey Preeng -->
                    <div class="border-b border-gray-200">
                      <div class="flex items-center justify-between px-3 py-2 bg-amber-50 border-b border-amber-100 sticky top-0 z-10">
                        <div class="flex items-center space-x-1.5">
                          <!-- <svg class="w-4 h-4 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg> -->
                          <span class="font-bold text-xs text-amber-800">សេចក្តីព្រាងគតិយុត្ត</span>
                          <span class="text-xs text-amber-400">({{ docSections.seichdeyPreeng.files.length }})</span>
                        </div>
                        <n-upload accept=".pdf" :show-file-list="false" :custom-request="(opt)=>uploadDoc('seichdeyPreeng',opt)" class="w-4">
                          <n-button size="tiny" type="warning" ghost>+</n-button>
                        </n-upload>
                      </div>
                      <div v-if="docSections.seichdeyPreeng.files.length===0" class="text-gray-400 text-xxs text-center py-3">គ្មានឯកសារ</div>
                      <div v-for="(f,i) in docSections.seichdeyPreeng.files" :key="'s'+i"
                        class="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 hover:cursor-pointer transition-colors"
                        :class="activeKey==='seichdeyPreeng'&&activeIdx===i?'bg-blue-50 border-l-2 border-l-blue-500':''"
                        @click="selectDoc('seichdeyPreeng',i)">
                        <div class="flex items-center space-x-2 min-w-0">
                          <!-- <svg class="w-3.5 h-3.5 text-amber-400 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg> -->
                          <span class="text-xs  truncate">{{ f.name }}</span>
                        </div>
                        <n-button size="tiny" quaternary type="error" @click.stop="removeDoc('seichdeyPreeng',i)" style="opacity:0.4">✕</n-button>
                      </div>
                    </div>
                    <!-- Tech Reports -->
                    <div class="border-b border-gray-200">
                      <div class="flex items-center justify-between px-3 py-2 bg-blue-50 border-b border-blue-100 sticky top-0 z-10">
                        <div class="flex items-center space-x-1.5">
                          <!-- <svg class="w-4 h-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg> -->
                          <span class="font-bold text-xs text-blue-800">របាយការណ៍បច្ចេកទេស</span>
                          <span class="text-xs text-blue-400">({{ docSections.techReports.files.length }})</span>
                        </div>
                        <n-upload accept=".pdf" :show-file-list="false" :custom-request="(opt)=>uploadDoc('techReports',opt)" class="w-4">
                          <n-button size="tiny" type="info" ghost>+</n-button>
                        </n-upload>
                      </div>
                      <div v-if="docSections.techReports.files.length===0" class="text-gray-400 text-xxs text-center py-3">គ្មានឯកសារ</div>
                      <div v-for="(f,i) in docSections.techReports.files" :key="'t'+i"
                        class="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 hover:cursor-pointer transition-colors"
                        :class="activeKey==='techReports'&&activeIdx===i?'bg-blue-50 border-l-2 border-l-blue-500':''"
                        @click="selectDoc('techReports',i)">
                        <div class="flex items-center space-x-2 min-w-0">
                          <!-- <svg class="w-3.5 h-3.5 text-blue-400 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg> -->
                          <span class="text-xs  truncate">{{ f.name }}</span>
                        </div>
                        <n-button size="tiny" quaternary type="error" @click.stop="removeDoc('techReports',i)" style="opacity:0.4">✕</n-button>
                      </div>
                    </div>
                    <!-- Reports -->
                    <div class="border-b border-gray-200">
                      <div class="flex items-center justify-between px-3 py-2 bg-green-50 border-b border-green-100 sticky top-0 z-10">
                        <div class="flex items-center space-x-1.5">
                          <!-- <svg class="w-4 h-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg> -->
                          <span class="font-bold text-green-500 text-xs ">របាយការណ៍ទូទៅ</span>
                          <span class="text-xs text-green-500 ">({{ docSections.reports.files.length }})</span>
                        </div>
                        <n-upload accept=".pdf" :show-file-list="false" :custom-request="(opt)=>uploadDoc('reports',opt)" class="w-4">
                          <n-button size="tiny" type="success" ghost>+</n-button>
                        </n-upload>
                      </div>
                      <div v-if="docSections.reports.files.length===0" class="text-gray-400 text-xxs text-center py-3">គ្មានឯកសារ</div>
                      <div v-for="(f,i) in docSections.reports.files" :key="'r'+i"
                        class="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 hover:cursor-pointer transition-colors"
                        :class="activeKey==='reports'&&activeIdx===i?'bg-blue-50 border-l-2 border-l-blue-500':''"
                        @click="selectDoc('reports',i)">
                        <div class="flex items-center space-x-2 min-w-0">
                          <!-- <svg class="w-3.5 h-3.5  flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg> -->
                          <span class="text-xs  truncate">{{ f.name }}</span>
                        </div>
                        <n-button size="tiny" quaternary type="error" @click.stop="removeDoc('reports',i)" style="opacity:0.4">✕</n-button>
                      </div>
                    </div>
                    <!-- Other Documents -->
                    <div class="border-b border-gray-200">
                      <div class="flex items-center justify-between px-3 py-2 bg-purple-50 border-b border-purple-100 sticky top-0 z-10">
                        <div class="flex items-center space-x-1.5">
                          <!-- <svg class="w-4 h-4 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg> -->
                          <span class="font-bold text-xs text-purple-800">ឯកសារផ្សេងៗ</span>
                          <span class="text-xs text-purple-400">({{ docSections.otherDocuments.files.length }})</span>
                        </div>
                        <n-upload accept=".pdf" :show-file-list="false" :custom-request="(opt)=>uploadDoc('otherDocuments',opt)" class="w-4">
                          <n-button size="tiny" type="primary" ghost>+</n-button>
                        </n-upload>
                      </div>
                      <div v-if="docSections.otherDocuments.files.length===0" class="text-gray-400 text-xxs text-center py-3">គ្មានឯកសារ</div>
                      <div v-for="(f,i) in docSections.otherDocuments.files" :key="'o'+i"
                        class="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 hover:cursor-pointer transition-colors"
                        :class="activeKey==='otherDocuments'&&activeIdx===i?'bg-blue-50 border-l-2 border-l-blue-500':''"
                        @click="selectDoc('otherDocuments',i)">
                        <div class="flex items-center space-x-2 min-w-0">
                          <!-- <svg class="w-3.5 h-3.5 text-purple-400 flex-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg> -->
                          <span class="text-xs  truncate">{{ f.name }}</span>
                        </div>
                        <n-button size="tiny" quaternary type="error" @click.stop="removeDoc('otherDocuments',i)" style="opacity:0.4">✕</n-button>
                      </div>
                    </div>
                  </div>
                  <!-- Right Side: PDF Viewer -->
                  <div class="flex-1 border border-gray-200 rounded-r-lg border-l-0  flex items-center justify-center overflow-hidden ">
                    <iframe v-if="activePdfSrc" :src="activePdfSrc" class="w-full h-full border-0"></iframe>
                    <div v-else class="text-gray-400 text-sm text-center px-4">
                      <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg>
                      ជ្រើសរើសឯកសារពីបញ្ជីខាងឆ្វេងដើម្បីមើល
                    </div>
                  </div>
                </div>
              </div>
            </n-tab-pane>
            <!-- ═══ TAB 4: EQUIPMENT CHECKLIST ═══ -->
            <n-tab-pane name="checklist" tab="បញ្ជីត្រួតពិនិត្យ">
              <div class="p-4 md:p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  <div class="rounded-lg border border-gray-200 overflow-hidden">
                    <div class="px-4 py-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
                      <h3 class="font-moul text-md text-amber-800">មុនពេលប្រជុំ</h3>
                      <span class="text-xs font-bold px-2 py-0.5 rounded-full" :class="preCheckAllDone?'bg-green-100':'bg-amber-100 text-amber-700'">{{ preCheckDoneCount }}/{{ preChecklist.length }}</span>
                    </div>
                    <div v-if="preChecklist.length===0" class="text-gray-400 text-sm text-center py-4">មិនទាន់មានបញ្ជីត្រួតពិនិត្យ</div>
                    <table v-else class="w-full border-collapse">
                      <thead>
                        <tr class="bg-gray-50 text-left">
                          <th class="p-2 text-xs border-b w-10"></th>
                          <th class="p-2 text-xs border-b">ឈ្មោះឧបករណ៍</th>
                          <th class="p-2 text-xs border-b w-24">ស្ថានភាព</th>
                          <th class="p-2 text-xs border-b w-16">ម៉ោង</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in preChecklist" :key="'pre'+item.id" class="hover:bg-gray-50 border-b border-gray-100">
                          <td class="p-2 text-center"><n-checkbox :checked="item.is_checked" @update:checked="toggleCheck(item)" size="small" /></td>
                          <td class="p-2 text-sm" :class="item.is_checked?'text-gray-400 line-through':''">{{ item.item_name }}</td>
                          <td class="p-2">
                            <n-tag :type="item.equipment_status === 'working' ? 'success' : 'error'" size="tiny" round @click="toggleEquipStatus(item)" class="cursor-pointer">{{ item.equipment_status === 'working' ? 'ដំណើរការ' : 'ខូច' }}</n-tag>
                          </td>
                          <td class="p-2 text-xs text-gray-400">{{ item.checked_at || '—' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div class="rounded-lg border border-gray-200 overflow-hidden">
                    <div class="px-4 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
                      <h3 class="font-moul text-md text-blue-800">ក្រោយពេលប្រជុំ</h3>
                      <span class="text-xs font-bold px-2 py-0.5 rounded-full" :class="postCheckAllDone?'bg-green-100':'bg-blue-100 text-blue-700'">{{ postCheckDoneCount }}/{{ postChecklist.length }}</span>
                    </div>
                    <div v-if="postChecklist.length===0" class="text-gray-400 text-sm text-center py-4">មិនទាន់មានបញ្ជីត្រួតពិនិត្យ</div>
                    <table v-else class="w-full border-collapse">
                      <thead>
                        <tr class="bg-gray-50 text-left">
                          <th class="p-2 text-xs border-b w-10"></th>
                          <th class="p-2 text-xs border-b">ឈ្មោះឧបករណ៍</th>
                          <th class="p-2 text-xs border-b w-24">ស្ថានភាព</th>
                          <th class="p-2 text-xs border-b w-16">ម៉ោង</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in postChecklist" :key="'post'+item.id" class="hover:bg-gray-50 border-b border-gray-100">
                          <td class="p-2 text-center"><n-checkbox :checked="item.is_checked" @update:checked="toggleCheck(item)" size="small" /></td>
                          <td class="p-2 text-sm" :class="item.is_checked?'text-gray-400 line-through':''">{{ item.item_name }}</td>
                          <td class="p-2">
                            <n-tag :type="item.equipment_status === 'working' ? 'success' : 'error'" size="tiny" round @click="toggleEquipStatus(item)" class="cursor-pointer">{{ item.equipment_status === 'working' ? 'ដំណើរការ' : 'ខូច' }}</n-tag>
                          </td>
                          <td class="p-2 text-xs text-gray-400">{{ item.checked_at || '—' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </n-tab-pane>

            <!-- ═══ TAB 5: LEGAL DRAFT ═══ -->
            <n-tab-pane name="draft" tab="សេចក្តីព្រាង">
              <div class="p-4 md:p-6">
                <div v-if="!legalDraft" class="text-center text-gray-400 py-12 bg-gray-50 rounded-lg border border-dashed border-default"><svg class="w-16 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A3.25 3.25 0 0 0 3.5 6.75v10.5a3.25 3.25 0 0 0 3.25 3.25h10.5a3.25 3.25 0 0 0 3.25-3.25V9.372a2.25 2.25 0 0 0-.659-1.59L15.218 3.16A2.25 2.25 0 0 0 13.628 2.5H11.5v2.25c0 1.519-1.231 2.75-2.75 2.75H6.75V3.5z" fill="currentColor"></path></g></svg><div>មិនទាន់មានសេចក្តីព្រាង</div></div>
                <div v-else class="rounded-lg border border-gray-200 overflow-hidden">
                  <div class="flex items-center justify-between p-4 border-b border-default">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 border border-default rounded-lg flex items-center justify-center">
                        <svg class="w-8 h-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M8.75 11.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0 2.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0 2.75a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5z" fill="currentColor"></path></g></svg>
                      </div>
                      <div>
                        <div class="font-bold ">{{ legalDraft.title }}</div>
                        <div class="text-xs ">v{{ legalDraft.version_number || 1 }} · {{ legalDraft.regulator || '' }}</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <router-link :to="{name:'DraftViewer',params:{meeting_id:record.id,draft_id:record.id},query:{meeting_status:record.status,meeting_date:record.date}}" 
                      class="inline-flex items-center text-sm px-3 py-1.5 rounded border border-default transition-colors"
                      >
                        <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zm-3.25 7a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75zm0 3.5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75z" fill="currentColor"></path></g></svg>បើកមើលសេចក្តីព្រាង
                      </router-link>
                      <router-link :to="{name:'DraftTimeline',params:{meeting_id:record.id}}" class="inline-flex items-center text-sm  px-3 py-1.5 rounded border border-default transition-colors">
                        <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM11.75 6a.75.75 0 0 1 .75.75V12h3.75a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75V6.75a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></g></svg>ប្រវត្តិកំណែ
                      </router-link>
                    </div>
                  </div>
                  <div class="p-4">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div><span class="">ស្ថានភាព៖</span> <span class="font-bold ml-1" :class="legalDraft.status==='final'?'':'text-blue-400'">{{ legalDraft.status==='final'?'ចុងក្រោយ':'កំពុងដំណើរការ' }}</span></div>
                      <div><span class="">កំណែបច្ចុប្បន្ន៖</span> <span class="font-bold ml-1">v{{ legalDraft.version_number || 1 }}</span></div>
                      <div><span class="">គតិយុត្តយោង៖</span> <span class="font-bold ml-1">{{ legalDraft.regulator || 'មិនមាន' }}</span></div>
                    </div>
                    <div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700" v-if="!meetingNotStarted">
                      <svg class="w-4 h-4 inline mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM11 7a1 1 0 1 0 2 0a1 1 0 0 0-2 0zm1 3.75v5.5a.75.75 0 0 0 1.5 0v-5.5a.75.75 0 0 0-1.5 0z" fill="currentColor"></path></g></svg>កិច្ចប្រជុំបានចាប់ផ្ដើមហើយ — មិនអាចកែប្រែមតិ ឬកំណត់ចំណាំលើសេចក្តីព្រាងបានទេ។
                    </div>
                  </div>
                </div>
              </div>
            </n-tab-pane>

          </n-tabs>
        </div>
      </div>
    </Transition>

    <!-- Agenda Modal -->
    <n-modal v-model:show="showAgendaForm" preset="card" title="បន្ថែមសកម្មភាពក្នុងរបៀបវារៈ" style="max-width:560px" :mask-closable="false">
      <n-form label-placement="top" size="medium">
        <n-form-item label="ចំណងជើងសកម្មភាព" required><n-input v-model:value="agendaForm.topic" placeholder="ឧ. បើកកិច្ចប្រជុំ..." type="textarea" :autosize="{minRows:2,maxRows:4}" /></n-form-item>
        <div class="grid grid-cols-2 gap-4"><n-form-item label="ម៉ោងចាប់ផ្ដើម" required><n-input v-model:value="agendaForm.start_time" type="time" /></n-form-item><n-form-item label="រយៈពេល (នាទី)" required><n-input-number v-model:value="agendaForm.duration" :min="1" :max="480" placeholder="30" /></n-form-item></div>
        <n-form-item label="អ្នកទទួលបន្ទុក"><n-select v-model:value="agendaForm.handlerIds" :options="availableHandlers" multiple placeholder="ជ្រើសរើសអ្នកទទួលបន្ទុក..." filterable /></n-form-item>
      </n-form>
      <template #footer><div class="flex justify-end space-x-2"><n-button @click="showAgendaForm=false">បោះបង់</n-button><n-button type="primary" @click="saveAgenda" :disabled="!agendaForm.topic||!agendaForm.start_time||!agendaForm.duration">{{ editingAgendaIndex!==null?'កែប្រែ':'រក្សាទុក' }}</n-button></div></template>
    </n-modal>

    <!-- Edit meeting -->
    <update-form
      v-bind:model="model"
      v-bind:record="record"
      v-bind:show="showEditModal"
      :onClose="closeEditModal"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useMessage, useNotification } from 'naive-ui'
import dateFormat from 'dateformat'
import UpdateForm from '../widgets/update.vue'

// ─── Mock Data ──────────────────────────────────────────────────────────
function getMockRecord() {
  return {
    id:1,objective:'កិច្ចប្រជុំពិនិត្យវឌ្ឍនភាពគម្រោងហេដ្ឋារចនាសម្ព័ន្ធ',date:'2026-07-15',start:'08:00',end:'11:30',status:1,
    summary:'កិច្ចប្រជុំនេះមានគោលបំណងពិនិត្យវឌ្ឍនភាពនៃគម្រោងហេដ្ឋារចនាសម្ព័ន្ធសាធារណៈ និងសម្រេចលើដំណាក់កាលបន្ទាប់។',
    route:'ចូលតាមច្រកទ្វារខាងកើត អគារទីស្ដីការគណៈរដ្ឋមន្ត្រី ជាន់ទី៣ បន្ទប់លេខ 3A-០៥។ សូមយកជណ្ដើរយន្តខាងឆ្វេងដៃក្រោយឆ្លងកាត់សាលទទួលភ្ញៀវ។',
    type:{id:1,name:'ប្រជុំតាមដាន'},rooms:[{id:1,name:'សាលប្រជុំរដ្ឋមន្ត្រី'}],
    organizations:[{id:1,name:'ក្រសួងសាធារណការ និងដឹកជញ្ជូន'},{id:2,name:'ក្រសួងសេដ្ឋកិច្ច និងហិរញ្ញវត្ថុ'}],
    agendas:[
      {id:1,topic:'បើកកិច្ចប្រជុំ និងណែនាំរបៀបវារៈ',start_time:'08:00',duration:10,handlers:[{id:1,name:'H.E. សុខ ហេង',role:'អ្នកដឹកនាំប្រជុំ'}]},
      {id:2,topic:'ពិនិត្យ និងអនុម័តកំណត់ហេតុប្រជុំលើកមុន',start_time:'08:10',duration:15,handlers:[{id:2,name:'អ្នកស្រី ចន្ថា សុគន្ធ',role:'អនុប្រធាន'}]},
      {id:3,topic:'របាយការណ៍វឌ្ឍនភាពគម្រោង',start_time:'08:25',duration:45,handlers:[{id:3,name:'លោក ដារ៉ា មករា',role:'សមាជិក'},{id:4,name:'អ្នកស្រី សុភា ម៉ាលី',role:'សមាជិក'}]},
      {id:4,topic:'សម្រាក',start_time:'09:10',duration:15,handlers:[]},
      {id:5,topic:'ពិភាក្សាថវិកា និងធនធានសម្រាប់ដំណាក់កាលបន្ទាប់',start_time:'09:25',duration:60,handlers:[{id:2,name:'អ្នកស្រី ចន្ថា សុគន្ធ',role:'អនុប្រធាន'}]},
      {id:6,topic:'សេចក្តីសម្រេច និងបិទកិច្ចប្រជុំ',start_time:'10:25',duration:15,handlers:[{id:1,name:'H.E. សុខ ហេង',role:'អ្នកដឹកនាំប្រជុំ'}]}
    ],
    listMembers:[
      {id:101,member:{id:1,lastname:'សុខ',firstname:'ហេង',organizations:[{name:'ក្រសួងសាធារណការ'}]},role:'leader',group:'lead_meeting',seat:1,attendant:{people_id:1}},
      {id:102,member:{id:2,lastname:'ចន្ថា',firstname:'សុគន្ធ',organizations:[{name:'ក្រសួងសេដ្ឋកិច្ច'}]},role:'deputy_leader',group:'lead_meeting',seat:2,attendant:{people_id:2}},
      {id:103,member:{id:3,lastname:'ដារ៉ា',firstname:'មករា',organizations:[{name:'ក្រសួងសាធារណការ'}]},role:'member',group:'audient',seat:3,attendant:{people_id:3}},
      {id:104,member:{id:4,lastname:'សុភា',firstname:'ម៉ាលី',organizations:[{name:'ក្រសួងសេដ្ឋកិច្ច'}]},role:'member',group:'audient',seat:4,attendant:{people_id:4}},
      {id:105,member:{id:5,lastname:'វណ្ណា',firstname:'គឹមសាន',organizations:[{name:'ក្រសួងសាធារណការ'}]},role:'member',group:'defender',seat:5,attendant:{people_id:5}},
      {id:106,member:{id:6,lastname:'បូរី',firstname:'សុខា',organizations:[{name:'ក្រសួងសេដ្ឋកិច្ច'}]},role:'member',group:'audient',seat:6,attendant:null},
      {id:107,member:{id:7,lastname:'មុនី',firstname:'រក្សា',organizations:[{name:'ក្រសួងសាធារណការ'}]},role:'member',group:'audient',seat:7,attendant:{people_id:7}},
      {id:108,member:{id:8,lastname:'វិចិត្រ',firstname:'សុវណ្ណ',organizations:[{name:'ក្រសួងសេដ្ឋកិច្ច'}]},role:'member',group:'defender',seat:8,attendant:{people_id:8}},
      {id:109,member:{id:9,lastname:'សំណាង',firstname:'វុទ្ធី',organizations:[{name:'ក្រសួងសាធារណការ'}]},role:'member',group:'audient',seat:9,attendant:{people_id:9}},
      {id:110,member:{id:10,lastname:'កុសល',firstname:'បញ្ញា',organizations:[{name:'ក្រសួងសេដ្ឋកិច្ច'}]},role:'member',group:'audient',seat:10,attendant:null},
      {id:111,member:{id:11,lastname:'រដ្ឋា',firstname:'សុខឡា',organizations:[{name:'ក្រសួងសាធារណការ'}]},role:'member',group:'defender',seat:11,attendant:{people_id:11}},
      {id:112,member:{id:12,lastname:'ស្រីពេជ្រ',firstname:'និមល',organizations:[{name:'ក្រសួងសេដ្ឋកិច្ច'}]},role:'member',group:'audient',seat:12,attendant:{people_id:12}}
    ],
    minister_preeng:[
      {name:'សេចក្តីប្រកាសរដ្ឋមន្ត្រីស្តីពីគម្រោង.pdf',serial:'abc123'},
      {name:'សេចក្តីណែនាំបន្ថែម.pdf',serial:'def456'}
    ],
    seichdey_preeng:[
      {name:'សេចក្តីព្រាងគតិយុត្ត.pdf',serial:'ghi789'}
    ],
    tech_reports:[
      {name:'របាយការណ៍បច្ចេកទេសខែមិថុនា.pdf',serial:'jkl012'}
    ],
    reports:[
      {name:'របាយការណ៍វឌ្ឍនភាពខែមិថុនា.pdf',serial:'mno345'},
      {name:'របាយការណ៍ហិរញ្ញវត្ថុ.pdf',serial:'pqr678'}
    ],
    other_documents:[
      {name:'ឯកសារយោងគតិយុត្ត.pdf',serial:'stu901'},
      {name:'ស្លាយបទបង្ហាញ.pdf',serial:'vwx234'}
    ]
  }
}

function getMockDraft() {
  return {
    id:1, title:'សេចក្តីព្រាងគោលនយោបាយទូរគមនាគមន៍', status:'progressing', version_number:4,
    regulator:'ប្រកាសលេខ ១២៣ ស្តីពីទូរគមនាគមន៍',
    pdf_url:'#', docx_url:'#',
  }
}

export default {
  name:'MeetingDetailPage',
  components: { UpdateForm },
  props:{model:{type:Object,required:true,default:()=>({name:'meeting',title:'កិច្ចប្រជុំ'})}},
  setup(props){
    const store=useStore();const route=useRoute();const message=useMessage();const notify=useNotification()
    const record=ref(null);const loading=ref(true);const error=ref(false)
    const showEditModal = ref(false)
    function closeEditModal(actionStatus) {
      showEditModal.value = false
      if (parseInt(actionStatus) > 0) fetchMeeting()
    }
    const useMockData=ref(false)

    // ─── Resizable Panel ─────────────────────────────────────────────────
    const memberPanelWidth = ref(288)
    function startResizePanel(e) {
      const startX = e.clientX
      const startWidth = memberPanelWidth.value
      function onMouseMove(ev) {
        const diff = ev.clientX - startX
        memberPanelWidth.value = Math.max(160, Math.min(600, startWidth + diff))
      }
      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    // ─── Inline Member Management ────────────────────────────────────────
    const inlineMemberSearch = ref('')
    const inlineSearchResults = ref([])
    const showAddPersonForm = ref(false)
    const newPerson = reactive({ countesy:null, lastname:'', firstname:'', gender:1, phone:'', email:'', position:null, organization:null })
    const countesyOptions = ref([])
    const positionOptions = ref([])
    const organizationOptions = ref([])
    function loadFormOptions() {
      Promise.all([
        store.dispatch('meetingCountesy/list', { page: 1, perPage: 200, search: '' }),
        store.dispatch('meetingPosition/list', { page: 1, perPage: 200, search: '' }),
        store.dispatch('meetingOrganization/list', { page: 1, perPage: 200, search: '' }),
      ]).then(([cr, pr, or]) => {
        if (cr.data?.records) store.commit('meetingCountesy/setAllRecords', cr.data.records)
        if (pr.data?.records) store.commit('meetingPosition/setAllRecords', pr.data.records)
        if (or.data?.records) store.commit('meetingOrganization/setAllRecords', or.data.records)
        countesyOptions.value = (store.getters['meetingCountesy/records'].all || []).map(c => ({ label: c.name, value: c.id }))
        positionOptions.value = (store.getters['meetingPosition/records'].all || []).map(p => ({ label: p.name, value: p.id }))
        organizationOptions.value = (store.getters['meetingOrganization/records'].all || []).map(o => ({ label: o.name, value: o.id }))
      })
    }
    function toggleAddForm() {
      showAddPersonForm.value = !showAddPersonForm.value
      if (showAddPersonForm.value) loadFormOptions()
    }
    function saveNewPerson() {
      if (!newPerson.lastname || !newPerson.firstname) return
      store.dispatch('meetingPeople/save', { countesy: newPerson.countesy, lastname: newPerson.lastname, firstname: newPerson.firstname, gender: newPerson.gender, phone: newPerson.phone, email: newPerson.email, position: newPerson.position, organization: newPerson.organization })
        .then(res => {
          if (res.data?.ok) {
            const created = res.data.record || res.data.people
            if (created && created.id) {
              store.dispatch('meeting/toggleMeetingMember', { member: created, meeting: { id: route.params.id } })
                .then(r => { if (r.data?.ok) { refreshParticipantTab(); showAddPersonForm.value = false; newPerson.countesy=null; newPerson.lastname=''; newPerson.firstname=''; newPerson.gender=1; newPerson.phone=''; newPerson.email=''; newPerson.position=null; newPerson.organization=null } })
            } else { refreshParticipantTab(); showAddPersonForm.value = false }
            message.success('បានបន្ថែម')
          }
        }).catch(() => { notify.error({ title:'កំហុស', description:'មានបញ្ហាក្នុងពេលរក្សាទុក' }) })
    }
    let searchTimer = null
    function onSearchInput() {
      if (searchTimer) clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        const q = inlineMemberSearch.value.trim()
        if (!q) { inlineSearchResults.value = []; return }
        store.dispatch('meetingPeople/list', { search: q, perPage: 20, page: 1 })
          .then(res => { inlineSearchResults.value = res.data?.records || [] })
          .catch(() => { inlineSearchResults.value = [] })
      }, 300)
    }
    function addMemberToMeeting(person) {
      store.dispatch('meeting/toggleMeetingMember', { member: person, meeting: { id: route.params.id } })
        .then(res => { if (res.data?.ok) { refreshParticipantTab(); inlineSearchResults.value = inlineSearchResults.value.filter(p => p.id !== person.id); inlineMemberSearch.value = ''; message.success('បានបន្ថែម') } })
        .catch(() => { notify.error({ title:'កំហុស', description:'បញ្ហាបន្ថែមសមាជិក' }) })
    }
    function removeMemberFromMeeting(lm) {
      if (!lm.member) return
      store.dispatch('meeting/toggleMeetingMember', { member: lm.member, meeting: { id: route.params.id } })
        .then(res => { if (res.data?.ok) { refreshParticipantTab(); message.success('បានលុប') } })
        .catch(() => { notify.error({ title:'កំហុស', description:'បញ្ហាលុបសមាជិក' }) })
    }
    function updateMemberGroupAndRole(lm) {
      store.dispatch('meeting/updateMemberGroupAndRole', { id: lm.id, role: lm.role, group: lm.group, meeting_id: parseInt(route.params.id), people_id: lm.member?.id, remark: lm.remark })
        .then(res => { if (res.data?.ok) { refreshParticipantTab() } })
        .catch(() => { notify.error({ title:'កំហុស', description:'បញ្ហាកែប្រែតួនាទី' }) })
    }
    const roleOptions = [
      { label: 'ប្រធាន', value: 'leader' },
      { label: 'អនុប្រធាន', value: 'deputy_leader' },
      { label: 'សមាជិក', value: 'member' },
    ]
    const groupOptions = [
      { label: 'អ្នកដឹកនាំប្រជុំ', value: 'lead_meeting' },
      { label: 'អ្នកការពារ', value: 'defender' },
      { label: 'អ្នកចូលរួម', value: 'audient' },
    ]
    function attendantValue(lm) {
      if (!lm.attendant) return 0
      return lm.attendant.people_id === lm.member?.id ? 1 : 2
    }
    function attendantLabel(lm) {
      if (!lm.attendant) return 'អវត្តមាន'
      if (lm.attendant.people_id === lm.member?.id) return 'មកផ្ទាល់'
      return 'ជំនួស'
    }
    function attendantType(lm) {
      if (!lm.attendant) return 'error'
      return lm.attendant.people_id === lm.member?.id ? 'success' : 'warning'
    }
    function attendantOptions(lm) {
      return [
        { label: 'អវត្តមាន', value: 0 },
        { label: 'មកផ្ទាល់', value: 1 },
        { label: 'មានអ្នកជំនួស', value: 2 },
      ]
    }
    function updateAttendant(lm, val) {
      const mmId = lm.meeting_member_id || lm.id
      store.dispatch('meeting/toggleMeetingMemberAttendant', { member_id: lm.member.id, meeting_member_id: mmId })
        .then(res => {
          if (res.data?.ok) {
            // Update local listMembers from response — no full page reload
            if (record.value && res.data.record?.list_members) {
              record.value.listMembers = res.data.record.list_members
            }
            message.success(val === 0 ? 'បានកំណត់អវត្តមាន' : 'បានកំណត់វត្តមាន')
          }
        }).catch(() => { notify.error({ title:'កំហុស', description:'បញ្ហាកំណត់វត្តមាន' }) })
    }

    function togglePublish(record) {
      store.dispatch('meeting/toggleActive', { id: record.id })
        .then(res => {
          if (res.data?.ok) {
            record.active = record.active ? 0 : 1
            message.success(record.active ? 'បានផ្សាយទៅកាន់ TV ហើយ' : 'បានឈប់ផ្សាយ')
          }
        }).catch(() => notify.error({ title:'កំហុស', description:'បញ្ហាក្នុងពេលផ្សាយ' }))
    }
    function formatDate(d){if(!d)return'មិនបានកំណត់';try{const dt=new Date(d);if(isNaN(dt.getTime()))return d;return dateFormat(dt,'dd-mm-yyyy')}catch(e){return d}}

    const meetingLeaders=computed(()=>{if(!record.value||!record.value.listMembers)return[];return record.value.listMembers.filter(lm=>lm.group==='lead_meeting'&&lm.role==='leader')})
    const roleLabels={leader:'ប្រធាន',deputy_leader:'អនុប្រធាន',member:'សមាជិក'}
    function roleLabel(r){return roleLabels[r]||r||'មិនបានកំណត់'}
    function roleClass(r){const c={leader:'bg-yellow-100 text-yellow-700',deputy_leader:'bg-blue-100 text-blue-700',member:' '};return c[r]||' '}
    const groupLabels={lead_meeting:'អ្នកដឹកនាំប្រជុំ',defender:'អ្នកការពារ',audient:'អ្នកចូលរួម'}
    function groupLabel(g){return groupLabels[g]||g||'មិនបានកំណត់'}
    function groupClass(g){const c={lead_meeting:'bg-indigo-100 text-indigo-700',defender:'bg-green-100 ',audient:' '};return c[g]||' '}

    // ─── Agenda ─────────────────────────────────────────────────────────
    const agendas=ref([]);const showAgendaForm=ref(false);const editingAgendaIndex=ref(null)
    const agendaForm=reactive({topic:'',start_time:'',duration:30,handlerIds:[]})
    const totalDuration=computed(()=>agendas.value.reduce((s,i)=>s+(parseInt(i.duration)||0),0))
    function formatDuration(m){const mins=parseInt(m)||0;const h=Math.floor(mins/60);const r=mins%60;if(h>0&&r>0)return`${h} ម៉ោង ${r} នាទី`;if(h>0)return`${h} ម៉ោង`;return`${r} នាទី`}
    const availableHandlers=computed(()=>{
      let list = []
      if(record.value&&record.value.listMembers) list = record.value.listMembers
      else if(record.value&&record.value.members) list = record.value.members
      if(!list||!list.length) return []
      return list.filter(m=>m.member||(m.firstname)).map(m=>{
        const member = m.member || m
        const n=(member.lastname||'')+' '+(member.firstname||'')
        return{label:n.trim()+' ('+groupLabel(m.group||'audient')+')',value:member.id,member,group:m.group||'audient'}
      })
    })
    function openAddAgenda(){editingAgendaIndex.value=null;agendaForm.topic='';agendaForm.start_time='';agendaForm.duration=30;agendaForm.handlerIds=[];showAgendaForm.value=true}
    function openEditAgenda(i){const item=agendas.value[i];if(!item)return;editingAgendaIndex.value=i;agendaForm.topic=item.topic||'';agendaForm.start_time=item.start_time||'';agendaForm.duration=item.duration||30;agendaForm.handlerIds=item.handlers?item.handlers.map(h=>h.id):[];showAgendaForm.value=true}
    function saveAgenda(){
      if(!agendaForm.topic||!agendaForm.start_time||!agendaForm.duration)return
      const handlers=agendaForm.handlerIds.map(id=>{const opt=availableHandlers.value.find(h=>h.value===id);return opt?{id:opt.value,name:opt.label.replace(/\s*\(.*\)\s*$/,''),role:groupLabel(opt.group)}:{id,name:'មិនស្គាល់',role:''}})
      const p={topic:agendaForm.topic.trim(),start_time:agendaForm.start_time,duration:parseInt(agendaForm.duration),handlers}
      if(editingAgendaIndex.value!==null){agendas.value[editingAgendaIndex.value]={...agendas.value[editingAgendaIndex.value],...p}
      }else{agendas.value.push({id:Date.now(),...p});agendas.value.sort((a,b)=>(a.start_time||'').localeCompare(b.start_time||''))}
      showAgendaForm.value=false
      persistAgendas()
    }
    function removeAgenda(i){
      agendas.value.splice(i,1)
      persistAgendas()
    }
    function persistAgendas(){
      const mid=route.params.id
      if(useMockData.value||!mid)return
      const items=agendas.value.map((a,i)=>({
        topic:a.topic,
        start_time:a.start_time,
        duration_minutes:parseInt(a.duration)||0,
        presenter_id:a.handlers&&a.handlers.length>0?a.handlers[0].id:null,
      }))
      store.dispatch('meeting/agendaSave',{meeting_id:parseInt(mid),items})
    }
    function hydrateAgendas(){
      const mid=route.params.id
      if(!useMockData.value&&mid){
        store.dispatch('meeting/agendaList',{meeting_id:mid,perPage:50}).then(res=>{
          if(res.data&&res.data.ok&&res.data.records){
            agendas.value=res.data.records.map(r=>({id:r.id,topic:r.topic,start_time:r.start_time,duration:r.duration_minutes,handlers:r.presenter?[{id:r.presenter.id,name:(r.presenter.lastname||'')+' '+(r.presenter.firstname||''),role:''}]:[]}))
          }else{agendas.value=[]}
        }).catch(()=>{agendas.value=[]})
      }else if(record.value&&record.value.agendas&&Array.isArray(record.value.agendas)){
        agendas.value=[...record.value.agendas].sort((a,b)=>(a.start_time||'').localeCompare(b.start_time||''))
      }else{agendas.value=[]}
    }

    // ─── Seating (Dynamic from room seats + real assignments) ──────────
    const roomSeats = ref([])
    const seatLoading = ref(false)
    const seatAssignments = ref([])
    const showSeatPicker = ref(false)
    const selectedSeat = ref(null)
    const memberSearchQuery = ref('')
    const availableMembers = ref([])
    const showPrintPreview = ref(false)
    const filteredAvailableMembers = computed(() => {
      const q = memberSearchQuery.value.trim().toLowerCase()
      if (!q) return availableMembers.value
      return availableMembers.value.filter(m =>
        (m.full_name || '').toLowerCase().includes(q) ||
        (m.position || '').toLowerCase().includes(q) ||
        (m.organization || '').toLowerCase().includes(q)
      )
    })

    function getMockRoomSeats() {
      // Generate seats matching mock listMembers seat numbers (1-12)
      const seats = []
      // Head table: seats 1,2 (leader, deputy_leader) — seat_number strings
      for (let c = 1; c <= 4; c++) {
        seats.push({ id: 1000 + c, seat_number: String(c), label: c === 1 ? 'ប្រធាន' : 'អនុប្រធាន', row_number: 1, column_number: c, seat_type: 'head_table' })
      }
      // Side rows: seats 5-12
      for (let r = 1; r <= 2; r++) {
        for (let c = 1; c <= 4; c++) {
          const num = 4 + (r - 1) * 4 + c
          seats.push({ id: 2000 + num, seat_number: String(num), label: 'កៅអី', row_number: r + 1, column_number: c, seat_type: 'side_row' })
        }
      }
      return seats
    }

    async function fetchRoomSeats() {
      const roomId = record.value?.rooms?.[0]?.id
      if (!roomId || useMockData.value) {
        roomSeats.value = getMockRoomSeats()
        await fetchSeatAssignments()
        return
      }
      seatLoading.value = true
      try {
        const res = await store.dispatch('meetingRoomSeat/list', { room_id: roomId, perPage: 200 })
        if (res.data?.ok) {
          roomSeats.value = Array.isArray(res.data.records) ? res.data.records : (res.data.records?.data || [])
        }
        await fetchSeatAssignments()
      } catch (e) {
        console.error('Failed to fetch room seats:', e)
        roomSeats.value = getMockRoomSeats()
        await fetchSeatAssignments()
      } finally {
        seatLoading.value = false
      }
    }

    function enrichSeat(seat) {
      const assignment = seatAssignments.value.find(a => a.room_seat_id === seat.id)
      if (assignment && assignment.member) {
        // console.log( assignment )
        const m = assignment.member
        return {
          ...seat,
          occupied: true,
          member : m ,
          assignment_id: assignment.id,
          people_id: m.people_id,
          full_name: m.full_name || '',
          photo_url: m.photo_url || null,
          position: m.position || '',
          organization: m.organization || '',
          role: m.role || '',
          group: m.group || '',
        }
      }
      return { ...seat, occupied: false, assignment_id: null, people_id: null, full_name: '', photo_url: null, position: '', organization: '', role: '', group: '' }
    }

    async function fetchSeatAssignments() {
      const mid = route.params.id
      if (!mid) return
      try {
        const res = await store.dispatch('meetingSeatAssignment/list', { meeting_id: mid })
        if (res.data?.ok) {
          seatAssignments.value = res.data.records || []
          applySeatsToListMembers()
        }
      } catch (e) {
        console.error('Failed to fetch seat assignments:', e)
        seatAssignments.value = []
      }
    }

    function applySeatsToListMembers() {
      if (!record.value) return
      const list = record.value.listMembers
      if (!list || !list.length) return
      const roomSeatMap = {}
      roomSeats.value.forEach(rs => { roomSeatMap[rs.id] = rs.seat_number })
      list.forEach(m => {
        // Reset seat for all members first (handles unassign correctly)
        m.seat = null
        m.room_seat_id = null
        // Find assignment by meeting_member_id (API returns it as m.id on raw data)
        const mmId = m.meeting_member_id || m.id
        const assignment = seatAssignments.value.find(a => {
          return a.meeting_member_id === mmId
        })
        if (assignment) {
          m.seat = roomSeatMap[assignment.room_seat_id] || assignment.room_seat_id
          m.room_seat_id = assignment.room_seat_id
          // m = assignment
        }
      })
    }

    function handleSeatClick(seat) {
      if (seat.occupied) {
        // First unassign the current occupant, then open picker
        if (seat.assignment_id) {
          store.dispatch('meetingSeatAssignment/unassign', { id: seat.assignment_id }).then(() => {
            fetchSeatAssignments()
            selectedSeat.value = seat
            memberSearchQuery.value = ''
            fetchAvailableMembers()
            showSeatPicker.value = true
          })
        }
      } else {
        // Show picker for available members
        selectedSeat.value = seat
        memberSearchQuery.value = ''
        fetchAvailableMembers()
        showSeatPicker.value = true
      }
    }

    async function fetchAvailableMembers() {
      const mid = route.params.id
      if (!mid) return
      try {
        const res = await store.dispatch('meetingSeatAssignment/availableMembers', { meeting_id: mid })
        if (res.data?.ok) {
          availableMembers.value = res.data.records || []
        }
      } catch (e) {
        console.error('Failed to fetch available members:', e)
        availableMembers.value = []
      }
    }

    function assignMemberToSeat(member) {
      if (!selectedSeat.value || !member) return
      const mid = parseInt(route.params.id)
      store.dispatch('meetingSeatAssignment/assign', {
        meeting_id: mid,
        room_seat_id: selectedSeat.value.id,
        meeting_member_id: member.id,
      }).then(() => {
        showSeatPicker.value = false
        selectedSeat.value = null
        fetchSeatAssignments()
      }).catch(e => {
        console.error('Failed to assign seat:', e)
      })
    }

    // ─── Name cards for print ───────────────────────────────────────────
    const nameCardItems = computed(() => {
      const items = []
      // Collect all occupied seats with member info
      const allSeats = [...headTableSeats.value, ...leftSideSeats.value, ...rightSideSeats.value, ...audienceSeats.value]
      allSeats.forEach(s => {
        if (s.occupied && s.full_name) {
          console.log( s )
          items.push({
            member: s.member ,
            seat_id: s.id,
            seat_number: s.seat_number,
            name: s.full_name,
            countesy: s.countesy,
            firstname: s.firstname, 
            lastname: s.lastname ,
            position: s.position || '',
            organization: s.organization || '',
            organization_logo: s.organization_logo || null,
            role: s.role || '',
            group: s.group || '',
            seat_type: s.seat_type,
          })
        }
      })
      // Sort by role priority: leader first, then deputy_leader, then member, then rest
      const roleOrder = { leader: 0, deputy_leader: 1, member: 2 }
      items.sort((a, b) => (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99) || (a.seat_number || '').localeCompare(b.seat_number || ''))
      return items
    })

    const groupedNameCards = computed(() => {
      const groups = [
        { key: 'leader', label: 'ប្រធាន', items: [] },
        { key: 'deputy_leader', label: 'អនុប្រធាន', items: [] },
        { key: 'member', label: 'សមាជិក', items: [] },
        { key: 'other', label: 'ផ្សេងៗ', items: [] },
      ]
      nameCardItems.value.forEach(item => {
        const g = groups.find(g => g.key === item.role)
        if (g) g.items.push(item)
        else groups.find(g => g.key === 'other').items.push(item)
      })
      return groups.filter(g => g.items.length > 0)
    })

    function handlePrint() {
      window.print()
    }

    const headTableSeats = computed(() => {
      console.log(roomSeats.value)
      return roomSeats.value
        .filter(s => s.seat_type === 'head_table')
        .sort((a, b) => (a.column_number || 0) - (b.column_number || 0))
        .map(s => enrichSeat(s))
    })

    const sideSeats = computed(() =>
      roomSeats.value.filter(s => s.seat_type === 'side_row')
    )

    // Split side seats into left/right by column position within each row
    function splitSideSeats(side) {
      const rows = {}
      sideSeats.value.forEach(s => {
        const r = s.row_number || 1
        if (!rows[r]) rows[r] = []
        rows[r].push(s)
      })
      const result = []
      Object.entries(rows).forEach(([r, seats]) => {
        seats.sort((a, b) => (a.column_number || 0) - (b.column_number || 0))
        const mid = Math.ceil(seats.length / 2)
        const slice = side === 'left' ? seats.slice(0, mid) : seats.slice(mid)
        slice.forEach(s => result.push(enrichSeat(s)))
      })
      return result
    }

    const leftSideSeats = computed(() => splitSideSeats('left'))
    const rightSideSeats = computed(() => splitSideSeats('right'))

    const audienceSeats = computed(() =>
      roomSeats.value
        .filter(s => s.seat_type === 'audience')
        .sort((a, b) => (a.row_number || 0) - (b.row_number || 0) || (a.column_number || 0) - (b.column_number || 0))
        .map(s => enrichSeat(s))
    )

    const audienceCols = computed(() => {
      const cols = audienceSeats.value.map(s => s.column_number || 1)
      return cols.length > 0 ? Math.max(...cols) : 4
    })

    function seatColorClass(role){if(role==='leader')return'bg-yellow-100 border-yellow-500 text-yellow-700';if(role==='deputy_leader')return'bg-blue-100 border-blue-400 text-blue-700';return'bg-green-100 border-green-400 '}
    function seatBadgeClass(lm){if(!lm)return' text-gray-400';if(lm.role==='leader')return' text-yellow-700 border border-yellow-300';if(lm.role==='deputy_leader')return'text-blue-700 border border-blue-300';return' border border-green-300'}
    function roleBorderClass(role){if(role==='leader')return'border-yellow-400';if(role==='deputy_leader')return'border-blue-400';return'border-green-400'}
    function roleRingClass(role){if(role==='leader')return'ring-yellow-300';if(role==='deputy_leader')return'ring-blue-300';return'ring-green-300'}
    function roleTextClass(role){if(role==='leader')return'text-yellow-700';if(role==='deputy_leader')return'text-blue-700';return''}
    function roleBadgeClass(role){if(role==='leader')return'bg-yellow-100 text-yellow-700';if(role==='deputy_leader')return'bg-blue-100 text-blue-700';return'bg-green-100 '}

    // ─── References (5 document types) ─────────────────────────────────
    const docSections=reactive({
      ministerPreeng:{files:[],pdfSrc:null},
      seichdeyPreeng:{files:[],pdfSrc:null},
      techReports:{files:[],pdfSrc:null},
      reports:{files:[],pdfSrc:null},
      otherDocuments:{files:[],pdfSrc:null}
    })
    const activeKey=ref(null)
    const activeIdx=ref(null)
    const activePdfSrc=computed(()=>{
      if(!activeKey.value) return null
      return docSections[activeKey.value]?.pdfSrc||null
    })
    function hydrateReferences(){
      if(!record.value) return
      const parse=arr=>Array.isArray(arr)?arr.filter(f=>f&&typeof f==='object'&&f.serial):[]
      docSections.ministerPreeng.files = parse(record.value.minister_preeng)
      docSections.seichdeyPreeng.files = parse(record.value.seichdey_preeng)
      docSections.techReports.files = parse(record.value.tech_reports)
      docSections.reports.files = parse(record.value.reports)
      docSections.otherDocuments.files = parse(record.value.other_documents)
    }
    function selectDoc(key,index){
      activeKey.value=key;activeIdx.value=index
      const f=docSections[key].files[index]
      if(!f||!f.serial) return
      const mid=route.params.id;if(!mid)return
      ;(async ()=>{
        try {
          const res=await store.dispatch('meeting/readDocPdf',{key,id:mid,serial:f.serial})
          if(res.data?.ok&&res.data.pdf) docSections[key].pdfSrc=res.data.pdf
        }catch(e){console.error(e);notify.error({title:'អានឯកសារ',description:'មានបញ្ហាក្នុងពេលអានឯកសារ។',duration:3000})}
      })()
    }
    async function uploadDoc(key,{file,onFinish,onError}){
      const mid=route.params.id
      if(!mid) return
      const fd=new FormData();fd.append('id',mid);fd.append('files[]',file.file)
      try {
        await store.dispatch('meeting/uploadDoc',{key,formData:fd})
        notify.success({title:'ផ្ទុកឯកសារ',description:'បានផ្ទុកឯកសារដោយជោគជ័យ។',duration:3000})
        if(onFinish) onFinish()
        const res=await store.dispatch('meeting/read',{id:mid})
        if(res.data?.record){record.value=res.data.record;hydrateReferences()}
      }catch(e){
        console.error(e)
        if(onError) onError()
        notify.error({title:'ផ្ទុកឯកសារ',description:'មានបញ្ហាក្នុងពេលផ្ទុកឯកសារ។',duration:3000})
      }
    }
    async function removeDoc(key,index){
      const f=docSections[key].files[index]
      if(!f||!f.serial) return
      const mid=route.params.id
      try {
        await store.dispatch('meeting/removeDoc',{key,id:mid,serial:f.serial})
        docSections[key].files.splice(index,1)
        if(activeKey.value===key&&activeIdx.value===index){activeKey.value=null;activeIdx.value=null;docSections[key].pdfSrc=null}
        else if(activeKey.value===key&&activeIdx.value>index){activeIdx.value--}
        notify.success({title:'លុបឯកសារ',description:'បានលុបឯកសារដោយជោគជ័យ។',duration:3000})
      }catch(e){console.error(e);notify.error({title:'លុបឯកសារ',description:'មានបញ្ហាក្នុងពេលលុបឯកសារ។',duration:3000})}
    }

    // ─── Legal Draft (single draft per meeting) ──────────────────────────
    const legalDraft=ref(null)
    const meetingNotStarted=computed(()=>record.value&&record.value.status===1)
    function hydrateDraft(){legalDraft.value=getMockDraft()}

    // ─── Checklist ────────────────────────────────────────────────────────
    const preChecklist=ref([]);const postChecklist=ref([])
    const preCheckDoneCount=computed(()=>preChecklist.value.filter(i=>i.is_checked).length)
    const postCheckDoneCount=computed(()=>postChecklist.value.filter(i=>i.is_checked).length)
    const preCheckAllDone=computed(()=>preChecklist.value.length>0&&preCheckDoneCount.value===preChecklist.value.length)
    const postCheckAllDone=computed(()=>postChecklist.value.length>0&&postCheckDoneCount.value===postChecklist.value.length)
    async function toggleCheck(item){
      item.is_checked=!item.is_checked;item.checked_at=item.is_checked?new Date().toLocaleTimeString('km-KH',{hour:'2-digit',minute:'2-digit'}):null
      try { await store.dispatch('meeting/toggleChecklist', { id: item.id }) } catch(e) { console.error(e) }
    }
    async function toggleEquipStatus(item){
      item.equipment_status = item.equipment_status === 'working' ? 'failed' : 'working'
      try { await store.dispatch('meeting/toggleChecklistEquipmentStatus', { id: item.id }) } catch(e) { console.error(e) }
    }
    async function fetchChecklists(){
      const mid = route.params.id
      if(!mid) { preChecklist.value = []; postChecklist.value = []; return }
      try {
        console.log( record.value )
        const roomId = record.value?.rooms?.[0]?.id || 0
        const res = await store.dispatch('meeting/fetchChecklists', { meeting_id: mid, room_id: roomId })
        if(res.data?.ok) {
          preChecklist.value = (res.data.pre_meeting || []).map(item => ({ ...item, equipment_status: item.equipment_status || 'working' }));
          postChecklist.value = (res.data.post_meeting || []).map(item => ({ ...item, equipment_status: item.equipment_status || 'working' }));
        }
      } catch(e) {
        console.error(e)
        // Fallback to mock only on error
        preChecklist.value = getMockPreChecklist(); postChecklist.value = getMockPostChecklist()
      }
    }
    function hydrateChecklists(){ fetchChecklists() }
    function getMockPreChecklist(){return[
      {id:1,item_name:'ម៉ាស៊ីនបញ្ចាំង',equipment_status:'working',is_checked:true,checked_at:'08:45'},
      {id:2,item_name:'មីក្រូហ្វូនឥតខ្សែ',equipment_status:'working',is_checked:true,checked_at:'08:45'},
      {id:3,item_name:'ប្រព័ន្ធសំឡេង',equipment_status:'working',is_checked:true,checked_at:'08:46'},
      {id:4,item_name:'កុំព្យូទ័រ',equipment_status:'working',is_checked:true,checked_at:'08:47'},
      {id:5,item_name:'អេក្រង់ LCD',equipment_status:'failed',is_checked:true,checked_at:'08:45'},
      {id:6,item_name:'ម៉ាស៊ីនបោះពុម្ព',equipment_status:'working',is_checked:false,checked_at:null},
      {id:7,item_name:'ក្ដារខៀន',equipment_status:'working',is_checked:true,checked_at:'08:48'},
      {id:8,item_name:'ម៉ាស៊ីនត្រជាក់',equipment_status:'working',is_checked:true,checked_at:'08:50'},
      {id:9,item_name:'ទឹក និងកែវ',equipment_status:'working',is_checked:true,checked_at:'08:50'}
    ]}
    function getMockPostChecklist(){return[
      {id:10,item_name:'ម៉ាស៊ីនបញ្ចាំង',equipment_status:'working',is_checked:false,checked_at:null},
      {id:11,item_name:'មីក្រូហ្វូន',equipment_status:'working',is_checked:false,checked_at:null},
      {id:12,item_name:'កុំព្យូទ័រ',equipment_status:'working',is_checked:false,checked_at:null},
      {id:13,item_name:'អេក្រង់ LCD',equipment_status:'failed',is_checked:false,checked_at:null},
      {id:14,item_name:'ក្ដារខៀន',equipment_status:'working',is_checked:false,checked_at:null},
      {id:15,item_name:'បន្ទប់',equipment_status:'working',is_checked:false,checked_at:null},
      {id:16,item_name:'ម៉ាស៊ីនត្រជាក់',equipment_status:'working',is_checked:false,checked_at:null}
    ]}

    // ─── Refresh participant tab only (no loading spinner, no full reload) ─
    function refreshParticipantTab() {
      const mid = route.params.id
      if (!mid) return
      store.dispatch('meeting/read', { id: mid }).then(res => {
        if (res.data && res.data.record) {
          const r = res.data.record
          if (r.members && Array.isArray(r.members)) {
            r.listMembers = r.members.map(m => ({
              id: m.id,
              meeting_member_id: m.meeting_member_id || null,
              member: {
                id: m.id,
                lastname: m.lastname || '',
                firstname: m.firstname || '',
                email: m.email || '',
                mobile_phone: m.mobile_phone || '',
                position: m.position && m.position.name ? m.position.name : (typeof m.position === 'string' ? m.position : ''),
                organization: m.organization && m.organization.name ? m.organization.name : (typeof m.organization === 'string' ? m.organization : ''),
                gender: m.gender || '',
              },
              role: m.role || 'member',
              group: m.group || 'audient',
              seat: null,
              attendant: m.attendant || null,
            }))
          }
          record.value = r
          fetchRoomSeats()
        }
      })
    }

    // ─── Fetch ──────────────────────────────────────────────────────────
    function fetchMeeting(){
      const mid=route.params.id
      if(useMockData.value||!mid){record.value=getMockRecord();hydrateAgendas();hydrateReferences();hydrateDraft();hydrateChecklists();fetchRoomSeats();loading.value=false;return}
      loading.value=true;error.value=false
      store.dispatch('meeting/read',{id:mid}).then(res=>{
        if(res.data&&res.data.record){
          const r=res.data.record
          // Map API 'members' → frontend 'listMembers' format
          if(r.members&&Array.isArray(r.members)){
            r.listMembers=r.members.map(m=>({
              id:m.id,
              meeting_member_id: m.meeting_member_id || null,
              member:{
                id:m.id,
                lastname:m.lastname||'',
                firstname: m.firstname || '',
                email: m.email || '',
                mobile_phone: m.mobile_phone || '',
                position: m.position && m.position.name ? m.position.name : (typeof m.position === 'string' ? m.position : ''),
                organization: m.organization && m.organization.name ? m.organization.name : (typeof m.organization === 'string' ? m.organization : ''),
                gender:m.gender||'',
              },
              role:m.role||'member',
              group:m.group||'audient',
              seat:null,
              attendant:m.attendant||null,
            }))
          }
          record.value=r
        }else{record.value=getMockRecord()}
        hydrateAgendas();hydrateReferences();hydrateDraft();hydrateChecklists();fetchRoomSeats();loading.value=false
      }).catch(err=>{console.error(err);notify.error({title:'អានទិន្នន័យ',description:'មានបញ្ហាក្នុងពេលអានទិន្នន័យកិច្ចប្រជុំ។',duration:3000});record.value=getMockRecord();hydrateAgendas();hydrateReferences();hydrateDraft();hydrateChecklists();fetchRoomSeats();error.value=false;loading.value=false})
    }
    onMounted(()=>{fetchMeeting()})
    watch(()=>route.params.id,()=>{fetchMeeting()})

    return{record,loading,error,togglePublish,formatDate,meetingLeaders,roleLabel,roleClass,groupLabel,groupClass,
      showEditModal, closeEditModal,
      agendas,showAgendaForm,editingAgendaIndex,agendaForm,totalDuration,formatDuration,availableHandlers,openAddAgenda,openEditAgenda,saveAgenda,removeAgenda,
      roomSeats,seatLoading,headTableSeats,leftSideSeats,rightSideSeats,audienceSeats,audienceCols,seatColorClass,seatBadgeClass,roleBorderClass,roleRingClass,roleTextClass,roleBadgeClass,
      showSeatPicker,memberSearchQuery,filteredAvailableMembers,handleSeatClick,assignMemberToSeat,roleLabel,memberPanelWidth,startResizePanel,inlineMemberSearch,inlineSearchResults,newPerson,showAddPersonForm,countesyOptions,positionOptions,organizationOptions,saveNewPerson,loadFormOptions,toggleAddForm,onSearchInput,refreshParticipantTab,addMemberToMeeting,removeMemberFromMeeting,updateMemberGroupAndRole,roleOptions,groupOptions,attendantValue,attendantLabel,attendantType,attendantOptions,updateAttendant,
      showPrintPreview,nameCardItems,groupedNameCards,handlePrint,
      legalDraft,meetingNotStarted,
      preChecklist,postChecklist,preCheckDoneCount,postCheckDoneCount,preCheckAllDone,postCheckAllDone,toggleCheck,toggleEquipStatus,
      docSections,selectDoc,uploadDoc,removeDoc,activeKey,activeIdx,activePdfSrc}
  }
}
</script>

<style>
@media print {
  body * {
    visibility: hidden !important;
  }
  #name-card-print-area,
  #name-card-print-area * {
    visibility: visible !important;
  }
  #name-card-print-area {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 210mm !important;
    min-height: 297mm !important;
    padding: 8mm 10mm !important;
    margin: 0 !important;
    background: white !important;
    z-index: 999999 !important;
    overflow: visible !important;
  }
  .print-hide {
    display: none !important;
  }
  .print-only-preview {
    display: none !important;
  }
  @page {
    size: A4;
    margin: 0;
  }
}
.name-card-print-area {
  font-family: "Khmer OS Siemreap", Siemreap, "Kantumruy Pro", "Segoe UI", sans-serif;
}
.print-group-header {
  font-family: "Khmer OS Siemreap", serif;
  font-size: 11pt;
  font-weight: bold;
  color: #1a1a2e;
  margin-bottom: 3mm;
  margin-top: 5mm;
  padding-bottom: 1mm;
  border-bottom: 1px solid #ccc;
}
.name-card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4mm;
  margin-bottom: 4mm;
}
.name-card {
  position: relative;
  border-radius: 2mm;
  padding: 4mm 3mm;
  display: flex;
  align-items: center;
  gap: 3mm;
  page-break-inside: avoid;
  background: white;
  border: 1px solid #ddd;
  height: 55mm;
  width: auto;
  min-width: 0;
  overflow: hidden;
}
.name-card-seat {
  position: absolute;
  right: 2mm;
  top: 2mm;
  padding: 1px 5px;
  border-radius: 3px;
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7pt;
  font-weight: bold;
}
.name-card-logo-col {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.name-card-logo {
  width: 28mm;
  height: 28mm;
}
.name-card-info-col {
  flex: 2;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 2mm 0;
}
.name-card-info-col.full-width {
  flex: 1;
}
.name-card-name {
  font-size: 16pt;
  font-weight: bold;
  color: #000;
  line-height: 1.3;
  word-wrap: break-word;
  text-align: center;
}
.name-card-bottom {
  text-align: center;
}
.name-card-position {
  font-size: 10pt;
  color: #000;
  line-height: 1.3;
}
.name-card-org {
  font-size: 10pt;
  color: #000;
  line-height: 1.3;
}
</style>

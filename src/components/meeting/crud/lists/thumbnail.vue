<template>
  <div class="relative">
    <!-- Top bar -->
    <div class="flex title-bar border-b border-gray-200 h-10">
      <div class="flex w-64 h-8 title">
        <svg class="flex-none w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/></svg>
        <div class="font-moul ml-2 h-8 leading-9">កិច្ចប្រជុំ</div>
      </div>
      <div class="flex-grow flex flex-row-reverse gap-2">
        <n-button type="success" size="small" @click="showCreateModal">
          <template #icon>+</template> បន្ថែម
        </n-button>
        <div class="w-2/5 relative h-8">
          <input type="text" @keypress.enter="fetchRooms(false)" v-model="search"
            class="px-2 h-8 w-full rounded border border-gray-200 focus:border-blue-600"
            placeholder="ស្វែងរក" />
        </div>
        
        <!-- <n-button size="tiny" quaternary @click="$router.push('/meetings/schedule')" class="!p-1">
          <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
        </n-button> -->
        <div class="w-36 relative h-8">
          <n-select
            v-model:value="selectedStatuses"
            :options="headerStatusOptions"
            placeholder="ស្ថានភាព"
            size="small"
            clearable
            @update:value="onHeaderStatusChange"
          />
        </div>
        <n-button size="tiny" quaternary @click="openTvSchedule" class="!p-1">
          <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </n-button>
      </div>
    </div>
    <!-- Table of crud -->
    <div class="fixed left-0 top-4 right-0 bottom-12 vcb-table-panel">
      <!-- <div class="vcb-meeting-timestamp flex flex-wrap justify-center items-center w-full mb-8 bg-white border border-gray-200 p-2" > -->
      <!-- <div class="p-1 px-4 rounded shadow-sm m-1 cursor-pointer duration-300 hover:border-yellow-300 hover:text-yellow-800 border border-gray-200" >១ ខែមុន</div>
        <div class="p-1 px-4 rounded shadow-sm m-1 cursor-pointer duration-300 hover:border-yellow-300 hover:text-yellow-800 border border-gray-200" >១ សប្ដាហ៍មុន</div>
        <div class="p-1 px-4 rounded shadow-sm m-1 cursor-pointer duration-300 hover:border-yellow-300 hover:text-yellow-800 border border-gray-200" >ថ្ងៃនេះ</div>
        <div class="p-1 px-4 rounded shadow-sm m-1 cursor-pointer duration-300 hover:border-yellow-300 hover:text-yellow-800 border border-gray-200" >១ សប្ដាហ៍បន្ទាប់</div>
        <div class="p-1 px-4 rounded shadow-sm m-1 cursor-pointer duration-300 hover:border-yellow-300 hover:text-yellow-800 border border-gray-200" >១ ខែបន្ទាប់</div> -->
      <!-- Status filter dropdown list-->
      <!-- <div class="item" >
          <n-select 
            @update:value="updateStatus"
            placeholder="ស្ថានភាពកិច្ចប្រជុំ"
            :options="statuses" 
            multiple
          >
          </n-select>
        </div> -->
      <!-- Type filter dropdown list-->
      <!-- <div class="item" >
          <n-select 
            @update:value="updateType"
            placeholder="ប្រភេទកិច្ចប្រជុំ"
            :options="types"
            multiple
          >
          </n-select>
        </div> -->
      <!-- Organization filter dropdown list-->
      <!-- <div class="item" >
          <n-select 
            @update:value="updateOrganization"
            placeholder="ក្រសួង ស្ថាប័ន"
            :options="organizations"
            multiple
            filterable
          >
          </n-select>
        </div> -->
      <!-- Meeting member filter dropdown list-->
      <!-- <div class="item" >
          <n-select 
            @update:value="updatePeople"
            placeholder="សមាសភាពអង្គប្រជុំ"
            :options="people"
            multiple
            filterable
          >
          </n-select>
        </div> -->
      <!-- Meeting room filter dropdown list-->
      <!-- <div class="item" >
          <n-select 
            @update:value="updateRoom"
            placeholder="សាលប្រជុំ"
            :options="rooms"
            multiple
            filterable
          >
          </n-select>
        </div> -->
      <!-- Type filter dropdown list-->
      <!-- <div class="item" >
          <n-date-picker 
          clearable
          v-model:value="selectedDate" 
          @update:value="updateDate" 
          placeholder="បរិច្ឆែទប្រជុំ"
          type="date" />
        </div> -->
      <!-- </div> -->
      <!-- <Transition name="slide-fade">
        <div
          v-if="viewMode==='grid' && Array.isArray(records) && records.length > 0"
          class="vcb-thumbnail mb-24"
        >
          <div v-for="(record, index) in records" :key="index" class="item">
            <div class="content">
              <router-link :to="'/meetings/' + record.id" class="block">
                <div
                  v-if="
                    record.image != false &&
                    record.image != null &&
                    record.image != undefined
                  "
                  class="image-stick-top-left bg-80% bg-cover bg-center bg-no-repeat"
                  :style="'background-image: url(' + record.image + ');'"
                ></div>
                <div
                  v-if="
                    record.image == false ||
                    record.image == null ||
                    record.image == undefined
                  "
                  class="image-stick-top-left bg-contain bg-center bg-no-repeat"
                  :style="'background-image: url(' + orgLogoUrl + ');'"
                ></div>
                <div class="flex flex-wrap my-2">
                  <div class="w-full py-2">
                    <div
                      class="w-full text-left leading-6 my-2 text-md font-sr"
                    >
                      <pre
                        class="w-full text-left leading-6 my-2 text-md font-sr text-wrap"
                        >{{ applyTagMark(record.objective) }}</pre
                      >
                    </div>
                    <div class="w-full flex my-1">
                      <div
                        class="w-1/2 text-left text-gray-600 leading-4 font-sr text-xxs"
                      >
                        {{ record.type != undefined ? record.type.name : "" }}
                      </div>
                      <div
                        class="w-1/2 text-right text-gray-600 leading-6 font-sr text-xxs"
                        v-html="
                          record.organizations != undefined &&
                          record.organizations.length > 0
                            ? record.organizations
                                .map((o) => o.name)
                                .join('<br/>')
                            : ''
                        "
                      ></div>
                    </div>
                    <div class="w-full flex my-1">
                      <div class="w-1/2">
                        <div
                          v-for="(lm, index) in getListMembersLeaders(record)"
                          :key="index"
                          class="text-left text-gray-600 leading-4 font-sr text-xxs mb-2"
                          v-html="
                            lm.member.officers
                              .map(
                                (o) =>
                                  // ( o.organization != undefined ? o.organization.name : '' ) + '<br/>' + ( o.position != undefined ? o.position.name : '' ) + '<br/>' +
                                  (o.countesy != undefined
                                    ? o.countesy.name
                                    : '') +
                                  ' ' +
                                  lm.member.lastname +
                                  ' ' +
                                  lm.member.firstname,
                              )
                              .join(' ')
                          "
                        ></div>
                      </div>
                      <div
                        class="w-1/2 text-right text-gray-600 leading-4 font-sr text-xxs"
                      >
                        <div
                          v-for="(member, index) in getListMembersDefenders(
                            record,
                          )"
                          :key="index"
                          class="text-left text-gray-600 leading-4 font-sr text-xxs mb-2"
                          v-html="
                            member.officers
                              .map(
                                (o) =>
                                  // ( o.organization != undefined ? o.organization.name : '' ) + '<br/>' + ( o.position != undefined ? o.position.name : '' ) + '<br/>' +
                                  (o.countesy != undefined
                                    ? o.countesy.name
                                    : '') +
                                  ' ' +
                                  member.lastname +
                                  ' ' +
                                  member.firstname,
                              )
                              .join(' ')
                          "
                        ></div>
                      </div>
                    </div>
                    <div class="w-full flex my-1">
                      <div
                        class="w-1/2 text-left text-gray-600 leading-4 font-sr text-xxs"
                      >
                        {{
                          Array.isArray(record.rooms) && record.rooms.length > 0
                            ? record.rooms.map((o) => o.name).join(" , ")
                            : ""
                        }}
                      </div>
                      <div
                        class="w-1/2 text-right text-gray-600 leading-4 font-sr text-xxs"
                      ></div>
                    </div>
                    <div class="w-full flex my-1">
                      <div
                        class="w-1/2 text-left text-gray-600 leading-4 font-sr text-xxs"
                      >
                        {{
                          $toKhmer(
                            dateFormat(new Date(record.date), "dd-mm-yyyy"),
                          )
                        }}
                      </div>
                      <div
                        class="w-1/2 text-right text-gray-600 leading-4 font-sr text-xxs"
                      ></div>
                    </div>
                    <div class="w-full flex my-1">
                      <div
                        class="w-1/2 text-left text-gray-600 leading-4 font-sr text-xxs"
                      >
                        {{ $toKhmer(record.start + " - " + record.end) }}
                      </div>
                    </div>
                  </div>
                </div>
              </router-link>
              <thumbnail-actions-form
                v-if="crud != null"
                v-bind:crud="crud"
                v-bind:model="model"
                v-bind:record="record"
                :onClose="closeActions"
              />
            </div>
          </div>
        </div>
      </Transition> -->
      <!-- Horizontal full-width layout -->
      <Transition name="slide-fade">
        <!-- v-if="viewMode==='horizontal' && Array.isArray(records) && records.length > 0" -->
        <div
          v-if="Array.isArray(records) && records.length > 0"
          class="vcb-horizontal mb-24 px-2"
        >
          <div v-for="(record, index) in records" :key="'h'+index" class="item-h bg-card rounded-lg border border-default p-4 relative">
            <!-- Status badge top-right -->
            <div v-if="record.status"
              class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xxs font-bold border z-10"
              :class="getStatusBadgeClass(record.status)">
              {{ getStatusLabel(record.status) }}
            </div>
            <router-link :to="'/meetings/' + record.id" class="block">
              <div class="content-h">
                <!-- Line 1: Objective (full width, bold, big, gray) -->
                <div class="w-full mb-2 text-left">
                  <pre class="font-bold text-base text-wrap leading-6" v-html="applyTagMark(record.objective)"></pre>
                </div>
                <!-- Line 2: All info inline -->
                <div class="w-full flex flex-wrap items-center gap-x-4 gap-y-1 text-xxs ">
                  <span class="flex items-center">
                    <svg class="w-3.5 h-3.5 mr-1 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M17.75 3A3.25 3.25 0 0 1 21 6.25v11.5A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V6.25A3.25 3.25 0 0 1 6.25 3h11.5zm0 1.5H6.25A1.75 1.75 0 0 0 4.5 6.25v11.5c0 .966.784 1.75 1.75 1.75h11.5a1.75 1.75 0 0 0 1.75-1.75V6.25a1.75 1.75 0 0 0-1.75-1.75zM7.75 7a.75.75 0 0 1 .75.75V9.5h7V7.75a.75.75 0 0 1 1.5 0V9.5h.75c.966 0 1.75.784 1.75 1.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.25.25 0 0 0-.25-.25h-.75v.75a.75.75 0 0 1-1.5 0v-.75h-7v.75a.75.75 0 0 1-1.5 0v-.75H7.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h4a.75.75 0 0 1 0 1.5h-4A1.75 1.75 0 0 1 5.5 18.75v-7.5c0-.966.784-1.75 1.75-1.75H8V7.75A.75.75 0 0 1 8.75 7h-1z" fill="currentColor"></path></g></svg>
                    {{ $toKhmer(dateFormat(new Date(record.date), 'dd-mm-yyyy')) }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-3.5 h-3.5 mr-1 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM11.75 6a.75.75 0 0 1 .75.75V12h3.75a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75V6.75a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></g></svg>
                    {{ $toKhmer(record.start + ' - ' + record.end) }}
                  </span>
                  <span v-if="record.type" class="">{{ record.type.name }}</span>
                  <span v-if="Array.isArray(record.rooms) && record.rooms.length > 0" class="flex items-center">
                    <svg class="w-3.5 h-3.5 mr-1 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 13c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1l1.27.67c.33.18.73-.06.73-.44v-2.46c0-.38-.4-.62-.73-.44L18 14v-1zm-7.2-9.1l-6 4.5c-.5.38-.8.97-.8 1.6v9c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H6v-9l6-4.5 6 4.5v1h2v-1c0-.63-.3-1.22-.8-1.6l-6-4.5a2.01 2.01 0 0 0-2.4 0z" fill="currentColor"></path></svg>
                    {{ record.rooms.map(r => r.name).join(', ') }}
                  </span>
                  <span v-if="Array.isArray(record.organizations) && record.organizations.length > 0" class="flex items-center">
                    <svg class="w-3.5 h-3.5 mr-1 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M6.75 3.5A2.25 2.25 0 0 0 4.5 5.75v.68A8.984 8.984 0 0 0 3.5 11.5v.5c0 4.556 3.388 8.33 7.75 8.907V22H6.75a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5h-5v-1.093c4.362-.578 7.75-4.351 7.75-8.907v-.5c0-1.71-.486-3.324-1.327-4.695l.077-.055V5.75A2.25 2.25 0 0 0 16.75 3.5h-10zM6 5.75a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 .75.75v.75H6v-.75zm.703 2.25h10.594A7.478 7.478 0 0 1 18.5 11.5v.5c0 3.728-2.678 6.76-6.5 7.414-3.822-.654-6.5-3.686-6.5-7.414v-.5c0-1.365.371-2.652 1.014-3.75H6.703z" fill="currentColor"></path></g></svg>
                    {{ record.organizations.map(o => o.name).join(', ') }}
                  </span>
                  <span v-if="getListMembersLeaders(record).length > 0" class="flex items-center">
                    <svg class="w-3.5 h-3.5 mr-1 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none"><path d="M12 2a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4zm0 1.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5zM2 19v-.5C2 14.693 5.907 13 12 13s10 1.693 10 5.5v.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm1.5 0a.5.5 0 0 0 .5.5h16a.5.5 0 0 0 .5-.5v-.5c0-2.003-3.358-4-8.5-4s-8.5 1.997-8.5 4v.5z" fill="currentColor"></path></g></svg>
                    <span v-for="(lm,i) in getListMembersLeaders(record)" :key="'hl'+i">
                      <template v-if="lm.member && lm.member.officers && lm.member.officers.length">{{ lm.member.officers.map(o=>(o.countesy?o.countesy.name+' ':'')).join('') }}{{ lm.member.lastname }} {{ lm.member.firstname }}</template>
                      {{ i < getListMembersLeaders(record).length-1 ? ' , ' : '' }}
                    </span>
                  </span>
                </div>
              </div>
            </router-link>
              <div class="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-gray-100">
                <span class="text-xxs flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full" :class="record.active ? bg-green-500 : bg-gray-300"></span>
                  {{ parseInt( record.active ) > 0 ? 'បានផ្សាយ' : 'មិនទាន់ផ្សាយ' }}
                </span>
                <n-button size="tiny" :type="record.active ? warning : primary" @click="togglePublish(record)">
                  {{ parseInt( record.active ) > 0 ? 'ឈប់ផ្សាយ' : 'ផ្សាយ' }}
                </n-button>
              </div>
          </div>
        </div>
      </Transition>
      <Transition name="slide-fade">
        <div
          v-if="
            !Array.isArray(records) ||
            (Array.isArray(records) && records.length <= 0)
          "
          class="mt-24 text-lg "
        >
          មិនមានព័ត៌មានសម្រាប់បង្ហាញឡើយ។
        </div>
      </Transition>
      <!-- Pagination of crud -->
      <Transition name="slide-fade">
        <div
          v-if="pagination.totalPages > 1"
          class="fixed left-0 right-0 bottom-14 flex flex-wrap"
        >
          <div class="vcb-table-pagination bg-blue-300 mx-auto">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-popselect
                  trigger="click"
                  v-model:value="pagination.perPage"
                  :options="[
                    { label: 5, value: 5 },
                    { label: 10, value: 10 },
                    { label: 20, value: 20 },
                    { label: 30, value: 30 },
                    { label: 40, value: 40 },
                    { label: 50, value: 50 },
                    { label: 100, value: 100 },
                    { label: 200, value: 200 },
                    { label: 500, value: 500 },
                  ]"
                  size="small"
                  scrollable
                  @update:value="goTo(1)"
                >
                  <div
                    class="cursor-pointer font-pvh rounded-full p-2 px-4 border border-gray-200 text-blue-600 leading-4"
                  >
                    {{ $toKhmer(pagination.perPage) }}
                  </div>
                </n-popselect>
              </template>
              ចំនួនព័ត៌មានបង្ហាញម្ដង
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <div class="vcb-table-pagination-info font-pvh">
                  {{
                    pagination.totalPages > 0
                      ? $toKhmer(pagination.totalPages) + " ទំព័រ"
                      : ""
                  }}
                </div>
              </template>
              ចំនួនទំព័រសរុប
            </n-tooltip>
            <div
              v-for="(page, index) in pagination.buttons"
              :key="index"
              :class="
                pagination.page == page
                  ? ' vcb-pagination-page-active '
                  : ' vcb-pagination-page '
              "
              @click="pagination.page == page ? false : goTo(page)"
            >
              <n-tooltip trigger="hover">
                <template #trigger>
                  <div class="leading-8 text-md font-pvh">
                    {{ $toKhmer(page) }}
                  </div>
                </template>
                ទំព័រទី {{ $toKhmer(page) }}
              </n-tooltip>
            </div>
            <Transition name="slide-fade">
              <div
                v-if="pagination.page > 1"
                class="vcb-pagination-page"
                v-html="'<'"
                @click="previous"
              ></div>
            </Transition>
            <Transition name="slide-fade">
              <div
                v-if="pagination.page < pagination.totalPages"
                class="vcb-pagination-page"
                v-html="'>'"
                @click="next"
              ></div>
            </Transition>
          </div>
        </div>
      </Transition>
      <Transition name="slide-fade">
        <div
          v-if="crudLoading"
          class="table-loading absolute flex left-0 top-0 right-0 bottom-0 bg-white bg-opacity-90"
        >
          <div class="flex mx-auto items-center">
            <div class="spinner">
              <svg
                class="animate-spin w-16 mx-auto text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
              >
                <path
                  d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48s21.49-48 48-48s48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48s48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48s48-21.49 48-48s-21.491-48-48-48z"
                  fill="currentColor"
                ></path>
              </svg>
              <br /><br />កំពុងអាន...
            </div>
          </div>
          <div
            class="absolute top-2 right-2 cursor-pointer bg-white rounded-full"
            @click="closeTableLoading"
          >
            <svg
              class="w-10 mx-auto text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
            >
              <path
                d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z"
                fill="none"
                stroke="currentColor"
                stroke-miterlimit="10"
                stroke-width="32"
              ></path>
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
                d="M320 320L192 192"
              ></path>
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
                d="M192 320l128-128"
              ></path>
            </svg>
          </div>
        </div>
      </Transition>
    </div>
    <!-- Filter panel of crud -->
    <Transition name="slide-fade">
      <div v-if="filter" class="vcb-filters-panel">
        <n-tooltip trigger="hover">
          <template #trigger>
            <svg
              @click="toggleFilter"
              class="absolute bg-white rounded-full shadow p-1 right-2 top-2 w-10 h-10 border border-gray-200 cursor-pointer hover:text-green-500 duration-300"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 32 32"
            >
              <path
                d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z"
                fill="currentColor"
              ></path>
            </svg>
          </template>
          បិទផ្ទាំងចម្រោះព័ត៌មាន
        </n-tooltip>
        <div class="filter-title font-moul">
          សូមជ្រើសរើសលក្ខណ សម្រង់ទិន្នន័យ៖
        </div>
        <div class="filter-actions">
          <!-- Status filter dropdown list-->
          <div class="filter-action">
            <n-select
              @update:value="updateStatus"
              placeholder="ស្ថានភាពកិច្ចប្រជុំ"
              :options="statuses"
              multiple
            >
            </n-select>
          </div>
          <!-- Type filter dropdown list-->
          <div class="filter-action">
            <n-select
              @update:value="updateType"
              placeholder="ប្រភេទកិច្ចប្រជុំ"
              :options="types"
              multiple
            >
            </n-select>
          </div>
          <!-- Organization filter dropdown list-->
          <div class="filter-action">
            <n-select
              @update:value="updateOrganization"
              placeholder="ក្រសួង ស្ថាប័ន"
              :options="organizations"
              multiple
              filterable
            >
            </n-select>
          </div>
          <!-- Meeting member filter dropdown list-->
          <div class="filter-action">
            <n-select
              @update:value="updatePeople"
              placeholder="សមាសភាពអង្គប្រជុំ"
              :options="people"
              multiple
              filterable
            >
            </n-select>
          </div>
          <!-- Meeting room filter dropdown list-->
          <div class="filter-action">
            <n-select
              @update:value="updateRoom"
              placeholder="សាលប្រជុំ"
              :options="rooms"
              multiple
              filterable
            >
            </n-select>
          </div>
          <!-- Type filter dropdown list-->
          <div class="filter-action">
            <n-date-picker
              clearable
              v-model:value="selectedDate"
              @update:value="updateDate"
              placeholder="បរិច្ឆែទប្រជុំ"
              type="date"
            />
          </div>
        </div>
      </div>
    </Transition>
    <!-- Top action panel of crud -->
    <!--<div
      class="fixed left-0 top-0 right-0 bg-white flex title-bar border-b border-gray-200 p-2 h-12"
     >
      <div class="flex w-64 h-8 title">
        <svg
          class="flex-none w-8 h-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 48 48"
        >
          <g fill="none">
            <path
              d="M14.708 6a5.938 5.938 0 0 0-5.736 4.403l-1.773 6.623c.181-.017.365-.026.55-.026h2.045l1.593-5.951a3.438 3.438 0 0 1 3.32-2.549h18.587a3.438 3.438 0 0 1 3.32 2.549l4.756 17.77a3.72 3.72 0 0 1-3.594 4.681H21V36h16.776c4.09 0 7.066-3.878 6.01-7.828l-4.756-17.77A5.938 5.938 0 0 0 33.294 6H14.708zM34.75 40.5H20.995c.003-.083.005-.166.005-.25V38h13.751a1.25 1.25 0 0 1 0 2.5zM11.501 29a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5zM4 22.75A3.75 3.75 0 0 1 7.75 19h7.5A3.75 3.75 0 0 1 19 22.75v17.5A3.75 3.75 0 0 1 15.25 44h-7.5A3.75 3.75 0 0 1 4 40.25v-17.5zm3.75-1.25c-.69 0-1.25.56-1.25 1.25v17.5c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25v-17.5c0-.69-.56-1.25-1.25-1.25h-7.5z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
        <div class="font-moul ml-2 h-8 leading-9" v-html="model.title"></div>
      </div>
      <div class="flex-grow action-buttons flex-row-reverse flex">
        <div class="ml-2 flex flex-wrap">
          <n-tooltip trigger="hover">
            <template #trigger>
              <svg
                class="w-8 h-8 cursor-pointer text-blue-500 duration-300"
                @click="showCreateModal()"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M9 12h6"></path>
                  <path d="M12 9v6"></path>
                </g>
              </svg>
            </template>
            បន្ថែមទិន្នន័យថ្មី
          </n-tooltip>
        </div>
        <div class="ml-2 flex flex-wrap">
          <n-tooltip trigger="hover">
            <template #trigger>
              <svg
                class="w-8 h-8 cursor-pointer text-gray-500 hover:text-blue-500 duration-300"
                @click="viewMode = viewMode === 'grid' ? 'horizontal' : 'grid'"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
              >
                <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect v-if="viewMode==='grid'" x="3" y="3" width="7" height="7" rx="1"></rect>
                  <rect v-if="viewMode==='grid'" x="14" y="3" width="7" height="7" rx="1"></rect>
                  <rect v-if="viewMode==='grid'" x="3" y="14" width="7" height="7" rx="1"></rect>
                  <rect v-if="viewMode==='grid'" x="14" y="14" width="7" height="7" rx="1"></rect>
                  <rect v-if="viewMode==='horizontal'" x="3" y="5" width="18" height="6" rx="1"></rect>
                  <rect v-if="viewMode==='horizontal'" x="3" y="14" width="18" height="6" rx="1"></rect>
                </g>
              </svg>
            </template>
            {{ viewMode === 'grid' ? 'ប្តូរទៅទិដ្ឋភាពផ្ដេក' : 'ប្តូរទៅទិដ្ឋភាពក្រឡាចត្រង្គ' }}
          </n-tooltip>
        </div>
        <div class="w-3/5 md:w-2/5 relative h-8">
          <n-tooltip trigger="hover">
            <template #trigger>
              <div class="w-full relative">
                <input
                  type="text"
                  @keypress.enter="getRecords"
                  v-model="pagination.search"
                  class="bg-gray-100 px-2 h-8 w-full rounded border border-gray-200 focus:border-blue-600 hover:border-blue-600 duration-300"
                  placeholder="ស្វែងរក"
                />
                <svg
                  class="absolute right-1 top-1 w-6 h-6 text-gray-400 cursor-pointer"
                  @click="getRecords"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 20 20"
                >
                  <g fill="none">
                    <path
                      d="M8.5 3a5.5 5.5 0 0 1 4.227 9.02l4.127 4.126a.5.5 0 0 1-.638.765l-.07-.057l-4.126-4.127A5.5 5.5 0 1 1 8.5 3zm0 1a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
              </div>
            </template>
            សូមបញ្ចូលពាក្យគន្លឹះដើម្បីស្វែងរក
          </n-tooltip>
        </div>
        <div class="ml-2 flex flex-wrap">
          <n-tooltip trigger="hover">
            <template #trigger>
              <svg
                class="mx-2 w-8 h-8 p-1 bg-white rounded-full border border-yellow-300 cursor-pointer text-yellow-500 duration-300"
                @click="toggleFilter"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 32 32"
              >
                <path
                  d="M18 28h-4a2 2 0 0 1-2-2v-7.59L4.59 11A2 2 0 0 1 4 9.59V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v3.59a2 2 0 0 1-.59 1.41L20 18.41V26a2 2 0 0 1-2 2zM6 6v3.59l8 8V26h4v-8.41l8-8V6z"
                  fill="currentColor"
                ></path>
              </svg>
            </template>
            សម្រង់ទិន្នន័យ
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <router-link target="_blank" to="/tvtemplate3">
                <svg
                  class="mx-2 w-8 h-8 p-1 bg-white cursor-pointer text-blue-500 duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24"
                >
                  <path
                    data-v-781535bd=""
                    d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H3V6c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v10z"
                    fill="currentColor"
                  ></path>
                </svg>
              </router-link>
            </template>
            កាលវិភាគប្រជុំ
          </n-tooltip>
        </div>
      </div>
    </div> -->
    <!-- Form create account -->
    <create-form
      v-bind:model="model"
      v-bind:show="createModal.show"
      :onClose="closeCreateModal"
    />
  </div>
</template>
<script>
import Crud from "@classes/Crud.js";
import { reactive, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import QrcodeVue from "qrcode.vue";
import Vue3Barcode from "vue3-barcode";
import { useDialog, useMessage, useNotification } from "naive-ui";
import dateFormat from "dateformat";
import orgLogoUrl from "@assets/logo.png";

/**
 * CRUD component form
 */

import ThumbnailActionsForm from "./../actions/thumbnail-action.vue";
import CreateForm from "./../widgets/create.vue";
export default {
  name: "CRUDThumbnail",
  components: {
    QrcodeVue,
    Vue3Barcode,
    ThumbnailActionsForm,
    CreateForm,
  },
  props: {
    model: {
      required: true,
      default: () => {
        return reactive({
          name: "meeting",
          modules: "meetings",
          title: "កិច្ចប្រជុំ",
        });
      },
    },
  },
  setup(props) {
    const store = useStore();
    const dialog = useDialog();
    const message = useMessage();
    const notify = useNotification();
    const crud = ref(null);

    function openTvSchedule() {
      window.open('/#/tvtemplatex', '_blank')
    }

    const server = ref(store.getters[props.model.name + "/server"]);
    const pagination = ref(store.getters[props.model.name + "/pagination"]);
    const columns = ref(store.getters[props.model.name + "/columns"]);
    const records = ref([]);

    const crudLoading = ref(false);
    function getRecords() {
      crudLoading.value = true;
      crud.value.list(
        {
          ids:
            Array.isArray(pagination.value.ids) &&
            pagination.value.ids.length > 0
              ? pagination.value.ids
              : [],
          page:
            parseInt(pagination.value.page) > 0
              ? parseInt(pagination.value.page)
              : 1,
          perPage:
            parseInt(pagination.value.perPage) > 0
              ? parseInt(pagination.value.perPage)
              : 10,
          search:
            pagination.value.search != null &&
            pagination.value.search != undefined &&
            pagination.value.search != ""
              ? pagination.value.search
              : "",

          date:
            selectedDate.value == null
              ? ""
              : dateFormat(new Date(selectedDate.value), "yyyy-mm-dd"),
          statuses: selectedStatuses.value,
          types: selectedTypes.value,
          members: selectedPeople.value,
          organizations: selectedOrganizations.value,
          rooms: selectedRooms.value,
        },
        (res) => {
          pagination.value = crud.value.getPagination();
          records.value = res.data.records;
          window.clearTimeout();
          closeTableLoading();
        },
        (error) => {
          closeTableLoading();
        },
      );
    }

    function previous() {
      goTo(pagination.value.page <= 1 ? 1 : pagination.value.page - 1);
    }

    function next() {
      goTo(
        pagination.value.page >= pagination.value.totalPages
          ? pagination.value.totalPages
          : pagination.value.page + 1,
      );
    }

    function goTo(page) {
      pagination.value.page = parseInt(page) > 0 ? parseInt(page) : 1;
      getRecords();
    }

    /**
     * Create modal handling
     */
    var createModal = reactive({ show: false });
    function showCreateModal() {
      createModal.show = true;
    }

    function closeCreateModal(actionStatus) {
      createModal.show = false;
      if (parseInt(actionStatus) > 0) getRecords();
    }

    const filter = ref(false);
    const viewMode = ref('grid');
    function toggleFilter() {
      filter.value = !filter.value;
    }

    function closeTableLoading() {
      crudLoading.value = false;
    }
    function closeActions(actionStatus) {
      if (parseInt(actionStatus) > 0) getRecords();
    }

    function getListMembersDefenders(record) {
      return record.listMembers != undefined && record.listMembers.length > 0
        ? record.listMembers
            .filter((o) => o.group == "defender")
            .map((lm) =>
              lm.member.officers != undefined && lm.member.officers.length > 0
                ? lm.member
                : [],
            )
        : [];
    }

    function getListMembersLeaders(record) {
      let result =
        record.listMembers != undefined && record.listMembers.length > 0
          ? record.listMembers.filter(
              (o) =>
                o.group == "lead_meeting" &&
                o.member != undefined &&
                o.member.officers != undefined &&
                o.member.officers.length > 0,
            )
          : [];
      console.log(result);
      return result;
    }

    const search = ref(null);

    /**
     * Mark the matched text with in search box
     */
    function applyTagMark(str) {
      // Split the string by whitespace
      if (
        pagination.value.search != undefined &&
        pagination.value.search.trim() != ""
      ) {
        var arrStrSearch = pagination.value.search
          .split(/(\s+)/)
          .filter((e) => e.trim().length > 0)
          .map((e) => e.replaceAll(" ", ""));
        for (var i in arrStrSearch) {
          if (str.includes(arrStrSearch[i]))
            str = str.replaceAll(
              arrStrSearch[i],
              "<mark>" + arrStrSearch[i] + "</mark>",
            );
        }
      }
      return str;
    }

    onMounted(() => {
      initial();
    });

    const selectedStatuses = ref([]);
    const statuses = reactive([
      {
        label: "ទាំងអស់",
        value: null,
        color: "text-gray-200",
      },
      {
        label: "មិនទាន់ប្រជុំ",
        value: 1,
        color: " text-blue-600 ",
      },
      {
        label: "កំពុងប្រជុំ",
        value: 2,
        color: " text-green-600",
      },
      {
        label: "នៅបន្ត",
        value: 4,
        color: " text-yellow-600",
      },
      {
        label: "ប្ដូរ",
        value: 8,
        color: " text-pink-600",
      },
      {
        label: "ពន្យាពេល",
        value: 16,
        color: " text-brown-600",
      },
      {
        label: "ចប់",
        value: 32,
        color: " text-gray-600",
      },
    ]);
    const headerStatusOptions = computed(() => {
      return statuses.filter(s => s.value !== null).map(s => ({
        label: s.label,
        value: s.value,
      }));
    });
    function onHeaderStatusChange(value) {
      if (value != null && value !== undefined) {
        selectedStatuses.value = [value];
      } else {
        selectedStatuses.value = [];
      }
      goTo(1);
    }
    function updateStatus(value, selection) {
      selectedStatuses.value = value.filter((val) => parseInt(val) > 0);
      goTo(1);
    }

    const today = computed(() => {
      return dateFormat(new Date(attendantDate.value), "yyyy-mm-dd");
    });

    function togglePublish(record) {
      store.dispatch('meeting/toggleActive', { id: record.id })
        .then(res => {
          if (res.data?.ok) {
            record.active = record.active ? 0 : 1
            message.success(record.active ? 'បានផ្សាយទៅកាន់ TV ហើយ' : 'បានឈប់ផ្សាយ')
          }
        }).catch(() => notify.error({ title:'កំហុស', description:'បញ្ហាក្នុងពេលផ្សាយ' }))
    }
    function getStatusLabel(code) {
      let status = statuses.find((s) => s.value == code);
      return status != undefined ? status.label : "មិនមាន";
    }
    function getStatusBadgeClass(code) {
      const map = {
        1: 'bg-blue-100 text-blue-700 border-blue-300',
        2: 'bg-green-100 text-green-700 border-green-300',
        4: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        8: 'bg-pink-100 text-pink-700 border-pink-300',
        16: 'bg-orange-100 text-orange-700 border-orange-300',
        32: 'bg-gray-100 text-gray-600 border-gray-300',
      };
      return map[code] || 'bg-gray-100 text-gray-600 border-gray-300';
    }

    function getTypes() {
      store
        .dispatch("meetingType/list", { page: 1, perPage: 1000, search: "" })
        .then((res) => {
          store.commit("meetingType/setAllRecords", res.data.records);
        })
        .catch((err) => {
          notify.error(err);
        });
    }
    const types = computed(() => {
      let types = store.getters["meetingType/records"].all.map((type) => {
        return { label: type.name, value: type.id };
      });
      types.unshift({
        label: "ទាំងអស់",
        value: 0,
      });
      return types;
    });
    const selectedTypes = ref([]);
    function updateType(value, selection) {
      selectedTypes.value = value;
      goTo(1);
    }

    function getOrganizations() {
      store
        .dispatch("meetingOrganization/list", {
          page: 1,
          perPage: 1000,
          search: "",
        })
        .then((res) => {
          store.commit("meetingOrganization/setAllRecords", res.data.records);
        })
        .catch((err) => {
          notify.error(err);
        });
    }
    const organizations = computed(() => {
      let organizations = store.getters["meetingOrganization/records"].all.map(
        (organization) => {
          return { label: organization.name, value: organization.id };
        },
      );
      organizations.unshift({
        label: "ទាំងអស់",
        value: 0,
      });
      return organizations;
    });
    const selectedOrganizations = ref([]);
    function updateOrganization(value, selection) {
      selectedOrganizations.value = value;
      goTo(1);
    }

    function getPeople() {
      store
        .dispatch("meetingPeople/list", { page: 1, perPage: 1000, search: "" })
        .then((res) => {
          store.commit("meetingPeople/setAllRecords", res.data.records);
        })
        .catch((err) => {
          notify.error(err);
        });
    }
    const people = computed(() => {
      let people = store.getters["meetingPeople/records"].all.map((person) => {
        return {
          label: person.lastname + " " + person.firstname,
          value: person.id,
        };
      });
      people.unshift({
        label: "ទាំងអស់",
        value: 0,
      });
      return people;
    });
    const selectedPeople = ref([]);
    function updatePeople(value, selection) {
      selectedPeople.value = value;
      goTo(1);
    }

    function getRooms() {
      store
        .dispatch("meetingRoom/list", { page: 1, perPage: 1000, search: "" })
        .then((res) => {
          store.commit("meetingRoom/setAllRecords", res.data.records);
        })
        .catch((err) => {
          notify.error(err);
        });
    }
    const rooms = computed(() => {
      let rooms = store.getters["meetingRoom/records"].all.map((room) => {
        return { label: room.name, value: room.id };
      });
      rooms.unshift({
        label: "ទាំងអស់",
        value: 0,
      });
      return rooms;
    });
    const selectedRooms = ref([]);
    function updateRoom(value, selection) {
      selectedRooms.value = value;
      goTo(1);
    }

    function getCountesies() {
      store
        .dispatch("meetingCountesy/list", {
          page: 1,
          perPage: 1000,
          search: "",
        })
        .then((res) => {
          store.commit("meetingCountesy/setAllRecords", res.data.records);
        })
        .catch((err) => {
          notify.error(err);
        });
    }

    function getPositions() {
      store
        .dispatch("meetingPosition/list", {
          page: 1,
          perPage: 1000,
          search: "",
        })
        .then((res) => {
          store.commit("meetingPosition/setAllRecords", res.data.records);
        })
        .catch((err) => {
          notify.error(err);
        });
    }

    // const selectedDate = ref( new Date().getTime() )
    const selectedDate = ref(null);
    function updateDate(value) {
      selectedDate.value = value;
      goTo(1);
    }

    function initial() {
      store.commit(props.model.name + "/setColumns", [
        "id",
        "name",
        "desp",
        "active",
        "image",
        "pdf",
        "pid",
        "tpid",
      ]);
      store.commit(props.model.name + "/setModel", props.model);

      crud.value = new Crud();
      crud.value.setConfig(
        import.meta.env.VITE_API_SERVER,
        store.getters[props.model.name + "/model"],
        store.getters[props.model.name + "/columns"].all,
      );

      // Default filter: show only New (status=1) meetings
      selectedStatuses.value = [1];

      getRecords();
      getTypes();
      getOrganizations();
      getPositions();
      getCountesies();
      getPeople();
      getRooms();
    }

    return {
      // Variables
      crud,
      crudLoading,
      /**
       * Computed Property from store
       */
      records,
      columns,
      pagination,
      // Functions
      closeActions,
      closeTableLoading,
      /**
       * Variables
       */
      search,
      /**
       * Create Modal
       */
      createModal,
      showCreateModal,
      closeCreateModal,
      openTvSchedule,togglePublish,
      /**
       * Records Functions
       */
      getRecords,
      applyTagMark,
      filter,
      toggleFilter,
      previous,
      next,
      goTo,
      /**
       * Filter functions
       */
      updateStatus,
      statuses,
      selectedStatuses,
      headerStatusOptions,
      onHeaderStatusChange,
      today,
      getStatusLabel,
      getStatusBadgeClass,
      updateType,
      types,
      updateOrganization,
      organizations,
      updatePeople,
      people,
      updateRoom,
      rooms,
      selectedDate,
      updateDate,
      orgLogoUrl,
      getListMembersLeaders,
      getListMembersDefenders,
      dateFormat,
      viewMode,
    };
  },
};
</script>
<style type="text/css" scoped>
.vcb-thumbnail {
  @apply flex flex-wrap justify-center;
}
.vcb-thumbnail .item {
  @apply 2xl:w-1/4 xl:w-1/3 lg:w-1/2 md:w-1/2 sm:w-1/2 w-1/2 p-2 py-4;
}
.vcb-meeting-timestamp .item {
  @apply 2xl:w-1/5 xl:w-1/5 lg:w-1/4 md:w-1/3 sm:w-1/3 w-1/2 p-1;
}
.vcb-thumbnail .item .content {
  @apply border rounded-lg duration-500 p-4 relative hover:scale-105 transform-gpu bg-white;
  /* min-height: 200px;  */
}
.vcb-thumbnail .item .content .image {
  @apply border rounded-full p-2 w-20 h-20 flex-none mx-auto overflow-hidden bg-white;
}
.vcb-thumbnail .item .content .image-stick-top-left {
  @apply absolute left-2 -top-5 border rounded-full border-gray-200 p-2 w-10 h-10 flex-none mx-auto overflow-hidden bg-white z-50;
}
.vcb-table-pagination-info {
  @apply text-blue-600 leading-7 p-1 mx-1;
}
.vcb-filters-panel {
  @apply fixed left-0 top-12 right-0 bottom-0 bg-opacity-90 p-12 bg-gray-100;
}
.vcb-filters-panel .filter-title {
  @apply w-full text-left;
}
.vcb-filters-panel .filter-actions {
  @apply w-full text-left p-4 flex flex-wrap justify-center;
}
.vcb-filters-panel .filter-actions .filter-action {
  @apply p-2 m-2 bg-white rounded-sm border border-gray-300 w-4/6 sm:w-2/5 md:w-1/3 lg:w-1/4 xl:w-2/6;
}
/* Horizontal layout */
.vcb-horizontal .item-h {
  @apply mb-2 ;
}

</style>

<template>
  <div class="tv-screen">
    <!-- Header -->
    <div class="tv-header">
      <div class="tv-header-inner">
        <img src="@assets/logo.png" class="tv-logo" />
        <div class="tv-title">កាលវិភាគកិច្ចប្រជុំសំខាន់ៗ</div>
        <digital-clock dgClass="tv-clock" :suffix="full_date" />
      </div>
    </div>

    <!-- Body -->
    <div class="tv-body" :style="{ backgroundImage: 'url(' + pkachan + ')' }">
      <Transition name="tv-fade">
        <table v-if="records.length" class="tv-table" :class="'count-' + records.length">
          <thead>
            <tr>
              <th class="col-num">ល.រ</th>
              <th class="col-subject">ខ្លឹមសារ</th>
              <th class="col-place">ទីកន្លែង</th>
              <th class="col-status">ស្ថានភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record,index) in records" :key="index" :class="'tv-row ' + (index % 2 ? 'row-odd' : 'row-even')">
              <td class="col-num">
                <div class="num-circle">{{ $toKhmer((recordsPerSchedulePage * activePage) + index + 1) }}</div>
              </td>
              <td class="col-subject">
                <div class="meeting-objective">{{ record.objective }}</div>
                <div class="meeting-leaders">
                  <span v-for="(lm, li) in (record.listMembers || []).slice(0, 4)" :key="li">
                    {{ li > 0 ? ' · ' : '' }}{{ lm.member.lastname }} {{ lm.member.firstname }}
                  </span>
                  <span v-if="record.listMembers && record.listMembers.length > 4" class="more"> +{{ record.listMembers.length - 4 }}</span>
                </div>
              </td>
              <td class="col-place">
                <div class="place-info">
                  <div class="place-date">{{ $toKhmer(dateFormat(new Date(record.date), 'dd-mm-yyyy')) }}</div>
                  <div class="place-time">{{ $toKhmer(record.start) }}</div>
                  <div class="place-room">{{ record.rooms ? record.rooms.map(r => r.name).join(', ') : '' }}</div>
                </div>
              </td>
              <td class="col-status">
                <div class="status-badge" :class="getStatusClass(record.status)">{{ getStatusLabel(record.status) }}</div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="tv-empty">
          <div class="empty-icon">
            <svg viewBox="0 0 100 100" class="w-24 h-24 mx-auto opacity-30">
              <rect x="10" y="20" width="80" height="60" rx="5" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M30 40h40M30 50h30M30 60h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="empty-text">មិនទាន់មានកាលវិភាគកិច្ចប្រជុំ</div>
        </div>
      </Transition>
    </div>

    <!-- Footer / In-progress marquee -->
    <div v-if="meetingRecords && meetingRecords.length" class="tv-footer">
      <div class="footer-label">កំពុងប្រជុំ</div>
      <div class="footer-marquee">
        <div class="marquee-track">
          <span v-for="(m, i) in meetingRecords" :key="i" class="marquee-item">
            <img :src="pkachanwhite" class="bullet" /> {{ m.objective }}
          </span>
        </div>
      </div>
    </div>

    <!-- Debug info -->
    <div class="tv-debug">{{ windowWidth }}x{{ windowHeight }} · PP{{ recordsPerSchedulePage }} · CY{{ fetchingMeetingCounter }} · P{{ activePage + 1 }}/{{ schedulePages.length }}</div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import DigitalClock from '@components/widgets/DigitalClock.vue'
import { Vue3Marquee } from 'vue3-marquee'
import pkachan from '@assets/pkachan.png'
import pkachanwhite from '@assets/pkachanbulletwhite.png'
import dateFormat from 'dateformat'

export default {
  name: 'ScheduleMeetingTVXComponent',
  components: { DigitalClock, Vue3Marquee },
  setup() {
    const store = useStore()
    const full_date = ref(null)
    const windowHeight = ref(window.innerHeight)
    const windowWidth = ref(window.innerWidth)
    const recordsPerSchedulePage = ref(4)
    const schedulePages = ref([])
    const activePage = ref(0)
    const records = ref([])
    const meetingRecords = ref([])
    const fetchingMeetingCounter = ref(0)
    const errorGetScheduleMeeting = ref(false)

    const statuses = [
      { label: 'មិនទាន់ប្រជុំ', value: 1, color: 'status-new' },
      { label: 'កំពុងប្រជុំ', value: 2, color: 'status-meeting' },
      { label: 'នៅបន្ត', value: 4, color: 'status-continue' },
      { label: 'ប្ដូរ', value: 8, color: 'status-changed' },
      { label: 'ពន្យាពេល', value: 16, color: 'status-delayed' },
      { label: 'ចប់', value: 32, color: 'status-finished' },
    ]

    function getStatusClass(val) {
      const s = statuses.find(st => st.value === val)
      return s ? s.color : ''
    }

    function getStatusLabel(val) {
      const s = statuses.find(st => st.value === val)
      return s ? s.label : ''
    }

    window.addEventListener('resize', () => {
      windowWidth.value = window.innerWidth
      windowHeight.value = window.innerHeight
    })

    function getScheduleMeeting() {
      store.dispatch('meeting/scheduleOnTv', { page: 1, perPage: 100, search: '' })
        .then(res => {
          errorGetScheduleMeeting.value = false
          fetchingMeetingCounter.value++
          chunkRecords(res.data.records)
        })
        .catch(() => { errorGetScheduleMeeting.value = true })
    }

    function chunkRecords(responseRecords) {
      if (errorGetScheduleMeeting.value) return
      schedulePages.value = []
      meetingRecords.value = []
      responseRecords.forEach(r => { if (r.status === 2) meetingRecords.value.push(r) })
      full_date.value = responseRecords.length > 0 ? responseRecords[0].full_date : ''
      for (let i = 0; i < responseRecords.length; i += recordsPerSchedulePage.value) {
        schedulePages.value.push(responseRecords.slice(i, i + recordsPerSchedulePage.value))
      }
      activePage.value = 0
      records.value = schedulePages.value.length > 0 ? schedulePages.value[0] : []
      activateSlide()
    }

    let interval = null
    let timeout = null
    function activateSlide() {
      if (interval) clearInterval(interval)
      interval = setInterval(() => {
        records.value = []
        timeout = setTimeout(() => {
          activePage.value = activePage.value < schedulePages.value.length - 1 ? activePage.value + 1 : 0
          if (activePage.value === 0) getScheduleMeeting()
          records.value = schedulePages.value[activePage.value] || []
          clearTimeout(timeout)
          timeout = null
        }, 500)
      }, 18000)
    }

    onMounted(() => { getScheduleMeeting() })

    return {
      full_date, windowHeight, windowWidth, recordsPerSchedulePage,
      schedulePages, activePage, records, meetingRecords,
      fetchingMeetingCounter, errorGetScheduleMeeting,
      getStatusClass, getStatusLabel, dateFormat, pkachan, pkachanwhite,
    }
  }
}
</script>

<style scoped>
/* ─── Reset & Full Screen ─── */
.tv-screen, .tv-screen * {
  box-sizing: border-box;
}
.tv-screen {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  overflow: hidden;
  font-family: 'Kantumruy Pro', 'Khmer OS Siemreap', 'Segoe UI', sans-serif;
  background: #0a0e27;
  color: #fff;
  display: flex;
  flex-direction: column;
}

/* ─── Header ─── */
.tv-header {
  flex: 0 0 auto;
  background: linear-gradient(135deg, #0d1442 0%, #1a237e 100%);
  border-bottom: 2px solid rgba(255,215,0,0.3);
  padding: 0 2vw;
  height: 9vh;
  min-height: 50px;
}
.tv-header-inner {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 1.5vw;
}
.tv-logo {
  height: 70%;
  width: auto;
  flex-shrink: 0;
}
.tv-title {
  flex: 1;
  font-family: 'Moul', 'Khmer OS Muol Light', serif;
  font-size: clamp(16px, 2.8vh, 40px);
  color: #ffd700;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tv-clock {
  font-family: 'Digital-7', monospace;
  font-size: clamp(14px, 2.4vh, 36px);
  color: #90caf9;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ─── Body ─── */
.tv-body {
  flex: 1;
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: rgba(10,14,39,0.92);
  background-blend-mode: overlay;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5vh 2vw;
  min-height: 0;
}

.tv-table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0 0.6vh;
  table-layout: fixed;
}

/* Column widths */
.col-num { width: 8%; }
.col-subject { width: 50%; }
.col-place { width: 22%; }
.col-status { width: 20%; }

/* Table header */
.tv-table thead th {
  font-family: 'Moul', serif;
  font-size: clamp(11px, 1.8vh, 24px);
  line-height: 1.6;
  color: #ffd700;
  text-align: center;
  padding: 0.8vh 1vw;
  background: rgba(13,20,66,0.8);
  border-bottom: 2px solid rgba(255,215,0,0.3);
  text-shadow: 0 1px 4px rgba(0,0,0,0.4);
}
.tv-table thead th.col-subject { text-align: left; }

/* Table rows */
.tv-row {
  transition: background 0.3s;
}
.tv-row.row-odd td {
  background: rgba(255,255,255,0.04);
}
.tv-row.row-even td {
  background: rgba(255,255,255,0.08);
}
.tv-row td {
  padding: 0.6vh 1vw;
  vertical-align: middle;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.tv-row td.col-subject {
  position: relative;
  vertical-align: top;
  padding-top: 1vh;
}

/* Number circle */
.num-circle {
  width: 4.5vh;
  height: 4.5vh;
  min-width: 28px;
  min-height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700, #ffab00);
  color: #0a0e27;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Moul', serif;
  font-size: clamp(11px, 1.6vh, 22px);
  font-weight: bold;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(255,215,0,0.3);
}

/* Subject column */
.meeting-objective {
  font-family: 'Moul', serif;
  font-size: clamp(18px, 3.2vh, 44px);
  color: #fff;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.meeting-leaders {
  position: absolute;
  bottom: 0.6vh;
  left: 1vw;
  right: 1vw;
  font-size: clamp(80px, 11vh, 140px);
  color: #b0bec5;
  text-align: left;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.meeting-leaders span {
  font-size: clamp(30px, 6vh, 30px);
}
.meeting-leaders .more {
  color: #ffd700;
  font-weight: bold;
}

/* Place column */
.place-info {
  text-align: center;
}
.place-date {
  font-size: clamp(20px, 1.5vh, 20px);
  color: #fff;
  font-weight: bold;
  line-height: 1.6;
}
.place-time {
  font-size: clamp(20px, 2.2vh, 30px);
  color: #ffd700;
  font-weight: bold;
  font-family: 'Moul', serif;
  line-height: 1.6;
}
.place-room {
  font-size: clamp(20px, 1.3vh, 16px);
  font-weight: bold;
  color: #90caf9;
  line-height: 1.6;
}

/* Status badge */
.status-badge {
  display: inline-block;
  padding: 0.4vh 1.2vw;
  border-radius: 4px;
  font-size: clamp(20px, 1.4vh, 20px);
  font-family: 'Moul', serif;
  text-align: center;
  min-width: 6vw;
  line-height: 1.6;
}
.status-new { background: #f9a825; color: #1a1a1a; }
.status-meeting { background: #2e7d32; color: #fff; }
.status-continue { background: #1565c0; color: #fff; }
.status-changed { background: #d81b60; color: #fff; }
.status-delayed { background: #6d4c41; color: #fff; }
.status-finished { background: #546e7a; color: #fff; }

/* Empty state */
.tv-empty {
  text-align: center;
  color: rgba(255,255,255,0.4);
}
.empty-text {
  font-family: 'Moul', serif;
  font-size: clamp(14px, 2.5vh, 36px);
  margin-top: 1vh;
  line-height: 1.8;
}

/* ─── Footer / In-progress marquee ─── */
.tv-footer {
  flex: 0 0 auto;
  height: 7vh;
  min-height: 40px;
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  border-top: 2px solid rgba(255,215,0,0.3);
  display: flex;
  align-items: center;
  overflow: hidden;
}
.footer-label {
  flex: 0 0 auto;
  font-family: 'Moul', serif;
  font-size: clamp(11px, 1.8vh, 24px);
  padding: 0 1.5vw;
  background: linear-gradient(135deg, #ffd700, #ffab00);
  color: #0a0e27;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;
  line-height: 1.6;
}
.footer-marquee {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.marquee-track {
  display: flex;
  animation: marqueeScroll 30s linear infinite;
  white-space: nowrap;
}
.marquee-item {
  font-family: 'Moul', serif;
  font-size: clamp(10px, 1.6vh, 22px);
  color: #fff;
  padding: 0 2vw;
  display: flex;
  align-items: center;
  gap: 0.5vw;
  flex-shrink: 0;
}
.bullet {
  height: 2.5vh;
  width: auto;
  opacity: 0.8;
}

@keyframes marqueeScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ─── Debug ─── */
.tv-debug {
  position: fixed;
  bottom: 0; left: 0;
  font-size: 9px;
  color: rgba(255,255,255,0.2);
  padding: 2px 6px;
  z-index: 999;
}

/* ─── Transition ─── */
.tv-fade-enter-active { transition: all 0.5s ease; }
.tv-fade-leave-active { transition: all 0.4s ease; }
.tv-fade-enter-from { opacity: 0; transform: translateY(20px); }
.tv-fade-leave-to { opacity: 0; transform: translateY(-20px); }

/* ─── Row height adapts to count ─── */
.count-1 tbody tr { height: 70%; }
.count-2 tbody tr { height: 35%; }
.count-3 tbody tr { height: 23%; }
.count-4 tbody tr { height: 17%; }
</style>

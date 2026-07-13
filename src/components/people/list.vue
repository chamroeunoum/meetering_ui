<template>
  <div class="w-full p-4">
    <!-- Top action panel -->
    <div class="flex title-bar border-b border-default p-2 h-12">
      <div class="flex w-64 h-8 title">
        <svg class="flex-none w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <div class="font-moul ml-2 h-8 leading-9 text-secondary">{{ model.title }}</div>
      </div>
      <div class="flex-grow action-buttons flex-row-reverse flex">
        <n-button type="primary" size="small" @click="openCreate">បន្ថែមថ្មី</n-button>
        <div class="w-3/5 md:w-2/5 relative h-8 mr-2">
          <input type="text" @keypress.enter="filterRecords" v-model="search"
            class="bg-gray-100 dark:bg-gray-700 px-2 h-8 w-full rounded border border-default focus:border-blue-600 duration-300 text-secondary"
            placeholder="ស្វែងរកតាមឈ្មោះ លេខទូរសព្ទ អ៊ីមែល..." />
          <svg class="absolute right-1 top-1 w-6 h-6 text-muted cursor-pointer" @click="filterRecords"
            viewBox="0 0 20 20"><g fill="none"><path d="M8.5 3a5.5 5.5 0 0 1 4.227 9.02l4.127 4.126a.5.5 0 0 1-.638.765l-.07-.057l-4.126-4.127A5.5 5.5 0 1 1 8.5 3zm0 1a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9z" fill="currentColor"/></g></svg>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20"><n-spin size="medium" /></div>

    <!-- Empty -->
    <div v-else-if="!records.length" class="mt-24 text-center text-muted">
      <svg class="w-16 h-16 mx-auto mb-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
      <div class="text-lg">មិនមានព័ត៌មានបុគ្គលសម្រាប់បង្ហាញឡើយ។</div>
    </div>

    <!-- Table -->
    <div v-else class="mt-2 mb-12">
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="text-left text-xs text-muted uppercase">
              <th class="p-3 w-12">#</th>
              <th class="p-3 w-12">រូប</th>
              <th class="p-3">ឈ្មោះ</th>
              <th class="p-3">ភេទ</th>
              <th class="p-3">លេខទូរសព្ទ</th>
              <th class="p-3">អ៊ីមែល</th>
              <th class="p-3">តួនាទី</th>
              <th class="p-3">អង្គភាព</th>
              <th class="p-3 text-center w-24">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(rec, index) in records" :key="rec.id"
              class="border-b border-default hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-secondary">
              <td class="p-3 text-left text-muted">{{ index + 1 + (page - 1) * perPage }}</td>
              <td class="p-3 text-left">
                <div v-if="rec.photo_url" class="w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <img :src="rec.photo_url" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-bold">
                  {{ (rec.lastname||'')[0] }}{{ (rec.firstname||'')[0] }}
                </div>
              </td>
              <td class="p-3 text-left">
                <div class="font-semibold">
                  <template v-if="rec.countesy">
                    <span class="text-xs text-muted">{{ rec.countesy.name }} </span>
                  </template>
                  {{ rec.lastname }} {{ rec.firstname }}
                </div>
              </td>
              <td class="p-3 text-left">{{ rec.gender === 0 ? 'ប្រុស' : rec.gender === 1 ? 'ស្រី' : '—' }}</td>
              <td class="p-3 text-left">{{ rec.mobile_phone || rec.office_phone || '—' }}</td>
              <td class="p-3 text-left text-muted">{{ rec.email || '—' }}</td>
              <td class="p-3 text-left text-muted">
                <template v-if="rec.position">
                  {{ rec.position.name }}
                </template>
                <span v-else>—</span>
              </td>
              <td class="p-3 text-left text-muted">
                <template v-if="rec.organization">
                  {{ rec.organization.name }}
                </template>
                <span v-else>—</span>
              </td>
              <td class="p-3 text-center">
                <n-button size="tiny" quaternary @click="openEdit(rec)">
                  <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </n-button>
                <n-button size="tiny" quaternary @click="confirmDelete(rec)">
                  <svg class="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </n-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-4 space-x-1">
        <n-button size="tiny" :disabled="page <= 1" @click="goPage(page - 1)">មុន</n-button>
        <n-button size="tiny" v-for="p in pageButtons" :key="p" :type="p === page ? 'primary' : 'default'" @click="goPage(p)">{{ p }}</n-button>
        <n-button size="tiny" :disabled="page >= totalPages" @click="goPage(page + 1)">បន្ទាប់</n-button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <n-modal v-model:show="form.show" preset="card" :title="form.isEdit ? 'កែប្រែព័ត៌មានបុគ្គល' : 'បន្ថែមបុគ្គលថ្មី'" style="max-width:560px" :mask-closable="false">
      <n-form :model="form.data" label-placement="top" class="mt-2">
        <!-- Photo upload -->
        <div class="flex items-center gap-4 mb-4">
          <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 border-2 border-dashed border-gray-300 dark:border-gray-600">
            <img v-if="photoPreview" :src="photoPreview" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center text-muted text-xs">គ្មានរូប</div>
          </div>
          <div class="flex flex-col gap-2">
            <n-button size="tiny" @click="$refs.photoInput.click()" :disabled="!form.data.id && !form.isEdit">
              <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              ជ្រើសរើសរូបថត
            </n-button>
            <input ref="photoInput" type="file" accept="image/*" class="hidden" @change="handlePhotoSelect" />
            <div v-if="photoUploading" class="text-xs text-blue-500">កំពុងផ្ទុកឡើង...</div>
          </div>
        </div>
        <n-grid :cols="2" :x-gap="12">
          <n-gi>
            <n-form-item label="នាមត្រកូល" required>
              <n-input v-model:value="form.data.lastname" placeholder="នាមត្រកូល" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="នាមខ្លួន" required>
              <n-input v-model:value="form.data.firstname" placeholder="នាមខ្លួន" />
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-grid :cols="2" :x-gap="12">
          <n-gi>
            <n-form-item label="ភេទ">
              <n-select v-model:value="form.data.gender" :options="[{label:'ប្រុស',value:0},{label:'ស្រី',value:1}]" placeholder="ជ្រើសរើស" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="លេខទូរសព្ទ">
              <n-input v-model:value="form.data.phone" placeholder="លេខទូរសព្ទ" />
            </n-form-item>
          </n-gi>
        </n-grid>
        <n-form-item label="អ៊ីមែល">
          <n-input v-model:value="form.data.email" placeholder="អ៊ីមែល" />
        </n-form-item>
        <n-form-item label="ងារ">
          <n-select v-model:value="form.data.countesy_id" :options="countesyOptions" filterable placeholder="ជ្រើសរើសងារ" clearable />
        </n-form-item>
        <n-grid :cols="2" :x-gap="12">
          <n-gi>
            <n-form-item label="គ្រឹះស្ថាន">
              <n-select v-model:value="form.data.organization_id" :options="orgOptions" filterable placeholder="ជ្រើសរើសគ្រឹះស្ថាន" />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="តួនាទី">
              <n-select v-model:value="form.data.position_id" :options="positionOptions" filterable placeholder="ជ្រើសរើសតួនាទី" />
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-form>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <n-button @click="form.show = false">បោះបង់</n-button>
          <n-button type="primary" @click="saveRecord" :loading="form.saving" :disabled="!form.data.lastname || !form.data.firstname">
            {{ form.isEdit ? 'កែប្រែ' : 'រក្សាទុក' }}
          </n-button>
        </div>
      </template>
    </n-modal>

    <!-- Delete confirm -->
    <n-modal v-model:show="deleteConfirm.show" preset="dialog" type="warning"
      title="លុបព័ត៌មាន" :content="`តើអ្នកចង់លុប ${deleteConfirm.record?.lastname || ''} ${deleteConfirm.record?.firstname || ''} មែនទេ?`"
      positive-text="បាទ / ចាស" negative-text="ទេ"
      @positive-click="doDelete" @negative-click="deleteConfirm.show = false"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useMessage, useDialog } from 'naive-ui'

export default {
  name: 'PeopleList',
  props: {
    model: { type: Object, required: true },
  },
  setup(props) {
    const store = useStore()
    const message = useMessage()
    const dialog = useDialog()
    const server = computed(() => store.state.people.server)
    const records = ref([])
    const loading = ref(false)
    const search = ref('')
    const page = ref(1)
    const perPage = ref(20)
    const totalPages = ref(1)

    // Photo upload
    const photoPreview = ref(null)
    const photoUploading = ref(false)

    // Reference options
    const orgOptions = ref([])
    const positionOptions = ref([])
    const countesyOptions = ref([])

    function fetchReferences() {
      store.dispatch('meetingOrganization/list', { search: '', perPage: 1000, page: 1 }).then(res => {
        if (res.data?.ok) {
          const list = Array.isArray(res.data.records) ? res.data.records : (res.data.records?.data || [])
          orgOptions.value = list.map(o => ({ label: o.name, value: parseInt(o.id) }))
        }
      })
      store.dispatch('meetingPosition/list', { search: '', perPage: 1000, page: 1 }).then(res => {
        if (res.data?.ok) {
          const list = Array.isArray(res.data.records) ? res.data.records : (res.data.records?.data || [])
          positionOptions.value = list.map(p => ({ label: p.name, value: parseInt(p.id) }))
        }
      })
      store.dispatch('meetingCountesy/list', { search: '', perPage: 1000, page: 1 }).then(res => {
        if (res.data?.ok) {
          const list = Array.isArray(res.data.records) ? res.data.records : (res.data.records?.data || [])
          countesyOptions.value = list.map(c => ({ label: c.name, value: parseInt(c.id) }))
        }
      })
    }

    function handlePhotoSelect(event) {
      const file = event.target.files?.[0]
      if (!file) return
      // Show local preview immediately
      const reader = new FileReader()
      reader.onload = (e) => { photoPreview.value = e.target.result }
      reader.readAsDataURL(file)
      // Upload to server
      if (form.data.id) {
        photoUploading.value = true
        const formData = new FormData()
        formData.append('files', file)
        formData.append('id', form.data.id)
        store.dispatch('meetingPeople/uploadPicture', formData).then(res => {
          if (res.data?.ok) {
            message.success('បានផ្ទុករូបថតរួចរាល់')
          } else {
            message.warning(res.data?.message || 'មានបញ្ហាក្នុងការផ្ទុករូបថត')
          }
        }).catch(e => {
          message.error('មានបញ្ហាក្នុងការផ្ទុករូបថត')
          console.error(e)
        }).finally(() => {
          photoUploading.value = false
        })
      }
    }

    async function filterRecords() {
      loading.value = true
      try {
        const res = await store.dispatch('meetingPeople/list', { search: search.value, perPage: perPage.value, page: page.value })
        if (res.data?.ok) {
          const d = res.data
          if (Array.isArray(d.records)) {
            records.value = d.records
            totalPages.value = Math.ceil((d.pagination?.totalRecords || records.value.length) / perPage.value)
          } else if (d.records?.data) {
            records.value = d.records.data
            totalPages.value = d.records.last_page || 1
          } else {
            records.value = []
          }
        }
      } catch (e) {
        console.error(e)
        records.value = []
      }
      loading.value = false
    }

    function goPage(p) { page.value = p; filterRecords() }

    const pageButtons = computed(() => {
      const pages = []
      const start = Math.max(1, page.value - 2)
      const end = Math.min(totalPages.value, page.value + 2)
      for (let i = start; i <= end; i++) pages.push(i)
      return pages
    })

    // ─── Form ──────────────────────────────────────────────────
    const form = reactive({
      show: false,
      isEdit: false,
      saving: false,
      data: { firstname: '', lastname: '', gender: null, phone: '', email: '', organization_id: null, position_id: null, countesy_id: null },
    })

    function openCreate() {
      form.isEdit = false
      form.data = { firstname: '', lastname: '', gender: null, phone: '', email: '', organization_id: null, position_id: null, countesy_id: null }
      photoPreview.value = null
      form.show = true
    }
    function openEdit(rec) {
      form.isEdit = true
      form.data = {
        id: rec.id,
        firstname: rec.firstname || '',
        lastname: rec.lastname || '',
        gender: rec.gender != null ? rec.gender : null,
        phone: rec.mobile_phone || '',
        email: rec.email || '',
        organization_id: rec.organization?.id || null,
        position_id: rec.position?.id || null,
        countesy_id: rec.countesy?.id || null,
      }
      photoPreview.value = rec.photo_url || null
      form.show = true
    }

    async function saveRecord() {
      form.saving = true
      try {
        const payload = {
          firstname: form.data.firstname,
          lastname: form.data.lastname,
          gender: form.data.gender,
          phone: form.data.phone,
          email: form.data.email,
          organization: form.data.organization_id,
          position: form.data.position_id,
          countesy: form.data.countesy_id,
        }
        if (form.isEdit && form.data.id) {
          payload.id = form.data.id
        }
        const res = await store.dispatch('meetingPeople/save', payload)
        if (res.data?.ok) {
          message.success('បានរក្សាទុករួចរាល់')
          form.show = false
          filterRecords()
        } else {
          message.warning(res.data?.message || 'មានបញ្ហាក្នុងពេលរក្សាទុក')
        }
      } catch (e) {
        message.error('មានបញ្ហាក្នុងពេលរក្សាទុក')
        console.error(e)
      }
      form.saving = false
    }

    // ─── Delete ────────────────────────────────────────────────
    const deleteConfirm = reactive({ show: false, record: null })
    function confirmDelete(rec) {
      deleteConfirm.record = rec
      deleteConfirm.show = true
    }
    async function doDelete() {
      if (!deleteConfirm.record) return
      try {
        const res = await store.dispatch('meetingPeople/delete', { id: deleteConfirm.record.id })
        if (res.data?.ok) {
          message.success('បានលុបរួចរាល់')
          filterRecords()
        } else {
          message.warning(res.data?.message || 'មានបញ្ហា')
        }
      } catch (e) {
        message.error('មានបញ្ហាក្នុងពេលលុប')
      }
      deleteConfirm.show = false
    }

    onMounted(() => {
      filterRecords()
      fetchReferences()
    })

    return {
      records, loading, search, page, perPage, totalPages, pageButtons,
      filterRecords, goPage, openCreate, openEdit, saveRecord,
      form, confirmDelete, doDelete, deleteConfirm, orgOptions, positionOptions, countesyOptions,
      photoPreview, photoUploading, handlePhotoSelect,
    }
  }
}
</script>

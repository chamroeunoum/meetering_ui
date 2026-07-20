<template>
  <div class="vcb-pop-create font-ktr">
    <n-modal
      :show="show"
      :mask-closable="false"
      transform-origin="center"
      @esc="onClose?.(0)"
      @after-enter="initial"
    >
      <n-card
        class="w-[92vw] max-w-3xl font-ktr"
        :title="isEditMode ? 'កែប្រែកិច្ចប្រជុំ' : 'បន្ថែមកិច្ចប្រជុំ'"
        :bordered="false"
        size="small"
        closable
        @close="onClose?.(0)"
      >
        <template #header-extra>
          <n-button
            type="success"
            size="small"
            :loading="saving"
            :disabled="saving"
            @click="save"
          >
            រក្សាទុក
          </n-button>
        </template>

        <div class="border-t border-gray-100 pt-4 max-h-[75vh] overflow-y-auto pr-1">
          <n-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-placement="top"
            size="medium"
            require-mark-placement="right-hanging"
          >
            <!-- Match meeting detail header fields -->
            <n-form-item label="កម្មវត្ថុ" path="objective" required>
              <n-input
                v-model:value="form.objective"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="ឧ. កិច្ចប្រជុំពិនិត្យវឌ្ឍនភាពគម្រោង..."
              />
            </n-form-item>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <n-form-item label="ប្រភេទប្រជុំ" path="type_id" required>
                <n-select
                  v-model:value="form.type_id"
                  filterable
                  clearable
                  placeholder="ជ្រើសរើសប្រភេទប្រជុំ"
                  :options="typeOptions"
                />
              </n-form-item>

              <n-form-item label="កាលបរិច្ឆេទ" path="date" required>
                <n-date-picker
                  v-model:formatted-value="form.date"
                  value-format="yyyy-MM-dd"
                  type="date"
                  clearable
                  class="w-full"
                  placeholder="ជ្រើសរើសកាលបរិច្ឆេទ"
                />
              </n-form-item>

              <n-form-item label="ម៉ោងចាប់ផ្ដើម" path="start" required>
                <n-time-picker
                  v-model:formatted-value="form.start"
                  value-format="HH:mm"
                  format="HH:mm"
                  clearable
                  class="w-full"
                  placeholder="08:00"
                />
              </n-form-item>

              <n-form-item label="ម៉ោងបញ្ចប់" path="end" required>
                <n-time-picker
                  v-model:formatted-value="form.end"
                  value-format="HH:mm"
                  format="HH:mm"
                  clearable
                  class="w-full"
                  placeholder="11:30"
                />
              </n-form-item>

              <n-form-item label="បន្ទប់ប្រជុំ" path="rooms">
                <n-select
                  v-model:value="form.rooms"
                  filterable
                  multiple
                  clearable
                  placeholder="ជ្រើសរើសបន្ទប់ប្រជុំ"
                  :options="roomOptions"
                />
              </n-form-item>

              <n-form-item label="ក្រសួង ស្ថាប័ន" path="organizations">
                <n-select
                  v-model:value="form.organizations"
                  filterable
                  multiple
                  clearable
                  placeholder="ជ្រើសរើសក្រសួង ស្ថាប័ន"
                  :options="organizationOptions"
                />
              </n-form-item>
            </div>

            <n-form-item label="ផ្លូវទៅកាន់ទីតាំងប្រជុំ" path="route">
              <n-input
                v-model:value="form.route"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                placeholder="ឧ. ចូលតាមច្រកទ្វារខាងកើត អគារទីស្ដីការគណៈរដ្ឋមន្ត្រី ជាន់ទី៣..."
              />
            </n-form-item>

            <n-form-item label="សង្ខេបបឋមនៃកិច្ចប្រជុំ" path="summary">
              <n-input
                v-model:value="form.summary"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="សរសេរសង្ខេបបឋមនៃកិច្ចប្រជុំ..."
              />
            </n-form-item>
          </n-form>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<script>
import { reactive, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useNotification } from 'naive-ui'
import dateFormat from 'dateformat'
import Crud from '@classes/Crud.js'

function defaultForm() {
  const now = new Date()
  return {
    objective: '',
    summary: '',
    route: '',
    contact_info: '',
    date: dateFormat(now, 'yyyy-mm-dd'),
    start: '08:00',
    end: '11:30',
    type_id: null,
    organizations: [],
    rooms: []
  }
}

export default {
  name: 'MeetingCreateForm',
  props: {
    model: {
      type: Object ,
      required: true ,
      default: () => {
        return reactive({
          name: 'Undefined' ,
          title: 'No title'
        })
      },
      // validator: (val) => {}
    } , 
    record: {
      type: Object ,
      required: false ,
      default: () => {
        return reactive({
          id: 0 ,
          objective: '' ,
          contact_info: '' ,
          route: '' ,
          date: new Date() ,
          start: null ,
          summary: '' ,
          end : null ,
          type_id: null
        })
      }
    },
    show: { type: Boolean, default: false },
    onClose: { type: Function, default: null }
  },
  setup(props) {
    const store = useStore()
    const notify = useNotification()
    const formRef = ref(null)
    const crud = ref(null)
    const saving = ref(false)
    const form = reactive(defaultForm())
    const originalRoomIds = ref([])

    const isEditMode = computed(() => parseInt(props.record?.id) > 0)

    const typeOptions = computed(() =>
      (store.getters['meetingType/records']?.all || []).map(o => ({
        label: o.name,
        value: o.id
      }))
    )

    const organizationOptions = computed(() =>
      (store.getters['meetingOrganization/records']?.all || []).map(o => ({
        label: o.name,
        value: o.id
      }))
    )

    const roomOptions = computed( () => {
      const list = store.getters['meetingRoom/records'].all
      return Array.isArray(list) ? list.map( ( r ) => {
        return { label: r.name , value: r.id }
      }) : []
    })

    const rules = {
      objective: {
        required: true,
        message: 'សូមបំពេញកម្មវត្ថុ',
        trigger: ['blur', 'input']
      },
      type_id: {
        required: true,
        type: 'number',
        message: 'សូមជ្រើសរើសប្រភេទប្រជុំ',
        trigger: ['blur', 'change']
      },
      date: {
        required: true,
        message: 'សូមជ្រើសរើសកាលបរិច្ឆេទ',
        trigger: ['blur', 'change']
      },
      start: {
        required: true,
        message: 'សូមជ្រើសរើសម៉ោងចាប់ផ្ដើម',
        trigger: ['blur', 'change']
      },
      end: {
        required: true,
        message: 'សូមជ្រើសរើសម៉ោងបញ្ចប់',
        trigger: ['blur', 'change'],
        validator(rule, value) {
          if (!value || !form.start) return true
          if (value <= form.start) return new Error('ម៉ោងបញ្ចប់ត្រូវតែក្រោយម៉ោងចាប់ផ្ដើម')
          return true
        }
      }
    }

    function resetForm() {
      Object.assign(form, defaultForm())
    }

    function initial() {
      store.commit(props.model.name + '/setColumns', ['id', 'name'])
      store.commit(props.model.name + '/setModel', props.model)
      crud.value = new Crud()
      crud.value.setConfig(
        import.meta.env.VITE_API_SERVER,
        store.getters[props.model.name + '/model'],
        store.getters[props.model.name + '/columns'].all
      )

      if (isEditMode.value) {
        const r = props.record
        form.objective = r.objective || ''
        form.summary = r.summary || ''
        form.route = r.route || ''
        form.contact_info = r.contact_info || ''
        form.date = r.date || ''
        form.start = r.start || ''
        form.end = r.end || ''
        form.type_id = r.type_id || (r.type ? r.type.id : null)
        form.organizations = Array.isArray(r.organizations) ? r.organizations.map(o => o.id) : []
        form.rooms = Array.isArray(r.rooms) ? r.rooms.map(rm => rm.id) : []
        originalRoomIds.value = [...form.rooms]
      } else {
        resetForm()
      }

      // Ensure lookup lists are available
      const listOpts = { page: 1, perPage: 1000, search: '' }
      if (!typeOptions.value.length) store.dispatch('meetingType/list', listOpts).catch(() => {})
      if (!organizationOptions.value.length) store.dispatch('meetingOrganization/list', listOpts).catch(() => {})
      if (!roomOptions.value.length) store.dispatch('meetingRoom/list', listOpts).catch(() => {})
    }

    function syncRooms(meetingId) {
      const newRoomIds = Array.isArray(form.rooms) ? form.rooms : []
      const oldRoomIds = isEditMode.value ? originalRoomIds.value : []
      const changedRoomIds = [
        ...oldRoomIds.filter(id => !newRoomIds.includes(id)),
        ...newRoomIds.filter(id => !oldRoomIds.includes(id))
      ]
      return Promise.all(
        changedRoomIds.map(id =>
          store.dispatch(props.model.name + '/toggleMeetingRoom', {
            room: { id },
            meeting: { id: meetingId }
          })
        )
      )
    }

    async function save() {
      try {
        await formRef.value?.validate()
      } catch (e) {
        return
      }

      if (!form.objective?.trim()) {
        notify.warning({
          title: 'ពិនិត្យព័ត៌មាន',
          description: 'សូមបំពេញកម្មវត្ថុ',
          duration: 3000
        })
        return
      }

      if (!props.model?.name) {
        notify.warning({
          title: 'ពិនិត្យព័ត៌មាន',
          description: 'ទម្រង់នៃព័ត៌មានមិនទាន់បានកំណត់។',
          duration: 3000
        })
        return
      }

      saving.value = true

      if (isEditMode.value) {
        syncRooms(props.record.id)
          .then(() => store.dispatch(props.model.name + '/update', {
            id: props.record.id,
            objective: form.objective,
            date: form.date,
            start: form.start,
            end: form.end,
            type_id: form.type_id,
            contact_info: form.contact_info,
            route: form.route,
            summary: form.summary,
            organizations: form.organizations
          }))
          .then(res => {
            saving.value = false
            if (res.data?.ok) {
              notify.success({
                title: 'រក្សាទុកព័ត៌មាន',
                description: res.data?.message || 'បានកែប្រែកិច្ចប្រជុំដោយជោគជ័យ។',
                duration: 3000
              })
              props.onClose?.(1)
            } else {
              notify.error({
                title: 'រក្សាទុកព័ត៌មាន',
                description: 'មានបញ្ហាក្នុងពេលរក្សាទុកកិច្ចប្រជុំ។',
                duration: 3000
              })
            }
          })
          .catch(error => {
            saving.value = false
            console.error(error)
            notify.error({
              title: 'រក្សាទុកព័ត៌មាន',
              description: 'មានបញ្ហាក្នុងពេលរក្សាទុកកិច្ចប្រជុំ។',
              duration: 3000
            })
          })
        return
      }

      crud.value.create(
        {
          objective: form.objective ,
          date: form.date  ,
          start: form.start ,
          end: form.end ,
          type_id: form.type_id ,
          contact_info : form.contact_info ,
          route : form.route ,
          summary : form.summary ,
          organizations: form.organizations
        },
        ( res ) => {
          switch( res.status ){
            case 200 :
            // ── Attach each selected room to the newly created meeting ──
            const newMeetingId = res.data.record?.id
            if ( Array.isArray(form.rooms) && newMeetingId ) {
              form.rooms.forEach((roomId) => {
                store.dispatch( props.model.name+'/toggleMeetingRoom', {
                  room: { id: roomId },
                  meeting: { id: newMeetingId }
                })
              })
            }
            notify.success({
              title: 'រក្សាទុកព័ត៌មាន',
              description: res.data?.message || 'បានបង្កើតកិច្ចប្រជុំដោយជោគជ័យ។',
              duration: 3000
            })
            saving.value = false
            resetForm()
            props.onClose?.(1)
          }
        },
        (error) => {
          saving.value = false
          console.error(error)
          notify.error({
            title: 'រក្សាទុកព័ត៌មាន',
            description: 'មានបញ្ហាក្នុងពេលរក្សាទុកកិច្ចប្រជុំ។',
            duration: 3000
          })
        }
      )
    }

    return {
      /**
       * Variables
       */
      formRef ,
      form ,
      saving ,
      rules ,
      typeOptions ,
      organizationOptions ,
      roomOptions ,
      isEditMode ,
      /**
       * Functions
       */
      save ,
      initial
    }
  }
}
</script>

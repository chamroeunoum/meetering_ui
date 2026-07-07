<template>
  <!--
    LoginPage — Authentication entry point for the Meeting Management System
    ទំព័រចូលប្រព័ន្ធ — ច្រកចូលសម្រាប់ប្រព័ន្ធគ្រប់គ្រងកិច្ចប្រជុំ

    This component provides:
      - Email + password authentication form (Khmer labels)
      - Enter-key submission for keyboard-first UX
      - Loading state on the submit button
      - Slide-fade entrance animation
      - Automatic redirect if already logged in
      - Desktop-first responsive layout (mobile through 2xl)
  -->
  <div class="relative flex min-h-screen justify-center">
    <!--
      Slide-fade transition: the form slides down and fades in on mount.
      Controlled by toggleLoginForm — set to true after a 200ms delay
      so the transition plays after the DOM is painted.
    -->
    <Transition name="slide-fade">
      <div v-if="toggleLoginForm" class="w-full p-8">
        <!-- ─── Logo ──────────────────────────────────────────────────── -->
        <div class="w-20 mx-auto mt-6">
          <img
            src="./../../assets/logo.svg"
            class="w-full"
            alt="Council of Ministers Logo"
          />
        </div>

        <!-- ─── Header (Khmer) ────────────────────────────────────────── -->
        <div class="text-center">
          <div class="my-2 font-moul text-yellow-500">
            ទីស្ដីការគណៈរដ្ឋមន្ត្រី
          </div>
          <div class="my-2 text-4xl font-tacteing">3</div>
          <div class="my-2 font-moul">
            {{ store.state.system.name }}
          </div>
        </div>

        <!-- ─── Login Form ────────────────────────────────────────────── -->
        <!--
          Responsive width: full on mobile → 1/4 on 2xl screens.
          The n-space wraps inputs vertically with spacing.
        -->
        <div
          class="mx-auto mt-8 w-4/5 sm:w-3/5 md:w-2/5 lg:w-2/5 xl:w-1/4 2xl:w-1/5"
        >
          <n-space vertical>
            <!-- Email Input -->
            <n-input
              round
              placeholder="អ៊ីមែល"
              v-model:value="credentials.email"
              clearable
              @keyup.enter="handleLogin"
              class="text-xs"
            >
              <template #prefix>
                <!-- Email/Mail icon (SVG inline — no external deps) -->
                <svg
                  class="text-gray-600 w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 1.95c-5.52 0-10 4.48-10 10s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8s8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57v-1.43c0-2.76-2.24-5-5-5s-5 2.24-5 5s2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47c.65.89 1.77 1.47 2.96 1.47c1.97 0 3.5-1.6 3.5-3.57v-1.43c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3z"
                    fill="currentColor"
                  />
                </svg>
              </template>
            </n-input>

            <!-- Password Input -->
            <n-input
              round
              placeholder="ពាក្យសំងាត់"
              v-model:value="credentials.password"
              type="password"
              clearable
              @keyup.enter="handleLogin"
              class="text-xs"
            >
              <template #prefix>
                <!-- Lock/Key icon (SVG inline) -->
                <svg
                  class="text-gray-600 w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <g fill="none">
                    <path
                      d="M15 6a1 1 0 1 1-2 0a1 1 0 0 1 2 0zm-2.5-4C9.424 2 7 4.424 7 7.5c0 .397.04.796.122 1.175c.058.27-.008.504-.142.638l-4.54 4.54A1.5 1.5 0 0 0 2 14.915V16.5A1.5 1.5 0 0 0 3.5 18h2A1.5 1.5 0 0 0 7 16.5V16h1a1 1 0 0 0 1-1v-1h1a1 1 0 0 0 1-1v-.18c.493.134 1.007.18 1.5.18c3.076 0 5.5-2.424 5.5-5.5S15.576 2 12.5 2zM8 7.5C8 4.976 9.976 3 12.5 3S17 4.976 17 7.5S15.024 12 12.5 12c-.66 0-1.273-.095-1.776-.347A.5.5 0 0 0 10 12.1v.9H9a1 1 0 0 0-1 1v1H7a1 1 0 0 0-1 1v.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.586a.5.5 0 0 1 .146-.353l4.541-4.541c.432-.432.522-1.044.412-1.556A4.619 4.619 0 0 1 8 7.5z"
                      fill="currentColor"
                    />
                  </g>
                </svg>
              </template>
            </n-input>
          </n-space>
        </div>

        <!-- ─── Submit Button ─────────────────────────────────────────── -->
        <div class="w-full my-8">
          <n-button
            type="success"
            class="w-24 m-2"
            :loading="loading"
            @click="handleLogin"
          >
            ចូល
            <template #icon>
              <!-- Login/Enter arrow icon -->
              <svg
                class="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
              >
                <path
                  d="M521.7 82c-152.5-.4-286.7 78.5-363.4 197.7c-3.4 5.3.4 12.3 6.7 12.3h70.3c4.8 0 9.3-2.1 12.3-5.8c7-8.5 14.5-16.7 22.4-24.5c32.6-32.5 70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8c47.9 0 94.3 9.3 137.9 27.8c42.2 17.8 80.1 43.4 112.7 75.9c32.6 32.5 58.1 70.4 76 112.5C865.7 417.8 875 464.1 875 512c0 47.9-9.4 94.2-27.8 137.8c-17.8 42.1-43.4 80-76 112.5s-70.5 58.1-112.7 75.9A352.8 352.8 0 0 1 520.6 866c-47.9 0-94.3-9.4-137.9-27.8A353.84 353.84 0 0 1 270 762.3c-7.9-7.9-15.3-16.1-22.4-24.5c-3-3.7-7.6-5.8-12.3-5.8H165c-6.3 0-10.2 7-6.7 12.3C234.9 863.2 368.5 942 520.6 942c236.2 0 428-190.1 430.4-425.6C953.4 277.1 761.3 82.6 521.7 82zM395.02 624v-76h-314c-4.4 0-8-3.6-8-8v-56c0-4.4 3.6-8 8-8h314v-76c0-6.7 7.8-10.5 13-6.3l141.9 112a8 8 0 0 1 0 12.6l-141.9 112c-5.2 4.1-13 .4-13-6.3z"
                  fill="currentColor"
                />
              </svg>
            </template>
          </n-button>
        </div>
      </div>
    </Transition>

    <!-- ─── Footer ────────────────────────────────────────────────────── -->
    <div class="fixed bottom-0 mx-auto w-full">
      <FooterComponent />
    </div>
  </div>
</template>

<script>
/**
 * LoginTemplate — Options API component for the login page
 *
 * Imports:
 *   getUser()       — Checks for existing session in localStorage
 *   setMaxUploadFilesize() — Caches server-side upload limit
 *   getRoutes()     — Returns authenticated route set after login
 *   FooterComponent — Copyright/about footer
 *   Naive UI        — n-input, n-button, n-space; message/notification toasts
 *   Vuex            — auth/login action, auth/setAuthentication mutation
 *   Vue Router      — Navigation and dynamic route management
 */

import { getUser } from '@plugins/authentication'
import { getMaxUploadFilesize, setMaxUploadFilesize } from '@plugins/file'
import { getRoutes } from '@plugins/route'
import FooterComponent from '@components/footer/copy-right.vue'
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'

export default {
  name: 'LoginTemplate',

  components: {
    FooterComponent,
  },

  setup() {
    // ─── Dependencies ──────────────────────────────────────────────────
    const store = useStore()
    const router = useRouter()
    const message = useMessage()

    // ─── Reactive State ────────────────────────────────────────────────

    /**
     * Controls the slide-fade entrance animation.
     * Set to true after a 200ms delay in onMounted so the
     * transition plays after the initial DOM render.
     * @type {import('vue').Ref<boolean>}
     */
    const toggleLoginForm = ref(false)

    /**
     * Two-way-bound login form fields.
     * Using reactive() so both email and password are tracked together.
     * @type {import('vue').Reactive<{email: string, password: string}>}
     */
    const credentials = reactive({
      email: '',
      password: '',
    })

    /**
     * Loading state for the submit button.
     * True while the API call is in flight — shows a spinner on the button.
     * @type {import('vue').Ref<boolean>}
     */
    const loading = ref(false)

    // ─── Auto-redirect if already logged in ────────────────────────────
    // If the user already has a valid session (from a previous login or
    // page reload), skip the login form and go straight to search/dashboard.
    const existingUser = getUser()
    if (existingUser !== undefined && existingUser !== null) {
      router.push('/dashboard')
    }

    // ─── Login Handler ─────────────────────────────────────────────────

    /**
     * Validate credentials and authenticate against the backend.
     *
     * Flow:
     *   1. Validate email is non-empty
     *   2. Validate password is non-empty
     *   3. Dispatch Vuex auth/login action → POST to API
     *   4. On success: store user + token, rebuild routes, redirect
     *   5. On failure: show error message
     */
    function handleLogin() {
      // --- Client-side validation ---
      if (!credentials.email) {
        message.warning(
          'សូមបញ្ចូលអ៊ីមែលរបស់អ្នក រួចព្យាយាមម្ដងទៀត បាទ។'
        )
        return
      }
      if (!credentials.password) {
        message.warning(
          'សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក រួចព្យាយាមម្ដងទៀត បាទ។'
        )
        return
      }

      loading.value = true

      // --- API call via Vuex action ---
      store
        .dispatch('auth/login', {
          email: credentials.email,
          password: credentials.password,
        })
        .then((res) => {
          // --- Success path ---
          if (res.data.ok) {
            // 1. Persist user and token in Vuex + localStorage
            store.commit('auth/setAuthentication', {
              user: res.data.record,
              token: res.data.token,
            })

            // 2. Cache the server-configured max upload size
            if (res.data.upload_max_filesize) {
              setMaxUploadFilesize(
                parseFloat(res.data.upload_max_filesize.replace('M', ''))
              )
            }

            // 3. Rebuild routes for the authenticated user
            //    Remove all existing routes, then add the authenticated set.
            const currentRoutes = router.getRoutes()
            for (const route of currentRoutes) {
              if (router.hasRoute(route.name)) {
                router.removeRoute(route.name)
              }
            }
            const authRoutes = getRoutes()
            for (const route of authRoutes) {
              router.addRoute(route)
            }

            // 4. Welcome the user and redirect to home
            message.success('សូមស្វាគមន៍ !')
            router.push('/')
          } else {
            // --- Server rejected the credentials ---
            message.error(res.data.message || 'ការចូលបរាជ័យ')
          }
          loading.value = false
        })
        .catch((err) => {
          // --- Network or server error ---
          loading.value = false

          if (err.response) {
            // Server responded with an error status (4xx, 5xx)
            console.error('[Login] Server error:', err.response.status, err.response.data)

            let errorDetail = `${err.response.status}: ${err.response.statusText}.`

            // Collect field-level validation errors from the API response
            if (err.response.data?.errors) {
              for (const key in err.response.data.errors) {
                errorDetail += ' ' + err.response.data.errors[key]
              }
            }

            message.error(
              (err.response.data?.message || 'Server error') +
                ' ( ' + errorDetail + ' ) '
            )
          } else {
            // Network error (no response from server — offline, CORS, etc.)
            console.error('[Login] Network error:', err)
            message.error(
              'មិនអាចភ្ជាប់ទៅម៉ាស៊ីនមេបានទេ។ សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិតរបស់អ្នក។'
            )
          }
        })
    }

    // ─── Lifecycle ─────────────────────────────────────────────────────

    /**
     * On mount: trigger the slide-fade entrance animation after a
     * brief delay so the browser has time to paint the initial layout.
     */
    onMounted(() => {
      setTimeout(() => {
        toggleLoginForm.value = true
      }, 200)
    })

    // ─── Template Bindings ─────────────────────────────────────────────
    return {
      credentials,
      loading,
      store,
      toggleLoginForm,
      handleLogin,
    }
  },
}
</script>

<style scoped>
/* ─── Base App Styles ─────────────────────────────────────────────────── */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 0.8rem;
}

/* ─── Transition: Fade ────────────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ─── Transition: Slide-Fade ────────────────────────────────────────────
   Used for the login form entrance — slides down and fades in. */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

/* ─── Transition: Bounce ──────────────────────────────────────────────── */
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>

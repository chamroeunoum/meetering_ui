/**
 * Route Plugin — Dynamic route configuration
 *
 * This module defines available routes for both authenticated and
 * unauthenticated users. The getRoutes() function returns the appropriate
 * set based on the current auth state (checked via isAuth()).
 *
 * Route Architecture:
 *   - Unauthenticated: Login, Welcome TV templates, Officer card + check-in, 404
 *   - Authenticated:   Dashboard, Attendants, Meetings, Tasks, Cards, Folders,
 *                      Profile, Password change, TV templates, 404
 *
 * All routes use lazy-loaded component imports (static imports at module level)
 * so the full code-split happens at the route level.
 *
 * @module plugins/route
 */

import { isAdmin, isAuth } from './authentication'

// ─── Component Imports ─────────────────────────────────────────────────────

import LoginComponent from '../layouts/login/index.vue'
import WelcomeComponent from '../layouts/welcome/template1.vue'

// TV display templates (public meeting schedule boards)
import ScheduleMeetingTV1Component from '../layouts/welcome/template1.vue'
import ScheduleMeetingTV2Component from '../layouts/welcome/template2.vue'
import ScheduleMeetingTV3Component from '../layouts/welcome/template3.vue'
import ScheduleMeetingTV4Component from '../layouts/welcome/template4.vue'

// User management
import UserComponent from '../components/user/index.vue'
import UserListComponent from '../components/user/list.vue'
import UserProfileComponent from '../components/user/profile.vue'
import PasswordChangeComponent from '../components/user/password_change.vue'

// Dashboard
import DashboardComponent from '../layouts/dashboard/index.vue'
import DashboardWidget from '../components/main/dashboard.vue'

// Staff / Officer
import DetailCardComponent from '../layouts/staff/card.vue'

// QR Check-in/out
import QrCheckinAndCheckoutComponent from '../layouts/checkinout/check.vue'
import QrCheckinAndCheckoutSuccessComponent from '../layouts/checkinout/success.vue'

// Folder management
import FolderComponent from '../components/folder/index.vue'
import FolderThumbnailComponent from '../components/folder/crud/lists/thumbnail.vue'

// Regulator management (commented out — feature disabled)
// import RegulatorComponent from '../components/regulator/index.vue'
// import RegulatorThumbnailComponent from '../components/regulator/crud/lists/thumbnail.vue'

// Attendant (staff attendance)
import AttendantShiftComponent from '../components/attendant/shift/index.vue'
import AttendantShiftListComponent from '../components/attendant/shift/list.vue'
import AttendantShiftDayComponent from '../components/attendant/shift/today.vue'

import AttendantNoShiftComponent from '../components/attendant/noshift/index.vue'
import AttendantNoShiftListComponent from '../components/attendant/noshift/list.vue'
import AttendantNoShiftDayComponent from '../components/attendant/noshift/today.vue'

// Task management
import TaskComponent from '../components/task/index.vue'
import TaskListComponent from '../components/task/list.vue'

// Card (ID card) management
import CardComponent from '../components/card/index.vue'
import CardThumbnailComponent from '../components/card/crud/lists/thumbnail.vue'
import CardInfoComponent from '../components/card/crud/lists/card.vue'

// Room management
import RoomComponent from '../components/room/index.vue'
import RoomListComponent from '../components/room/list.vue'
import RoomDetailComponent from '../components/room/detail.vue'

// Meeting management
import MeetingComponent from '../components/meeting/index.vue'
import MeetingThumbnailComponent from '../components/meeting/crud/lists/thumbnail.vue'
import MeetingDetailComponent from '../components/meeting/crud/lists/detail.vue'
import DraftViewerComponent from '../components/meeting/crud/lists/draft-viewer.vue'
import DraftTimelineComponent from '../components/meeting/crud/lists/timeline.vue'

// Error page
import Page404 from '../components/errors/404.vue'

// ─── Route Set Builder ─────────────────────────────────────────────────────

/**
 * Return the appropriate route set based on authentication state.
 *
 * The route set is completely different depending on whether the user
 * is logged in. This is intentional — we want to minimize the attack
 * surface for unauthenticated users by not exposing internal route
 * definitions.
 *
 * @returns {Array<Object>} Array of Vue Router route config objects
 */
export function getRoutes() {
  if (isAuth()) {
    return getAuthenticatedRoutes()
  }
  return getUnauthenticatedRoutes()
}

// ─── Authenticated Routes ──────────────────────────────────────────────────

/**
 * Routes available to logged-in users.
 * All internal CRUD operations are gated behind these routes.
 */
function getAuthenticatedRoutes() {
  return [
    // Root redirect → Dashboard
    {
      path: '',
      name: 'EmptyURI',
      redirect: () => '/dashboard',
    },
    {
      path: '/',
      name: 'RootURI',
      redirect: () => '/dashboard',
    },

    // ── Attendants (no-shift mode) ─────────────────────────────────────
    {
      name: 'AttendantNoShift',
      path: '/attendants',
      component: AttendantNoShiftComponent,
      meta: {
        transition: 'slide-right',
        requiresAuth: true,
      },
      children: [
        {
          name: 'AttendantNoShiftToday',
          path: '',
          component: AttendantNoShiftDayComponent,
        },
        {
          name: 'AttendantNoShiftMonth',
          path: 'month',
          component: AttendantNoShiftListComponent,
        },
        {
          name: 'AttendantNoShiftDay',
          path: 'today',
          component: AttendantNoShiftDayComponent,
        },
      ],
    },

    // ── Meetings ───────────────────────────────────────────────────────
    {
      name: 'Meeting',
      path: '/meetings',
      component: MeetingComponent,
      meta: {
        transition: 'slide-right',
        requiresAuth: true,
      },
      children: [
        {
          name: 'MeetingThumbnail',
          path: '',
          component: MeetingThumbnailComponent,
        },
        {
          name: 'MeetingDetail',
          path: ':id',
          component: MeetingDetailComponent,
        },
        {
          name: 'DraftViewer',
          path: ':meeting_id/draft/:draft_id',
          component: DraftViewerComponent,
        },
        {
          name: 'DraftTimeline',
          path: ':meeting_id/timeline',
          component: DraftTimelineComponent,
        },
      ],
    },

    // ── Tasks ──────────────────────────────────────────────────────────
    {
      name: 'Task',
      path: '/tasks',
      component: TaskComponent,
      meta: {
        transition: 'slide-right',
        requiresAuth: true,
        is_admin: true,
      },
      children: [
        {
          name: 'TaskList',
          path: '',
          component: TaskListComponent,
        },
      ],
    },

    // ── Cards ──────────────────────────────────────────────────────────
    {
      name: 'Card',
      path: '/cards',
      component: CardComponent,
      meta: {
        transition: 'slide-right',
        requiresAuth: true,
        is_admin: true,
      },
      children: [
        {
          name: 'CardInfo',
          path: '',
          component: CardInfoComponent,
        },
      ],
    },

    // ── Rooms ──────────────────────────────────────────────────────────
    {
      name: 'Room',
      path: '/rooms',
      component: RoomComponent,
      meta: {
        transition: 'slide-right',
        requiresAuth: true,
      },
      children: [
        {
          name: 'RoomList',
          path: '',
          component: RoomListComponent,
        },
        {
          name: 'RoomDetail',
          path: ':id',
          component: RoomDetailComponent,
        },
      ],
    },

    // ── Folders ────────────────────────────────────────────────────────
    {
      name: 'Folder',
      path: '/folders',
      component: FolderComponent,
      meta: {
        transition: 'slide-right',
        requiresAuth: true,
        is_admin: true,
      },
      children: [
        {
          name: 'FolderThumbnail',
          path: '',
          component: FolderThumbnailComponent,
        },
      ],
    },

    // ── Dashboard ──────────────────────────────────────────────────────
    {
      name: 'Dashboard',
      path: '/dashboard',
      component: DashboardComponent,
      children: [
        {
          name: 'DashboardWidget',
          path: '',
          component: DashboardWidget,
        },
      ],
    },

    // ── Users ──────────────────────────────────────────────────────────
    {
      name: 'User',
      path: '/users',
      component: UserComponent,
      meta: {
        transition: 'slide-right',
        requiresAuth: true,
        is_admin: true,
      },
      children: [
        {
          name: 'UserList',
          path: '',
          component: UserListComponent,
        },
      ],
    },

    // ── User Profile ───────────────────────────────────────────────────
    {
      name: 'UserProfile',
      path: '/profile',
      component: UserProfileComponent,
    },
    {
      name: 'UserPasswordChange',
      path: '/password/change',
      component: PasswordChangeComponent,
    },

    // ── Welcome / TV Templates ─────────────────────────────────────────
    {
      name: 'Welcome',
      path: '/welcome',
      component: WelcomeComponent,
    },
    {
      name: 'ScheduleMeetingTV1',
      path: '/tvtemplate1',
      component: ScheduleMeetingTV1Component,
    },
    {
      name: 'ScheduleMeetingTV2',
      path: '/tvtemplate2',
      component: ScheduleMeetingTV2Component,
    },
    {
      name: 'ScheduleMeetingTV3',
      path: '/tvtemplate3',
      component: ScheduleMeetingTV3Component,
    },
    {
      name: 'ScheduleMeetingTV4',
      path: '/tvtemplate4',
      component: ScheduleMeetingTV4Component,
    },

    // ── Officer Card ───────────────────────────────────────────────────
    {
      name: 'OfficerCard',
      path: '/officer/card/:id',
      component: DetailCardComponent,
    },

    // ── 404 Catch-all ──────────────────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: Page404,
    },
  ]
}

// ─── Unauthenticated Routes ────────────────────────────────────────────────

/**
 * Routes available to guests (not logged in).
 * Only exposes public-facing pages: login, TV templates, officer cards,
 * and the QR check-in/out flow.
 */
function getUnauthenticatedRoutes() {
  return [
    // Root redirect → Login
    {
      path: '',
      name: 'EmptyURI',
      redirect: () => '/login',
    },
    {
      path: '/',
      name: 'RootURI',
      redirect: () => '/login',
    },

    // ── Login ──────────────────────────────────────────────────────────
    {
      name: 'Login',
      path: '/login',
      component: LoginComponent,
    },

    // ── Welcome / TV Templates (public) ────────────────────────────────
    {
      name: 'Welcome',
      path: '/welcome',
      component: WelcomeComponent,
    },
    {
      name: 'ScheduleMeetingTV1',
      path: '/tvtemplate1',
      component: ScheduleMeetingTV1Component,
    },
    {
      name: 'ScheduleMeetingTV2',
      path: '/tvtemplate2',
      component: ScheduleMeetingTV2Component,
    },
    {
      name: 'ScheduleMeetingTV3',
      path: '/tvtemplate3',
      component: ScheduleMeetingTV3Component,
    },
    {
      name: 'ScheduleMeetingTV4',
      path: '/tvtemplate4',
      component: ScheduleMeetingTV4Component,
    },

    // ── Officer Card (public) ──────────────────────────────────────────
    {
      name: 'OfficerCard',
      path: '/officer/card/:id',
      component: DetailCardComponent,
    },

    // ── QR Check-in/out (public — used by staff scanning QR codes) ─────
    {
      name: 'QrCheckinAndCheckout',
      path: '/officer/checkinout/:id',
      component: QrCheckinAndCheckoutComponent,
    },
    {
      name: 'QrCheckinAndCheckoutSuccess',
      path: '/officer/attendant/check/:id/success',
      component: QrCheckinAndCheckoutSuccessComponent,
    },

    // ── 404 Catch-all ──────────────────────────────────────────────────
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: Page404,
    },
  ]
}

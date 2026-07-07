/**
 * Vue Router — Application routing with auth-aware route sets
 *
 * Architecture:
 *   - Uses hash-based history (createWebHashHistory) for Electron compatibility
 *   - Dynamically returns authenticated vs. unauthenticated route sets via getRoutes()
 *   - On login, all existing routes are removed and rebuilt with the authenticated set
 *   - On logout, the page redirects to /login and the unauthenticated routes are rebuilt
 *
 * Route Guards:
 *   - beforeEach: Redirects unauthenticated users to /login for protected routes
 *   - The guard runs after every route change to keep the app secure
 *
 * @module router
 */

import { createRouter, createWebHashHistory } from 'vue-router'
import { isAuth, isAdmin as checkAdmin } from './plugins/authentication' // UPDATED: static import replaces require()
import { getRoutes } from './plugins/route'

// ─── Router Instance ───────────────────────────────────────────────────────
const router = createRouter({
  history: createWebHashHistory(),
  routes: getRoutes(), // Initial route set (unauthenticated by default)
})

// ─── Navigation Guard ──────────────────────────────────────────────────────

/**
 * Global beforeEach guard — enforces authentication on protected routes.
 *
 * Logic:
 *   1. If the user is authenticated → allow navigation
 *   2. If the route requires auth (meta.requiresAuth) and user is NOT authenticated → redirect to /login
 *   3. If the route requires admin (meta.is_admin) and user is NOT admin → redirect to /dashboard
 *   4. Otherwise → allow navigation
 */
router.beforeEach((to, from, next) => {
  const authenticated = isAuth()

  // If the route requires authentication and the user isn't logged in,
  // redirect them to the login page.
  if (to.meta.requiresAuth && !authenticated) {
    return next({ name: 'Login' })
  }

  // If the route requires admin privileges, check that too.
  // UPDATED: uses static import at top of file instead of require()
  if (to.meta.is_admin && authenticated) {
    if (!checkAdmin()) {
      return next({ name: 'Dashboard' })
    }
  }

  // If the user is already authenticated and tries to visit /login,
  // redirect them to the dashboard instead.
  if (authenticated && to.name === 'Login') {
    return next({ name: 'Dashboard' })
  }

  // Allow the navigation
  next()
})

export default router

<template>
  <n-config-provider :theme="naiveTheme">
    <n-dialog-provider>
      <n-message-provider placement="top">
        <n-notification-provider placement="top">
          <router-view v-slot="{ Component, route }">
            <transition :name="route.meta.transition || ''">
              <component :is="Component" />
            </transition>
          </router-view>
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup>
import { useTheme } from './composables/useTheme'

const { naiveTheme } = useTheme()
</script>

<style>
/* ─── App Base Styles ───────────────────────────────── */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-size: 0.8rem;
}

/* ─── Dark Mode CSS Variables ────────────────────────── */
/* These apply to ALL custom components (not just NaiveUI) */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-card: #ffffff;
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --text-muted: #9ca3af;
  --border-color: #e5e7eb;
  color-scheme: light;
}

html.dark {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --bg-card: #1f2937;
  --text-primary: #f3f4f6;
  --text-secondary: #d1d5db;
  --text-muted: #6b7280;
  --border-color: #374151;
  color-scheme: dark;
}

/* ─── Body & HTML Background (theme-aware) ──────────── */
html, body {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  transition: background-color 0.25s ease, color 0.25s ease;
}

#app {
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

/* ─── Transition for theme changes ───────────────────── */
* {
  transition-property: background-color, border-color, color;
  transition-duration: 0.15s;
  transition-timing-function: ease;
}

/* ─── Theme-aware utility classes ────────────────────── */
.bg-primary { background-color: var(--bg-primary); }
.bg-secondary { background-color: var(--bg-secondary); }
.bg-card { background-color: var(--bg-card); }
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-muted { color: var(--text-muted); }
.border-default { border-color: var(--border-color); }

.sidebar-panel { background-color: var(--bg-card); }
.sidebar-item { color: var(--text-secondary); }
.sidebar-item:hover { background-color: color-mix(in srgb, var(--text-primary) 5%, transparent); }
.sidebar-item.active { background-color: color-mix(in srgb, #3b82f6 10%, transparent); color: #3b82f6; }
</style>

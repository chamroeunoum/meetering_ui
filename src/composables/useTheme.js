import { ref, computed } from 'vue'
import { darkTheme } from 'naive-ui'

const STORAGE_KEY = 'app-theme'

// ─── Module-level singleton state ──────────────────────────
const isDark = ref(false)

// ─── Apply .dark class to <html> ───────────────────────────
function applyDarkClass(val) {
  if (val) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// ─── Immediately apply saved theme on module load ──────────
try {
  const saved = localStorage.getItem(STORAGE_KEY)
  isDark.value = saved === 'dark'
  applyDarkClass(isDark.value)
} catch (_) {}

// ─── NaiveUI theme (reactive) ──────────────────────────────
const naiveTheme = computed(() => (isDark.value ? darkTheme : null))

// ─── Public API ────────────────────────────────────────────
export function useTheme() {
  function toggleTheme() {
    const newVal = !isDark.value
    isDark.value = newVal
    applyDarkClass(newVal)
    try {
      localStorage.setItem(STORAGE_KEY, newVal ? 'dark' : 'light')
    } catch (_) {}
  }

  return { isDark, naiveTheme, toggleTheme }
}

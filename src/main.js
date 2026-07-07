/**
 * Application Entry Point
 *
 * Bootstraps the Vue 3 application with all required plugins:
 *   - Vuex state management (Pinia removed — was unused and redundant)
 *   - Vue Router with hash-based history (Electron compatibility)
 *   - NaiveUI component library
 *   - Khmer number/date localization plugins
 *   - HTML-to-print plugin
 *   - QR code reader plugin
 *
 * @module main
 */

import { createApp } from 'vue'
// UPDATED: Removed createPinia — Pinia was unused, Vuex is the active state manager

import axios from 'axios'
import VueAxios from 'vue-axios'

import VueQrcodeReader from "vue3-qrcode-reader"

import KhmerNumber from './plugins/kh/number.js'
import KhmerDate from './plugins/kh/date.js'

import NaiveUI from 'naive-ui'

import App from './App.vue'

import "tailwindcss/tailwind.css"

import "./app.css"

import store from './store'

import router from './router.js'

import HtmlToPaper from "./plugins/htmltopeper.js"

const app = createApp(App) // UPDATED: Pinia createPinia() removed — unused

// app.config.errorHandler = (err, vm, info) => {
//   // handle error
//   // `info` is a Vue-specific error info, e.g. which lifecycle hook
//   // the error was found in
// }

// app.config.warnHandler = function(msg, vm, trace) {
//   // `trace` is the component hierarchy trace
// }

app.use(VueAxios, axios)
app.use(VueQrcodeReader)
app.use(NaiveUI)
app.use(HtmlToPaper)
app.use(KhmerNumber)
app.use(KhmerDate)
app.use(store) // Vuex store — the single state management solution
app.use(router)
app.mount('#app')
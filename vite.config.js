/**
 * Vite Configuration
 *
 * Sets up:
 *   - Vue SFC compiler plugin
 *   - Path aliases for clean imports (@, @api, @components, etc.)
 *   - Dev server bound to localhost:3001
 *
 * @see https://vite.dev/config/
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// UPDATED: Removed unused 'styleImport' import
import path from 'path'

export default defineConfig({
  plugins: [vue()], // UPDATED: only Vue plugin; styleImport was never used
  resolve: {
    alias: {
        '@': path.resolve(__dirname, './src'),
        '@api': path.resolve(__dirname, './src/api'),
        '@components': path.resolve(__dirname, './src/components'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@classes': path.resolve(__dirname, './src/classes'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@plugins': path.resolve(__dirname, './src/plugins')
    }
  },
  server: {
      host: '127.0.0.1',
      // host: '172.16.0.235',
      port: 3002
  }
})

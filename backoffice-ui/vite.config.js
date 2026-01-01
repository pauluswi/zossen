import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the Spring Boot backend
      '/mock-idp': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/backoffice': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/ztrust': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})

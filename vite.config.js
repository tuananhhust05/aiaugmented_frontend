import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],
  server: {
    port: 3003,
    host: '0.0.0.0', // Allow access from network (IPv4)
    open: true
  }
})


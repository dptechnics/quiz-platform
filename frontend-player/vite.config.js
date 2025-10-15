import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 8080,
    host: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3333",
        changeOrigin: true
      },
      "/socket.io": {
        target: "ws://127.0.0.1:3333",
        ws: true,
        changeOrigin: true
      },
    }
  },
  plugins: [
    react()
  ],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 8082,
    host: true,
    proxy: {
      "/api": {
        target: "https://present.quiz.dptechnics.com",
        changeOrigin: true
      },
      "/socket.io": {
        target: "wss://present.quiz.dptechnics.com",
        ws: true,
        changeOrigin: true
      },
    }
  },
  plugins: [
    react()
  ],
})

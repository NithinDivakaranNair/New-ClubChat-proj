import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        // Change the target to your new deployed URL
        target: "https://www.threadd.xyz",
        changeOrigin: true,
        secure: true,  // Since you're using HTTPS, this should be true
      },
    },
  },
})

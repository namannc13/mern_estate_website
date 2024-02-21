import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

import dotenv from "dotenv"

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/server': {
        target: `${proccess.env.SERVER_API}`,
        secure: false
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

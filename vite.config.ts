import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Honor a port assigned via the PORT env var (used by the preview
    // launcher's autoPort); fall back to Vite's default 5173 for `npm run dev`.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
  },
})

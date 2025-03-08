import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
plugins: [
  react(),
  tailwindcss(),
],
 preview: {
  port: 3000,
  strictPort: true,
 },
 server: {
  watch: {
    usePolling: true,
  },
  host: true,
  strictPort: true,
  port: 5173,
}
})



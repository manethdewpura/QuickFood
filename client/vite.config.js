import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  base: '/',
  server: {
    port: 3005,
    open: true,
    allowedHosts: ['famous-trees-wish.loca.lt']
  }
})
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//    base: './',
//   plugins: [react()],
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // ✅ important for Render
  plugins: [react()],
  build: {
    outDir: 'dist', // ✅ ensure build output goes to dist
  },
  server: {
    port: 3000, // optional, just for local dev
  },
})

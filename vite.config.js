import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [react(),  tailwindcss(),],
  resolve: {
    alias: {
      '@': '/src',
      'datatables.net-dt': path.resolve(__dirname, 'node_modules/datatables.net-dt'),
      'jquery': path.resolve(__dirname, 'node_modules/jquery')
    },
  },
  optimizeDeps: {
    include: ['jquery', 'datatables.net', 'datatables.net-dt']
  },
  build: {
    commonjsOptions: {
      include: [/jquery/, /datatables/]
    }
  }
})

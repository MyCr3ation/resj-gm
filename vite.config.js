import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/dynamic': path.resolve(__dirname, './src/lib/next-mock/dynamic.jsx'),
      'next-intl': path.resolve(__dirname, './src/lib/next-mock/next-intl.jsx'),
      'next/link': path.resolve(__dirname, './src/lib/next-mock/link.jsx'),
    },
  },
})

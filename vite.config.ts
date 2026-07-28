import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths()
  ],
  build: {
    target: 'ES2020',
    minify: 'esbuild',
    sourcemap: false,
    outDir: 'dist'
  }
})
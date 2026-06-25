import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

import path from 'node:path'

export default defineConfig({

  plugins: [
    react()
  ],

  resolve: {

    alias: {

      '@': path.resolve(__dirname, './src'),

      '@components': path.resolve(__dirname, './src/components'),

      '@services': path.resolve(__dirname, './src/services'),

      '@styles': path.resolve(__dirname, './src/styles'),

      '@hooks': path.resolve(__dirname, './src/hooks'),

      '@app-types': path.resolve(__dirname, './src/types'),

      '@utils': path.resolve(__dirname, './src/utils'),

      '@domain': path.resolve(__dirname, './src/domain'),

      '@core': path.resolve(__dirname, './src/core'),

      '@adapters': path.resolve(__dirname, './src/adapters'),

      '@features': path.resolve(__dirname, './src/features')

    }

  },

  build: {

    target: 'ES2020',

    minify: 'esbuild',

    sourcemap: false,

    outDir: 'dist'

  }

})
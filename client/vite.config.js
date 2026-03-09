import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // All /api calls → Express backend (env vars stay server-side)
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,        // no source maps in production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          three:  ['three'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    minify: 'esbuild',
    outDir: 'dist', // Ensures Netlify deploys the right folder
    assetsDir: 'assets', // Organizes assets properly
    // Ensures proper MIME types by being explicit about file extensions
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'animation-vendor': ['framer-motion', 'gsap'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three'],
  },
  server: {
    fs: {
      strict: false,
    },
  },
  esbuild: {
    legalComments: 'none', // Removes comments to reduce build size
  },
});

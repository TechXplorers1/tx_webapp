import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  build: {
    // Warn only if any single chunk exceeds 700 KB
    chunkSizeWarningLimit: 700,

    rollupOptions: {
      output: {
        /**
         * manualChunks splits the 11 MB single bundle into smaller,
         * separately-cacheable files. Once a user has downloaded a chunk,
         * it stays cached even after you redeploy (as long as those libs
         * haven't changed).
         */
        manualChunks: {
          // Core React runtime — tiny, almost never changes
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Firebase SDK — only downloaded once, cached long-term
          'firebase-vendor': [
            'firebase/app',
            'firebase/auth',
            'firebase/database',
            'firebase/storage',
          ],

          // Bootstrap UI — large but rarely changes
          'bootstrap-vendor': ['bootstrap', 'react-bootstrap'],

          // Chart libraries — only loaded on dashboard pages
          'chart-vendor': ['chart.js', 'react-chartjs-2'],

          // Map libraries — only loaded on landing page / contact
          'map-vendor': ['leaflet', 'react-leaflet'],

          // Icon libraries — large, but cached after first load
          'icons-vendor': ['react-icons', 'lucide-react'],

          // Excel export — only loaded when user clicks "Export"
          'xlsx-vendor': ['xlsx'],

          // Animation — separate so it can be cached independently
          'animation-vendor': ['framer-motion', 'aos'],

          // Phone/country input — only on forms
          'form-vendor': [
            'react-phone-input-2',
            'react-datepicker',
            'country-state-city',
          ],
        },
      },
    },
  },
})

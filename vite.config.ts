import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: true
      },
      manifest: {
        "short_name": "CareLinks",
        "name": "CareLinks - Community Health",
        "icons": [
          {
            "src": "/favicon.ico",
            "sizes": "64x64 32x32 24x24 16x16",
            "type": "image/x-icon"
          },
          {
            "src": "/logo192.png",
            "type": "image/png",
            "sizes": "192x192"
          },
          {
            "src": "/logo512.png",
            "type": "image/png",
            "sizes": "512x512"
          }
        ],
        "start_url": ".",
        "display": "standalone",
        "theme_color": "#007bff",
        "background_color": "#ffffff"
      }
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // This ensures process.env is available in the client
    'process.env': {}
  },
  server: {
    port: 5173, // Set a consistent port
  }
});

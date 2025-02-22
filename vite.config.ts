import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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

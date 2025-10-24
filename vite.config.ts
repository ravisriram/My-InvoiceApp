import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [],
    },
    exclude: ['lucide-react'],
  },
  base: '/My-InvoiceApp', // GitHub Pages path
});

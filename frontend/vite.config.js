import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => {
          // Strip '/api' prefix: /api/posts → /posts
          console.log(`[Vite Proxy] Rewriting: ${path} → ${path.replace(/^\/api/, '')}`);
          return path.replace(/^\/api/, '');
        },
      },
    },
  },
});

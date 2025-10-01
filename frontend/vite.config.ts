import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

const resolveFromRoot = (relativePath: string) =>
  decodeURIComponent(new URL(relativePath, import.meta.url).pathname);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolveFromRoot('./src'),
      '@app': resolveFromRoot('./src/app'),
      '@entities': resolveFromRoot('./src/entities'),
      '@features': resolveFromRoot('./src/features'),
      '@mock': resolveFromRoot('./src/mock'),
      '@pages': resolveFromRoot('./src/pages'),
      '@shared': resolveFromRoot('./src/shared'),
      '@widgets': resolveFromRoot('./src/widgets'),
    },
  },
});

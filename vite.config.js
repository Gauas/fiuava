import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: 'public/assets/fiuava',
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        introduce: resolve(__dirname, 'introduce/index.html'),
        about: resolve(__dirname, 'about/index.html'),
        survey: resolve(__dirname, 'survey/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
      },
    },
  },
});

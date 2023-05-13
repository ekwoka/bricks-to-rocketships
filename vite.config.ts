import { defineConfig } from 'vite';

import { resolve } from 'node:path';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

export default defineConfig({
  root,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        mpa: resolve(root, 'mpa', 'index.html'),
        mpaCart: resolve(root, 'mpa', 'cart', 'index.html'),
      },
    },
  },
});

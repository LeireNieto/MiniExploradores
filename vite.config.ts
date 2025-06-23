import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // 👈 esto es lo más importante
    globals: true,         // para que no tengas que importar describe, test, expect en cada archivo
  },
});


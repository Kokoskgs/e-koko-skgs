
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Gantikan 'e-koko-skgs' dengan nama repository anda jika berbeza
export default defineConfig({
  plugins: [react()],
  base: './', 
  build: {
    outDir: 'dist',
  }
});

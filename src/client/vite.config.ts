import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';

export default defineConfig({
  plugins: [
    sveltekit(),
    svelteTesting(),
    image(),
    json(),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  },
  ssr: {
    noExternal: ['three']
  },
  build: {
    rollupOptions: {
      // Exclude bun.lockb or any other binary files
      external: ['bun.lockb']
    }
  }
});



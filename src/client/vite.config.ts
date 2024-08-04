import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import { visualizer } from 'rollup-plugin-visualizer';
import { terser } from 'rollup-plugin-terser';

export default defineConfig({
  plugins: [
    sveltekit(),
    svelteTesting(),
    image(),
    json(),
    visualizer({ filename: './stats.html' }), // Analyze bundle size
    terser() // Minify JavaScript
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
    sourcemap: false, // Remove source maps
    rollupOptions: {
      // Exclude bun.lockb or any other binary files
      external: ['bun.lockb'],
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    }
  }
});



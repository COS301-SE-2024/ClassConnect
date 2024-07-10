/// <reference types="vitest" />

import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html']
		}
	},
	ssr: {
		noExternal: ['three']
	}
});

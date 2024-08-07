import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import viteCompression from 'vite-plugin-compression'; // For compressing output files
import viteImageMin from 'vite-plugin-imagemin'; // For optimizing images

export default defineConfig({
	plugins: [
		sveltekit(),
		svelteTesting(),
		image(),
		json(),
		terser(), // Minify JavaScript
		viteCompression(), // Compress output files
		viteImageMin({
			// Optimize images
			gifsicle: {
				optimizationLevel: 7
			},
			optipng: {
				optimizationLevel: 7
			},
			mozjpeg: {
				quality: 20
			},
			pngquant: {
				quality: [0.65, 0.8],
				speed: 4
			},
			svgo: {
				plugins: [
					{
						name: 'removeViewBox',
						active: false
					},
					{
						name: 'addAttributesToSVGElement',
						params: {
							attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }]
						}
					}
				]
			}
		})
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
			external: ['bun.lockb'], // Exclude bun.lockb or any other binary files
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return id.toString().split('node_modules/')[1].split('/')[0].toString();
					}
				}
			}
		}
	},
	optimizeDeps: {
		include: [
			'svelte',
			'@lucia-auth/adapter-mongodb',
			'@node-rs/argon2',
			'@sendgrid/mail',
			'@stream-io/node-sdk',
			'@stream-io/video-client',
			'@threlte/core',
			'@threlte/extras',
			'@types/canvas-confetti',
			'aws-sdk',
			'axios',
			'bcrypt',
			'canvas-confetti',
			'mongodb',
			'mongoose',
			'playroomkit',
			'stream-chat',
			'svelte-french-toast',
			'svelte-tweakpane-ui',
			'three'
		]
	}
});

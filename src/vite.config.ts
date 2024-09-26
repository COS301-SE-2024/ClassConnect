import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import viteImageMin from 'vite-plugin-imagemin';
import fs from 'fs';
import path from 'path';

export default defineConfig(({ mode }) => {
	const isProduction = mode === 'production';

	return {
		plugins: [
			sveltekit(),
			svelteTesting(),
			image(),
			json(),
			terser(),
			viteImageMin({
				gifsicle: { optimizationLevel: 7 },
				optipng: { optimizationLevel: 7 },
				mozjpeg: { quality: 20 },
				pngquant: { quality: [0.65, 0.8], speed: 4 },
				svgo: {
					plugins: [
						{ name: 'removeViewBox', active: false },
						{
							name: 'addAttributesToSVGElement',
							params: { attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }] }
						}
					]
				}
			})
		],
		test: {
			globals: true,
			environment: 'jsdom',
			setupFiles: ['./vitest-setup.ts'],
			coverage: { reporter: ['text', 'json', 'html'] }
		},
		ssr: { noExternal: ['three'] },
		build: {
			sourcemap: false,
			rollupOptions: { external: ['bun.lockb'] }
		},
		...(isProduction
			? {}
			: {
					server: {
						https: {
							key: fs.readFileSync(path.resolve(__dirname, 'certs/key.pem')),
							cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem'))
						},
						host: 'localhost',
						port: 5173,
						proxy: {}
					}
				})
	};
});

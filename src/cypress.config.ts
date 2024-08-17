import { defineConfig } from 'cypress';

export default defineConfig({
	component: {
		devServer: {
			framework: 'svelte',
			bundler: 'vite'
		},
		typescript: {
			configFile: './tsconfig.json'
		}
	},

	e2e: {}
});

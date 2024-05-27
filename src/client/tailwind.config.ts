const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');

const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./src/**/*.{ts,tsx}'
	],

	plugins: [require('@tailwindcss/typography'), require('flowbite/plugin'), addVariablesForColors],

	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				primary: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				}
			},
			animation: {
				aurora: 'aurora 60s linear infinite'
			},
			keyframes: {
				aurora: {
					from: {
						backgroundPosition: '50% 50%, 50% 50%'
					},
					to: {
						backgroundPosition: '350% 50%, 350% 50%'
					}
				}
			}
		}
	}
};

module.exports = config;

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
	const allColors = flattenColorPalette(theme('colors'));
	const newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	);

	addBase({
		':root': newVars
	});
}

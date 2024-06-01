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
					'50': '#f0fdf4',
					'100': '#dcfce7',
					'200': '#bbf7d0',
					'300': '#86efac',
					'400': '#4ade80',
					'500': '#22c55e',
					'600': '#16a34a',
					'700': '#15803d',
					'800': '#166534',
					'900': '#14532d'
				},
				lightBgColor: '#F7F7F7',
				lightTextColor: '#000000',
				lightSysNavBgColor: '#F7F7F7',
				lightSelColor: '#0E674D',
				lightlinkColor: '#284cdc',
				lightPresence: '#20A271',
				lightNotifications: '#20A271'
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

import { render } from '@testing-library/svelte';
import { describe, it, beforeEach, expect } from 'vitest';
import ControlPanel from '$lib/components/lesson/ControlPanel.svelte';

describe('CallControls', () => {
	let component: any;

	beforeEach(() => {
		component = render(ControlPanel);
	});

	it('renders Mic button', () => {
		const { getByText } = component;
		expect(getByText('Mic')).toBeInTheDocument();
	});

	it('renders Camera button', () => {
		const { getByText } = component;
		expect(getByText('Camera')).toBeInTheDocument();
	});

	it('renders Share Screen button', () => {
		const { getByText } = component;
		expect(getByText('Share Screen')).toBeInTheDocument();
	});

	it('renders End Call button', () => {
		const { getByText } = component;
		expect(getByText('End Call')).toBeInTheDocument();
	});
});

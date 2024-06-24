import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import ModuleCard from '$lib/components/utils/student/+HomeCard.svelte';
import { module } from '$lib/store';
import { goto } from '$app/navigation';

vi.mock('$lib/store', () => ({
	module: {
		set: vi.fn()
	}
}));

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('ModuleCard Component', () => {
	const props = {
		module_name: 'Sample Module',
		module_id: 'module-123'
	};

	it('renders the module name and image', () => {
		const { getByText } = render(ModuleCard, { props });

		// Check if the module name is rendered
		expect(getByText(props.module_name)).toBeInTheDocument();
	});

	it('handles button click to open module', async () => {
		const { getByText } = render(ModuleCard, { props });
		const button = getByText('Open');

		await fireEvent.click(button);

		expect(module.set).toHaveBeenCalledWith(props.module_id);
		expect(goto).toHaveBeenCalledWith('/student/module');
	});
});

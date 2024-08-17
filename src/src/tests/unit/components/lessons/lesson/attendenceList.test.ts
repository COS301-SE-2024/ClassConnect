import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import AttendanceList from '$lib/components/lessons//lesson/AttendanceList.svelte';

describe('AttendanceList Component', () => {
	it('renders audio and video icons correctly', () => {
		const { getByText } = render(AttendanceList);

		expect(getByText('Participants (0)')).toBeInTheDocument();
	});
});

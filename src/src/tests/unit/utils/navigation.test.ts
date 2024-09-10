import { describe, it, vi } from 'vitest';
import { navigateToParentRoute } from '$utils/navigation'; // Update this with the correct path
import { goto } from '$app/navigation';

vi.mock('$app/navigation', () => ({
	goto: vi.fn()
}));

describe('navigateToParentRoute', () => {
	it('should navigate to the parent route when the URL has multiple segments', () => {
		const url = '/workspace/123/edit';
		navigateToParentRoute(url);
		expect(goto).toHaveBeenCalledWith('/workspace/123');
	});

	it('should navigate to the correct parent route when URL has multiple nested segments', () => {
		const url = '/workspace/123/edit/settings';
		navigateToParentRoute(url);
		expect(goto).toHaveBeenCalledWith('/workspace/123/edit');
	});
});

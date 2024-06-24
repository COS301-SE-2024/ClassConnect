import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import UploadModal from '$lib/components/lecturer/modals/+UploadStudy.svelte';

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn().mockReturnValue('mockUserId')
};
global.localStorage = localStorageMock;

// Mock fetch
const mockFetch = vi.fn(() =>
	Promise.resolve({
		ok: true,
		json: () => Promise.resolve({ message: 'File uploaded successfully' })
	})
);
global.fetch = mockFetch;

describe('UploadModal Component', () => {
	it('opens modal on button click', async () => {
		const { getByText, getByLabelText } = render(UploadModal);

		// Click the Upload button to open the modal
		const uploadButton = getByText('Upload');
		await fireEvent.click(uploadButton);

		// Check if modal is rendered
		const modalTitle = getByText('Upload Student Material');
		expect(modalTitle).toBeInTheDocument();

		// Check if form inputs are present
		const titleInput = getByLabelText('Title');
		expect(titleInput).toBeInTheDocument();
	});
});

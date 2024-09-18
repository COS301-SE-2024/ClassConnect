import { describe, it, expect, vi } from 'vitest';
import { load, actions } from './+page.server';
import { fail } from '@sveltejs/kit';
import Users from '$db/schemas/User';
import {
	getUserDetails,
	uploadToS3,
	deleteFromS3,
	validatePassword,
	verifyOldPassword,
	updatePassword
} from '$src/lib/server/utils/profile';

// Mock dependencies
vi.mock('$db/schemas/User', async () => {
	const UserMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));
	UserMock.findByIdAndUpdate = vi.fn();
	UserMock.findById = vi.fn();

	return {
		default: UserMock
	};
});

vi.mock('$src/lib/server/utils/profile', () => ({
	getUserDetails: vi.fn(),
	uploadToS3: vi.fn(),
	deleteFromS3: vi.fn(),
	validatePassword: vi.fn(),
	verifyOldPassword: vi.fn(),
	updatePassword: vi.fn()
}));

vi.mock('@sveltejs/kit', () => ({
	fail: vi.fn()
}));

describe('load function', () => {
	it('should load user details if user is authenticated', async () => {
		const mockUserDetails = { name: 'John Doe' };
		getUserDetails.mockResolvedValue(mockUserDetails);

		const locals = { user: { id: 'user-id' } };

		const result = await load({ locals });

		expect(result).toEqual({ user_data: mockUserDetails });
		expect(getUserDetails).toHaveBeenCalledWith('user-id');
	});

	it('should return undefined if user is not authenticated', async () => {
		const locals = {};

		const result = await load({ locals });

		expect(result).toBeUndefined();
	});
});

describe('actions.upload_picture', () => {
	it('should upload picture successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};

		await actions.upload_picture({ request, locals });

		expect(uploadToS3).toHaveBeenCalled();
	});

	it('should fail to upload picture and return error', async () => {
		uploadToS3.mockRejectedValue(new Error('Upload error'));

		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = {};

		const result = await actions.upload_picture({ request, locals });

		expect(result).toEqual(fail(500, { error: 'Failed to upload picture' }));
	});
});

describe('actions.delete_picture', () => {
	it('should delete picture successfully', async () => {
		const locals = {};

		await actions.delete_picture({ locals });

		expect(deleteFromS3).toHaveBeenCalled();
	});

	it('should fail to delete picture and return error', async () => {
		deleteFromS3.mockRejectedValue(new Error('Delete error'));

		const locals = {};

		const result = await actions.delete_picture({ locals });

		expect(result).toEqual(fail(500, { error: 'Failed to delete picture' }));
	});
});

describe('actions.update_general_details', () => {
	it('should update general details successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = { user: { id: 'user-id' } };

		await actions.update_general_details({ request, locals });

		expect(Users.findByIdAndUpdate).toHaveBeenCalledWith('user-id', expect.any(Object));
	});

	it('should fail to update general details and return error', async () => {
		Users.findByIdAndUpdate.mockRejectedValue(new Error('Update error'));

		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = { user: { id: 'user-id' } };

		const result = await actions.update_general_details({ request, locals });

		expect(result).toEqual(fail(500, { error: 'Failed to update general details' }));
	});
});

describe('actions.update_password', () => {
	it('should update password successfully', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = { user: { id: 'user-id' } };

		verifyOldPassword.mockResolvedValue(true);
		validatePassword.mockReturnValue('new-password');

		await actions.update_password({ request, locals });

		expect(updatePassword).toHaveBeenCalledWith('user-id', 'new-password');
	});

	it('should fail to update password if old password is invalid', async () => {
		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = { user: { id: 'user-id' } };

		verifyOldPassword.mockResolvedValue(false);

		const result = await actions.update_password({ request, locals });

		expect(result).toEqual(fail(400, { error: 'Invalid password' }));
	});

	it('should fail to update password and return error', async () => {
		updatePassword.mockRejectedValue(new Error('Update error'));

		const request = {
			formData: vi.fn().mockResolvedValue(new FormData())
		};
		const locals = { user: { id: 'user-id' } };

		const result = await actions.update_password({ request, locals });

		expect(result).toEqual(fail(500, { error: 'Failed to update password' }));
	});
});

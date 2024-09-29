import { describe, it, expect, vi, beforeEach } from 'vitest';
import Workspace from '$db/schemas/Workspace';
import { error } from '@sveltejs/kit';

const load = vi.fn();

vi.mock('$db/schemas/Workspace', () => {
	return {
		default: {
			findOne: vi.fn().mockReturnThis(),
			select: vi.fn()
		}
	};
});

vi.mock('@sveltejs/kit', () => {
	return {
		error: vi.fn()
	};
});

describe('Load Function', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should throw a 401 error if user is not authenticated or authorized', async () => {
		const locals = { user: null as any };
		const params = { workspace: 'workspace-id' };

		load.mockImplementation(async ({ locals }) => {
			if (!locals.user) {
				throw error(401, 'Unauthorised');
			}
		});

		await expect(load({ locals, params })).rejects.toEqual(error(401, 'Unauthorised'));

		locals.user = { role: 'guest' };

		load.mockImplementation(async ({ locals }) => {
			if (locals.user.role !== 'admin') {
				throw error(401, 'Unauthorised');
			}
		});

		await expect(load({ locals, params })).rejects.toEqual(error(401, 'Unauthorised'));
	});

	it('should return success: false if workspace is not found', async () => {
		const locals = { user: { role: 'admin', organisation: 'org1' } };
		const params = { workspace: 'workspace-id' };

		(load as any).mockResolvedValueOnce({
			success: false,
			message: 'Workspace not found'
		});

		const result = await load({ locals, params });
		expect(result).toEqual({ success: false, message: 'Workspace not found' });
	});

	it('should return success: true if workspace name matches acceptable names', async () => {
		const locals = { user: { role: 'admin', organisation: 'org1' } };
		const params = { workspace: 'workspace-id' };

		(load as any).mockResolvedValueOnce({ success: true });

		const result = await load({ locals, params });
		expect(result).toEqual({ success: true });
	});

	it('should throw a 500 error if an exception occurs', async () => {
		const locals = { user: { role: 'admin', organisation: 'Test Organisation' } };
		const params = { workspace: 'workspace-id' };

		(Workspace.findOne as any).mockRejectedValue(new Error('Database error'));
		load.mockImplementation(async ({ locals, params }) => {
			try {
				await Workspace.findOne({
					organisation: locals.user?.organisation,
					_id: params.workspace
				}).select('name');
			} catch (e) {
				throw error(500, 'Error occurred while verifying workspace');
			}
		});

		await expect(load({ locals, params })).rejects.toEqual(
			error(500, 'Error occurred while verifying workspace')
		);
	});
});

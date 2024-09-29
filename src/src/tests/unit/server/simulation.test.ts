import { describe, it, expect, vi, beforeEach } from 'vitest';
import Workspace from '$db/schemas/Workspace';
import * as simulationModule from '$src/routes/(app)/workspaces/[workspace]/environments/simulation/+page.server';
import { error, fail } from '@sveltejs/kit';

vi.mock('$db/schemas/Workspace', () => {
	const WorkspaceMock: any = vi.fn().mockImplementation(() => ({
		save: vi.fn()
	}));

	WorkspaceMock.find = vi.fn();
	WorkspaceMock.findOne = vi.fn();
	WorkspaceMock.findById = vi.fn();
	WorkspaceMock.findByIdAndDelete = vi.fn();

	return { default: WorkspaceMock };
});

vi.mock('@sveltejs/kit', async () => {
	const actual = await vi.importActual('@sveltejs/kit');
	return {
		...actual,
		fail: vi.fn(),
		error: vi.fn(),
		redirect: vi.fn()
	};
});

describe('Simulation Module', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('load function', () => {
		it('should throw a 401 error if user is not authenticated or authorized', async () => {
			const locals = { user: 'potato' };
			const params = { workspace: 'workspace-id' };

			await expect(simulationModule.load({ locals, params })).rejects.toEqual(
				error(401, 'Unauthorised')
			);
		});

		it('should return success: true if workspace name matches acceptable names', async () => {
			const locals = { user: { role: 'admin', organisation: 'org1' } };
			const params = { workspace: 'workspace-id' };

			// Mocking the database response for a matching workspace
			(Workspace.findOne as any).mockReturnValue({
				select: vi.fn().mockResolvedValue({ name: 'Mining' })
			});

			const result = await simulationModule.load({ locals, params } as any);

			expect(result).toEqual({ success: true });
		});

		it('should return success: false if workspace name does not match acceptable names', async () => {
			const locals = { user: { role: 'admin', organisation: 'org1' } };
			const params = { workspace: 'workspace-id' };

			// Mocking the database response for a non-matching workspace name
			(Workspace.findOne as any).mockReturnValue({
				select: vi.fn().mockResolvedValue({ name: 'Other Name' })
			});

			const result = await simulationModule.load({ locals, params } as any);

			expect(result).toEqual({ success: false });
		});

		it('should throw a 500 error if an exception occurs', async () => {
			const locals = { user: { role: 'admin', organisation: 'Test Organisation' } };
			const params = { workspace: 'workspace-id' };

			// Mocking the database to throw an error
			(Workspace.findOne as any).mockReturnValue({
				select: vi.fn().mockRejectedValue(new Error('Database Error'))
			});

			try {
				await simulationModule.load({ locals, params });
			} catch (err) {
				expect(error).toHaveBeenCalledWith(500, 'Error occurred while verifying workspace');
			}
		});
	});
});

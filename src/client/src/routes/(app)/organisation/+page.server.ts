import type { Actions } from './$types';
import { fail, error } from '@sveltejs/kit';

import User from '$db/schemas/User';
import Organisation from '$db/schemas/Organisation';

export async function load({ locals }) {
	if (!locals.user) throw error(401);
	if (locals.user.role !== 'admin') throw error(403);

	const organisation = await Organisation.findOne({ createdBy: locals.user.id });

	if (!organisation) return { id: null, name: null, image: null };

	return { id: organisation._id.toString(), name: organisation.name, image: organisation.image };
}

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name');
		const image = data.get('image');

		if (!name) {
			return fail(400, { errors: { name: 'Name is required' } });
		}

		if (!image) {
			return fail(400, { errors: { imageUrl: 'Image URL is required' } });
		}

		try {
			const newOrg = new Organisation({
				name,
				image,
				createdBy: locals.user?.id
			});

			await newOrg.save();

			await User.updateOne({ _id: locals.user?.id }, { organisation: newOrg._id });

			return { success: true };
		} catch (error) {
			return fail(500, { message: 'Failed to create organization' });
		}
	},
	update: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id');
		const name = data.get('name');
		const image = data.get('image');

		try {
			const organisation = await Organisation.findById(id);

			if (!organisation) {
				return fail(404, { message: 'Organization not found' });
			}

			if (organisation.createdBy.toString() !== locals.user?.id.toString()) {
				return fail(403, { message: 'Not authorized to update this organization' });
			}

			organisation.name = name || organisation.name;
			organisation.image = image || organisation.image;

			await organisation.save();

			return { success: true };
		} catch (error) {
			return fail(500, { message: 'Failed to update organization' });
		}
	},
	delete: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id');

		try {
			const { createdBy } = await Organisation.findById(id).select('createdBy');

			if (createdBy.toString() !== locals.user?.id.toString()) {
				return fail(403, { message: 'Not authorized to delete this organisation' });
			}

			await Organisation.deleteOne({ _id: id });
			await User.updateOne({ _id: locals.user?.id }, { $unset: { organisation: '' } });
			await User.deleteMany({ organisation: id });

			return { success: true };
		} catch (error) {
			return fail(500, { message: 'Failed to delete organization' });
		}
	}
};

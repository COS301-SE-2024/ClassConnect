import User from '$db/schemas/User';
import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { generateUsername } from '$utils/user';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();

		const name = formData.get('name');
		const surname = formData.get('surname');
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		if (typeof name !== 'string' || name.length === 0) {
			return fail(400, {
				error: 'Invalid name'
			});
		}

		if (typeof surname !== 'string' || surname.length === 0) {
			return fail(400, {
				error: 'Invalid surname'
			});
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (typeof email !== 'string' || email.length === 0 || !emailRegex.test(email)) {
			return fail(400, {
				error: 'Invalid email'
			});
		}

		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{6,}$/;

		if (typeof password !== 'string' || !passwordRegex.test(password)) {
			return fail(400, {
				error: 'Invalid password'
			});
		}

		if (typeof confirmPassword !== 'string' || confirmPassword !== password) {
			return fail(400, {
				error: 'Passwords do not match'
			});
		}

		const username = generateUsername('admin', email);

		const hashedPassword = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			const newUser = new User({
				name,
				surname,
				username,
				email,
				role: 'admin',
				password: hashedPassword
			});

			await newUser.save();
		} catch (e) {
			console.log('Error', e);

			return {
				error: 'An unknown error occurred'
			};
		}

		redirect(302, '/signin');
	}
};

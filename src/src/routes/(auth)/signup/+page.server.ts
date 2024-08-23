import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

import User from '$db/schemas/User';
import { retry_connection } from '$db/db';
import { HASH_OPTIONS } from '$src/constants';
import { sendWelcomeEmail } from '$lib/server/utils/email';
import { generateUsername, validatePassword } from '$lib/server/utils/auth';

export async function load({ locals }) {
	if (locals.user) {
		locals.user.role === 'lecturer' ? redirect(302, '/workspaces') : redirect(302, '/dashboard');
	}
}

function validateName(name: FormDataEntryValue | null): string {
	if (typeof name !== 'string' || name.length === 0) throw new Error('Invalid name');

	return name;
}

function validateEmail(email: FormDataEntryValue | null): string {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (typeof email !== 'string' || email.length === 0 || !emailRegex.test(email)) {
		throw new Error('Invalid email');
	}

	return email;
}

async function checkEmailExists(email: string): Promise<boolean> {
	const user = await User.findOne({ email });
	return !!user;
}

async function createUser(data: SignUpData, username: string): Promise<void> {
	const hashedPassword = await hash(data.password, HASH_OPTIONS);

	const newUser = new User({
		username,
		role: 'admin',
		name: data.name,
		email: data.email,
		surname: data.surname,
		custom_password: true,
		password: hashedPassword,
		image: 'images/profile-placeholder.png'
	});

	await newUser.save();
}

async function handleSignup(
	formData: FormData
): Promise<{ success: boolean; name?: string; error?: string }> {
	try {
		const data: SignUpData = {
			name: validateName(formData.get('name')),
			surname: validateName(formData.get('surname')),
			email: validateEmail(formData.get('email')),
			password: validatePassword(formData.get('password'), formData.get('confirm-password'))
		};

		const emailExists = await checkEmailExists(data.email);

		if (emailExists) {
			return { success: false, error: 'Email already exists' };
		}

		const username = generateUsername('admin', data.email);

		await createUser(data, username);
		await sendWelcomeEmail(data.email, 'owner', data.name, username);

		return { success: true, name: data.name };
	} catch (e) {
		console.error('Signup error:', e);

		return {
			success: false,
			error: 'Failed to sign up'
		};
	}
}

export const actions: Actions = {
	default: async (event) => {
		retry_connection();
		const formData = await event.request.formData();
		const result = await handleSignup(formData);

		if (!result.success) return fail(400, { error: result.error });

		redirect(303, `/signup/successful?name=${encodeURIComponent(result.name!)}`);
	}
};

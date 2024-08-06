import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import type { SignUpData } from '$src/types';

import User from '$db/schemas/User';
import { HASH_OPTIONS } from '$src/constants';
import { generateUsername } from '$src/lib/server/utils/auth';
import { sendWelcomeEmail } from '$src/lib/server/utils/email';

export async function load({ locals }) {
	if (locals.user) redirect(302, '/home');
}

function validateName(name: FormDataEntryValue | null): string {
	if (typeof name !== 'string' || name.length === 0) throw new Error('Invalid name');

	return name;
}

function validateEmail(email: FormDataEntryValue | null): string {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (typeof email !== 'string' || email.length === 0 || !emailRegex.test(email))
		throw new Error('Invalid email');

	return email;
}

function validatePassword(
	password: FormDataEntryValue | null,
	confirmPassword: FormDataEntryValue | null
): string {
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{6,}$/;

	if (typeof password !== 'string' || !passwordRegex.test(password))
		throw new Error('Invalid password');

	if (password !== confirmPassword) throw new Error('Passwords do not match');

	return password;
}

async function checkEmailExists(email: string): Promise<boolean> {
	const user = await User.findOne({ email });
	return !!user;
}

async function createUser(data: SignUpData, username: string): Promise<void> {
	const hashedPassword = await hash(data.password, HASH_OPTIONS);

	const newUser = new User({
		name: data.name,
		surname: data.surname,
		username,
		email: data.email,
		role: 'admin',
		image: 'images/profile-placeholder.png',
		password: hashedPassword
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
		await sendWelcomeEmail(data.email, data.name, username);

		return { success: true, name: data.name };
	} catch (error) {
		console.error('Signup error:', error);

		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unknown error occurred'
		};
	}
}

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const result = await handleSignup(formData);

		if (!result.success) return fail(400, { error: result.error });

		redirect(303, `/signup/successful?name=${encodeURIComponent(result.name!)}`);
	}
};

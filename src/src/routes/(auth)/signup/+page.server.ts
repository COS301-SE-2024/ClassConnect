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
		locals.user.role === 'admin' ? redirect(302, '/organisation') : redirect(302, '/workspaces');
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
		const data = await validateAndProcessFormData(formData);

		await checkForExistingEmail(data.email);

		const username = generateUsername('admin', data.email);

		await createUserAndSendWelcomeEmail(data, username);

		return { success: true, name: data.name };
	} catch (error) {
		console.error('Signup error:', error);

		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unexpected error occurred'
		};
	}
}

async function validateAndProcessFormData(formData: FormData): Promise<SignUpData> {
	return {
		name: validateName(formData.get('name')),
		surname: validateName(formData.get('surname')),
		email: validateEmail(formData.get('email')),
		password: validatePassword(formData.get('password'), formData.get('confirm-password'))
	};
}

async function checkForExistingEmail(email: string): Promise<void> {
	const emailExists = await checkEmailExists(email);
	if (emailExists) {
		throw new Error('Email already exists');
	}
}

async function createUserAndSendWelcomeEmail(data: SignUpData, username: string): Promise<void> {
	try {
		await createUser(data, username);
		await sendWelcomeEmail(data.email, 'owner', data.name, username);
	} catch (error) {
		throw new Error('Failed to sign up');
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

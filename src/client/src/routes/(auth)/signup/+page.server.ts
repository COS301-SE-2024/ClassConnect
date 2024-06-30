import User from '$db/schemas/User';
import sgMail from '@sendgrid/mail';
import { hash } from '@node-rs/argon2';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { generateUsername } from '$utils/user';
import { SENDGRID_API_KEY, FROM_EMAIL } from '$env/static/private';

sgMail.setApiKey(SENDGRID_API_KEY);

const HASH_OPTIONS = {
	timeCost: 2,
	outputLen: 32,
	parallelism: 1,
	memoryCost: 19456
};

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

async function sendWelcomeEmail(to: string, name: string, username: string) {
	const msg = {
		to,
		from: `ClassConnect <${FROM_EMAIL}>`,
		subject: 'Welcome to ClassConnect!',
		html: `
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for joining ClassConnect. We're excited to have you on board!</p>
      <p>Your generated username is: <strong>${username}</strong></p>
      <p>You can use this username to <a href="http://localhost:5173/signin">Log in</a> to your account.</p>`
	};

	try {
		await sgMail.send(msg);

		console.log('Email sent successfully.');
	} catch (error) {
		console.error('Error sending email: ', error);
	}
}

async function checkEmailExists(email: string): Promise<boolean> {
	const user = await User.findOne({ email });
	return !!user;
}

async function createUser(data: SignupData, username: string): Promise<void> {
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
		const data: SignupData = {
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

		throw redirect(303, `/signup/successful?name=${encodeURIComponent(result.name!)}`);
	}
};

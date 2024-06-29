import { generateIdFromEntropySize } from 'lucia';
import User from '$db/schemas/User';
import sgMail from '@sendgrid/mail';
import { hash } from '@node-rs/argon2';
import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { generateUsername } from '$utils/user';
import { SENDGRID_API_KEY, FROM_EMAIL } from '$env/static/private';

sgMail.setApiKey(SENDGRID_API_KEY);

async function sendWelcomeEmail(to: string, name: string, username: string) {
	const msg = {
		to: to,
		from: `ClassConnect <${FROM_EMAIL}>`,
		subject: 'Welcome to ClassConnect!',
		html: `
		<h1>Welcome, ${name}!</h1>
		<p>Thank you for joining ClassConnect. We're excited to have you on board!</p>
		<p>Your generated username is: <strong>${username}</strong></p>
		<p>You can use this username to <a href="http://localhost:5173/signin">Log in</a> to your account.</p>`
	};

	sgMail
		.send(msg)
		.then(() => {
			console.log('Welcome email sent successfully!');
		})
		.catch((error) => {
			console.error('Error sending welcome email: ', error);
		});
}

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();

		const name = formData.get('name');
		const surname = formData.get('surname');
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirm-password');

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

		const _id = generateIdFromEntropySize(10);

		try {
			const newUser = new User({
				_id,
				name,
				surname,
				username,
				email,
				role: 'admin',
				image: 'http://localhost:5173/images/profile-placeholder.png',
				password: hashedPassword
			});

			await newUser.save();

			await sendWelcomeEmail(email, name, username);
		} catch (e) {
			console.log('Error', e);

			return {
				error: 'An unknown error occurred'
			};
		}

		redirect(303, `/signup/successful?name=${encodeURIComponent(name)}`);
	}
};

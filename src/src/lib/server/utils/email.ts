import sgMail from '@sendgrid/mail';
import { error } from '@sveltejs/kit';
import { SENDGRID_API_KEY, FROM_EMAIL, DOMAIN } from '$env/static/private';

sgMail.setApiKey(SENDGRID_API_KEY);

interface EmailOptions {
	to: string;
	html: string;
	subject: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
	const msg = {
		to,
		html,
		subject,
		from: `ClassConnect <${FROM_EMAIL}>`
	};

	try {
		await sgMail.send(msg);
		console.log('Email sent successfully.');
	} catch (err) {
		console.error('Error sending email: ', err);
		throw new Error('Failed to send email');
	}
}

export async function sendWelcomeEmail(
	to: string,
	role: string,
	name: string,
	username: string,
	password?: string,
	organisation?: string
): Promise<void> {
	const subject = "🎉 Welcome to ClassConnect! Let's get started!";

	try {
		const response = await fetch(`${DOMAIN}/templates/${role}-welcome.html`);

		if (!response.ok) throw error(404, 'Email template not found');

		let html = await response.text();

		html = html.replace('{{email}}', to);
		html = html.replace('{{name}}', name);
		html = html.replace('{{domain}}', DOMAIN);
		html = html.replace('{{username}}', username);

		if (password) html = html.replace('{{password}}', password);
		if (organisation) html = html.replace('{{organisation}}', organisation);

		await sendEmail({ to, subject, html });
	} catch (err) {
		console.error('Failed to send welcome email:', err);
		throw error(500, 'Failed to send welcome email');
	}
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
	const subject = '🔐 ClassConnect Password Reset Request';

	try {
		const response = await fetch(`${DOMAIN}/templates/password-reset.html`);

		if (!response.ok) throw error(404, 'Email template not found');

		const resetLink = `${DOMAIN}/reset-password/${token}`;

		let html = await response.text();

		html = html.replace('{{email}}', email);
		html = html.replaceAll('{{resetLink}}', resetLink);

		await sendEmail({ to: email, subject, html });
	} catch (err) {
		console.error('Failed to send password reset email:', err);
		throw error(500, 'Failed to send password reset email');
	}
}

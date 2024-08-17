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
	} catch (error) {
		console.error('Error sending email: ', error);
		throw new Error('Failed to send email');
	}
}

export async function sendWelcomeEmail(to: string, name: string, username: string): Promise<void> {
	const subject = "🎉 Welcome to ClassConnect! Let's get started!";

	try {
		const response = await fetch(`${DOMAIN}/templates/admin-welcome.html`);

		if (!response.ok) {
			throw error(404, 'Email template not found');
		}

		let html = await response.text();

		html = html.replace('{{email}}', to);
		html = html.replace('{{name}}', name);
		html = html.replace('{{domain}}', DOMAIN);
		html = html.replace('{{username}}', username);

		await sendEmail({ to, subject, html });
	} catch (err) {
		console.error('Failed to send welcome email:', err);
		throw error(500, 'Failed to send welcome email');
	}
}

import path from 'path';
import fs from 'fs/promises';
import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY, FROM_EMAIL } from '$env/static/private';

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

	const templatePath = path.join(
		process.cwd(),
		'src',
		'lib',
		'templates',
		'welcome.html'
	);

	let html = await fs.readFile(templatePath, 'utf-8');

	html = html.replace('{{email}}', to);
	html = html.replace('{{name}}', name);
	html = html.replace('{{username}}', username);

	await sendEmail({ to, subject, html });
}

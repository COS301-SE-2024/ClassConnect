import crypto from 'crypto';
import { sha256 } from 'oslo/crypto';
import { encodeHex } from 'oslo/encoding';
import { TimeSpan, createDate } from 'oslo';
import { generateIdFromEntropySize } from 'lucia';

import PasswordResetToken from '$db/schemas/PasswordResetToken';

export function validatePassword(
	password: FormDataEntryValue | null,
	confirmPassword: FormDataEntryValue | null
): string {
	if (typeof password !== 'string') {
		throw new Error('Password must be a string');
	}

	if (password.length < 6) {
		throw new Error('Password must be at least 6 characters long');
	}

	if (!/[a-z]/.test(password)) {
		throw new Error('Password must contain at least one lowercase letter');
	}

	if (!/[A-Z]/.test(password)) {
		throw new Error('Password must contain at least one uppercase letter');
	}

	if (!/\d/.test(password)) {
		throw new Error('Password must contain at least one number');
	}

	if (!/[@$!%*?&]/.test(password)) {
		throw new Error('Password must contain at least one special character (@$!%*?&)');
	}

	if (password !== confirmPassword) {
		throw new Error('Passwords do not match');
	}

	return password;
}

export async function createPasswordResetToken(userId: string): Promise<string> {
	await PasswordResetToken.deleteMany({ user_id: userId });

	const tokenId = generateIdFromEntropySize(25);
	const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));

	await PasswordResetToken.create({
		user_id: userId,
		token_hash: tokenHash,
		expires_at: createDate(new TimeSpan(2, 'h'))
	});

	return tokenId;
}

export function generateUsername(role: string, email: string): string {
	const rolePrefix = getRolePrefix(role);
	const emailHash = hashEmail(email).slice(0, 6);
	const year = new Date().getFullYear().toString().slice(-2);

	return `${rolePrefix}${year}${emailHash}`;
}

function getRolePrefix(role: string): string {
	switch (role) {
		case 'admin':
			return 'a';
		case 'lecturer':
			return 'e';
		case 'student':
			return 's';
		default:
			throw new Error('Invalid role');
	}
}

function hashEmail(email: string): string {
	const emailHash = crypto.createHash('sha256').update(email).digest('hex');
	const numericHash = emailHash.replace(/\D/g, '');

	return numericHash;
}

import crypto from 'crypto';

export function validatePassword(
	password: FormDataEntryValue | null,
	confirmPassword: FormDataEntryValue | null
): string {
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{6,}$/;

	if (typeof password !== 'string' || !passwordRegex.test(password))
		throw new Error('Invalid password');

	if (password !== confirmPassword) throw new Error('Passwords do not match');

	return password;
}

export function generateUsername(role: string, email: string): string {
	const rolePrefix = getRolePrefix(role);
	const emailHash = hashEmail(email).slice(0, 7);
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

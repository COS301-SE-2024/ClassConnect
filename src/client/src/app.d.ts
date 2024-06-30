declare global {
	namespace App {
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}

		interface SignupData {
			name: string;
			surname: string;
			email: string;
			password: string;
		}
	}
}

export {};

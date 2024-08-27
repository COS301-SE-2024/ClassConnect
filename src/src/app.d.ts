declare global {
	namespace App {
		interface Locals {
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
		}
	}

	interface SignUpData {
		name: string;
		email: string;
		surname: string;
		password: string;
	}

	interface SignInData {
		username: string;
		password: string;
	}

	interface Announcement {
		id: string;
		date: string;
		title: string;
		content: string;
		createdBy: string;
	}
}

export {};

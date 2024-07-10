export interface SignUpData {
	name: string;
	surname: string;
	email: string;
	password: string;
}

export interface SignInData {
	username: string;
	password: string;
}

export interface Admin {
	id: string;
	name: string;
	email: string;
	image: string;
	surname: string;
	username: string;
}

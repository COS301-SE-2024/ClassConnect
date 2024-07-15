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

export interface User {
	id: string;
	name: string;
	email: string;
	image: string;
	surname: string;
	username: string;
}

export interface Announcement {
	id: string;
	title: string;
	date: string;
	createdBy: string;
	description: string;
}

export interface Activity {
	id: string;
	title: string;
	date: string;
	description: string;
	type: string;
}

export interface Workspace {
	id: string;
	name: string;
	image: string;
	owner: string;
	description: string;
}

export interface Lesson {
	id: string;
	topic: string;
	time: string;
	date: string;
	description: string;
	workspace: string;
}

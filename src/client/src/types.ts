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

export interface Material {
	id: string;
	title: string;
	description: string;
	file_path: string;
	type: boolean;
	workspace: string;
}
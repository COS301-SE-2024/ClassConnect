export type Lecturer = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	username: string;
};

export type Student = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	username: string;
};

export type Org_Admin = {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	username: string;
	image: string;
};

export type Workspace = {
	id: string;
	workspace_name: string;
	workspace_description: string;
	image: string;
};

export type UserData = {
	first_name: string;
	last_name: string;
	username: string;
	id: string;
	email: string;
	image: string;
	role: string;
	organisation: string;
	workspaces: any[];
};

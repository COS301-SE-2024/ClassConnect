export interface User {
	id: string;
	name: string;
	email: string;
	image: string;
	surname: string;
	username: string;
	workspaces: string;
}

export interface InteractiveLesson {
	id: string;
	title: string;
	instructions: string;
	description: string;
	owner: string;
	isAvailable: boolean;
	content: AssignmentContent[];
}

export interface AssignmentContent {
	type: 'MCQ' | 'Notes';
	content: MCQ | Notes;
}

export interface MCQ {
	id: string;
	description: string;
	question: string;
	options: string[];
	answer: string;
	type: 'Note' | 'MCQ';
}

export interface LessonThreeDMaterial {
	id: string;
	material: string;
	title: string;
	description: string;
	link: string;
	annotations: Annotation[];
	type: 'ThreeDMaterial';
}

export interface Annotation {
	id: number;
	title: string;
	content: string;
	x: number;
	y: number;
	z: number;
}

export interface Notes {
	id: string;
	title: string;
	content: string;
	type: 'Note' | 'MCQ';
}

export interface Lesson {
	id: string;
	topic: string;
	time: string;
	date: string;
	description: string;
	workspace: string;
}

export interface Recording {
	id: string;
	topic: string;
	time: string;
	date: string;
	description: string;
	workspace: string;
	url: string;
}

export interface User_Details {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	image: string;
	surname: string;
	username: string;
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
	ownerImage: string;
	description: string;
}

export interface Material {
	id: string;
	title: string;
	description: string;
	file_path: string;
	thumbnail: string;
	type: boolean;
	workspace: string;
}

export interface FileUploadReturn {
	name: string;
	url: string;
}

export interface UploadData {
	title: string;
	description: string;
	workspace: string;
	file: File;
}
export interface UploadInfo {
	title: string;
	description: string;
	workspace: string;
	link: string;
}

export type FAQItem = {
	question: string;
	answer: string;
	isOpen?: boolean;
};

export type FAQCategory = {
	category: string;
	items: FAQItem[];
};

export interface Quiz {
	id: string;
	instructions: string;
	title: string;
	graded: string;
	date: Date;
	duration: number;
	isAvailable: boolean;
}

export interface Grades {
	id: string;
	studentID: string;
	workspaceID: string;
	quizID: string;
	mark: number;
}

export interface Option {
	content: string;
	points: number;
}

export interface Question {
	id: string;
	questionNumber: number;
	questionContent: string;
	questionType: string;
	questionPoints: number | null;
	options: Option[] | null;
}

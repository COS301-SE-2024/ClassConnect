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

export interface User_Details {
	id: string;
	first_name: string;
	last_name: string;
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

export interface Recording {
	id: string;
	topic: string;
	time: string;
	date: string;
	description: string;
	workspace: string;
	url: string;
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

export interface UploadData {
	title: string;
	description: string;
	workspace: string;
	file: File;
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
	options: Option[];
}

export interface GradeData {
	_id: string;
	studentID: string;
	quizID: string;
	workspaceID: string;
	mark: number;
}

export interface QuizData {
	_id: string;
	title: string;
	totalPossibleScore: number;
}

export interface AssessmentStat {
	name: string;
	submitted: number;
	average: number;
	passRate: number;
}

export interface StudentGrade {
	name: string;
	grades: number[];
}

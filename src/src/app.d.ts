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
}

export {};

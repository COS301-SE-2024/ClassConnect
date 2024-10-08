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

	interface GradeData {
		_id: string;
		studentID: string;
		quizID: string;
		workspaceID: string;
		mark: number;
	}

	interface QuizData {
		_id: string;
		title: string;
		totalPossibleScore: number;
	}

	interface AssessmentStat {
		name: string;
		submitted: number;
		average: number;
		passRate: number;
	}

	interface StudentGrade {
		name: string;
		grades: number[];
	}

	interface Lesson {
		id: string;
		time: string;
		date: string;
		topic: string;
		workspace: string;
		recurrence: string;
		description: string;
	}

	interface Recording {
		id: string;
		url: string;
		time: string;
		date: string;
		topic: string;
		workspace: string;
		description: string;
	}
}

export {};

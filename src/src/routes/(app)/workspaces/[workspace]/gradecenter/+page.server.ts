import { error } from '@sveltejs/kit';
import type { ObjectId } from 'mongoose';
import Quiz from '$lib/server/database/schemas/Quiz';
import Grades from '$lib/server/database/schemas/Grades';

export async function load({ locals }) {
	if (locals.user?.role !== 'lecturer') throw error(401, 'Only lecturers can access this page');

	try {
		const [assessmentStatsData, gradeCenterData] = await Promise.all([
			getAssessmentStats(),
			getGradeCenterData()
		]);

		return {
			...gradeCenterData,
			...assessmentStatsData
		};
	} catch (e) {
		console.error('Error in load function:', e);
		throw error(500, 'An error occurred while loading the page data');
	}
}

async function getAssessmentStats(): Promise<{ stats: AssessmentStat[] }> {
	try {
		const quizzes: QuizData[] = await Quiz.find().lean();
		const grades: GradeData[] = await Grades.find().lean();

		const statMap = new Map<string, AssessmentStat>();
		const quizMap = new Map(quizzes.map((quiz) => [quiz._id.toString(), quiz]));

		grades.forEach((grade) => {
			const quizId = grade.quizID.toString();
			const quiz = quizMap.get(quizId);

			if (!quiz) return;

			if (!statMap.has(quizId)) {
				statMap.set(quizId, {
					name: quiz.title,
					submitted: 0,
					average: 0,
					passRate: 0
				});
			}

			const stat = statMap.get(quizId)!;

			stat.submitted++;
			stat.average += grade.mark;

			const passMark = 100 * 0.5;

			if (grade.mark >= passMark) stat.passRate++;
		});

		const stats: AssessmentStat[] = Array.from(statMap.values()).map((stat) => ({
			name: stat.name,
			submitted: stat.submitted,
			average: Number((stat.average / stat.submitted).toFixed(2)),
			passRate: Number(((stat.passRate / stat.submitted) * 100).toFixed(2))
		}));

		return { stats };
	} catch (e) {
		console.error('Error fetching assessment stats:', e);
		throw error(500, 'An error occurred while fetching assessment stats');
	}
}

async function getGradeCenterData(): Promise<{ students: StudentGrade[]; assessments: string[] }> {
	try {
		const quizzes = (await Quiz.find().lean().select('_id title').sort('createdAt')) as {
			_id: ObjectId;
			title: string;
		}[];

		const assessments = quizzes.map((quiz) => quiz.title);
		const grades = await Grades.find().lean().populate('studentID', 'username name surname');
		const studentMap = new Map<string, { grades: number[]; name: string; username: string }>();

		grades.forEach((grade) => {
			const id = grade.studentID._id.toString();
			const username = grade.studentID.username;
			const name = grade.studentID.name + ' ' + grade.studentID.surname;

			const quizIndex = quizzes.findIndex(
				(quiz) => quiz._id.toString() === grade.quizID.toString()
			);

			if (quizIndex === -1) return;

			if (!studentMap.has(id)) {
				studentMap.set(id, {
					name,
					username,
					grades: new Array(quizzes.length).fill(0)
				});
			}

			const studentData = studentMap.get(id)!;

			studentData.grades[quizIndex] = grade.mark;
			studentMap.set(id, studentData);
		});

		const students: StudentGrade[] = Array.from(studentMap.values());

		return { students, assessments };
	} catch (e) {
		console.error('Error fetching grade center data:', e);
		throw error(500, 'An error occurred while fetching grade center data');
	}
}

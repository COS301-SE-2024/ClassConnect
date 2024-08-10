import { error } from '@sveltejs/kit';

import Quiz from '$lib/server/database/schemas/Quiz';
import Grades from '$lib/server/database/schemas/Grades';
import type { AssessmentStat, GradeData, QuizData } from '$src/types';

export async function load() {
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

			if (grade.mark >= passMark) {
				stat.passRate++;
			}
		});

		const assessmentStats: AssessmentStat[] = Array.from(statMap.values()).map((stat) => ({
			name: stat.name,
			submitted: stat.submitted,
			average: Number((stat.average / stat.submitted).toFixed(2)),
			passRate: Number(((stat.passRate / stat.submitted) * 100).toFixed(2))
		}));

		return { assessmentStats };
	} catch (e) {
		console.error('Error fetching assessment stats:', e);
		throw error(500, 'An error occurred while fetching assessment stats');
	}
}

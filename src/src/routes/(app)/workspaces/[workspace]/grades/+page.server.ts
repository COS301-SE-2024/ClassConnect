import { error } from '@sveltejs/kit';
import Grades from '$lib/server/database/schemas/Grades';

export async function load({ locals, params }) {
	if (!locals.user || locals.user.role !== 'student') throw error(401, 'Unauthorised');

	try {
		const workspaceID = params.workspace;

		const grades = await Grades.find({ studentID: locals.user.id, workspaceID })
			.populate('quizID')
			.lean();

		const workspaceGrades = grades.map((grade) => ({
			average: 0,
			score: grade.mark,
			assessment: grade.quizID.title,
			quizID: grade.quizID._id.toString(),
			date: grade.quizID.date.toDateString()
		}));

		for (const assessment of workspaceGrades) {
			const allGrades = await Grades.find({ quizID: assessment.quizID });
			const average = allGrades.reduce((sum, g) => sum + g.mark, 0) / allGrades.length;

			assessment.average = Math.round(average);
		}

		return { grades: workspaceGrades };
	} catch (e) {
		console.error('Error fetching grades:', e);
		throw error(500, 'An error occurred while fetching grades');
	}
}

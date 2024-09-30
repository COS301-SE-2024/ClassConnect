import { error } from '@sveltejs/kit';
import Grades from '$lib/server/database/schemas/Grades';

export async function load({ locals }) {
	if (!locals.user || locals.user.role !== 'student') throw error(401, 'Unauthorised');

	try {
		const grades = await Grades.find({ studentID: locals.user.id })
			.populate('quizID')
			.populate('workspaceID')
			.lean();

		const workspaceGrades = grades.reduce((acc: { [key: string]: any }, grade) => {
			const workspaceName = grade.workspaceID.name;

			if (!acc[workspaceName]) acc[workspaceName] = [];

			acc[workspaceName].push({
				average: 0,
				score: grade.mark * 10,
				assessment: grade.quizID.title,
				quizID: grade.quizID._id.toString(),
				date: grade.quizID.date.toDateString()
			});

			return acc;
		}, {});

		for (const workspace in workspaceGrades) {
			for (const assessment of workspaceGrades[workspace]) {
				const allGrades = await Grades.find({ quizID: assessment.quizID });
				const average = allGrades.reduce((sum, g) => sum + g.mark, 0) / allGrades.length;

				assessment.average = Math.round(average) * 10;
			}
		}

		const workspaces = Object.entries(workspaceGrades).map(([name, grades]) => ({ name, grades }));

		return { workspaces };
	} catch (e) {
		console.error('Error fetching grades:', e);
		throw error(500, 'An error occurred while fetching grades');
	}
}

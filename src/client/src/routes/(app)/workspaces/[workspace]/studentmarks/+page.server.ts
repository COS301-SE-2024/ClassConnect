import { error } from '@sveltejs/kit';
import type { ObjectId } from 'mongoose';

import type { StudentGrade } from '$src/types';
import User from '$lib/server/database/schemas/User';
import Quiz from '$lib/server/database/schemas/Quiz';
import Grades from '$lib/server/database/schemas/Grades';

export async function load({locals}) {
	try {
		const quizzes = (await Quiz.find().lean().select('_id title').sort('createdAt')) as {
			_id: ObjectId;
			title: string;
		}[];

		const grades = await Grades.find().lean().populate('studentID', 'username');
		const user = await User.findById(locals.user?.id).select('username');

		const assessments = quizzes.map((quiz) => quiz.title);
		const studentMap = new Map<string, number[]>();

		grades.forEach((grade) => {
			const studentId = grade.studentID._id.toString();
			const studentName = grade.studentID.name;
			const quizIndex = quizzes.findIndex(
				(quiz) => quiz._id.toString() === grade.quizID.toString()
			);

			if (quizIndex === -1) return;

			if (!studentMap.has(studentId)) {
				studentMap.set(studentId, new Array(quizzes.length).fill(null));
			}

			const studentGrades = studentMap.get(studentId)!;
			studentGrades[quizIndex] = grade.mark;
			studentMap.set(studentId, studentGrades);
		});

		const students: StudentGrade[] = Array.from(studentMap, ([id, grades]) => ({
			grades: grades,
			name: user.username,
		}));

		return {
			assessments,
			students
		};
	} catch (e) {
		console.error('Error fetching grade book data:', e);
		throw error(500, 'An error occurred while fetching grade book data');
	}
}

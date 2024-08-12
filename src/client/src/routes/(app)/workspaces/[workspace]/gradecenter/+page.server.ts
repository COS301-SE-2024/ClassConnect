import { error } from '@sveltejs/kit';

import type { ObjectId } from 'mongoose';
import type { StudentGrade } from '$src/types';

import Quiz from '$lib/server/database/schemas/Quiz';
import Grades from '$lib/server/database/schemas/Grades';

export async function load({ locals }) {
	if (locals.user?.role !== 'lecturer') throw error(401, 'Only lecturers can access this page');

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
					grades: new Array(quizzes.length).fill(null)
				});
			}

			const studentData = studentMap.get(id)!;

			studentData.grades[quizIndex] = grade.mark;
			studentMap.set(id, studentData);
		});

		const students: StudentGrade[] = Array.from(studentMap.values());

		return {
			students,
			assessments
		};
	} catch (e) {
		console.error('Error fetching grade center data:', e);
		throw error(500, 'An error occurred while fetching grade center data');
	}
}

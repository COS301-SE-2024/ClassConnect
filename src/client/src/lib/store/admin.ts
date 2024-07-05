import type { UserData, Lecturer, Student, Org_Admin } from '$lib/store/types';
import { User } from '$lib/store/classes';

export class Admin extends User {
	private lecturers: Lecturer[];
	private students: Student[];
	private admins: Org_Admin[];

	constructor(initial: UserData) {
		super(initial);
		this.lecturers = [];
		this.students = [];
		this.admins = [];
	}

	clearAdmins(): void {
		this.admins = [];
	}

	clearStudents(): void {
		this.students = [];
	}

	clearLecturers(): void {
		this.lecturers = [];
	}

	getLecturers(): Lecturer[] {
		return this.lecturers;
	}

	getStudents(): Student[] {
		return this.students;
	}

	getAdmins(): Org_Admin[] {
		return this.admins;
	}

	getWorkspaces() {
		return this.user.workspaces;
	}

	addAdmin(admin: Org_Admin): void {
		this.admins.push(admin);
	}

	addStudent(student: Student): void {
		this.students.push(student);
	}

	addLecturer(lecturer: Lecturer): void {
		this.lecturers.push(lecturer);
	}

	addWorkspace(workspace: any): void {
		this.user.workspaces.push(workspace);
	}
}

export default Admin;

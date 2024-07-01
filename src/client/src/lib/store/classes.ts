import type { UserData } from '$lib/store/types';

export class User {
	protected user: UserData;

	constructor(initial: UserData) {
		this.user = initial;
	}

	getFullName(): string {
		return `${this.user.first_name} ${this.user.last_name}`;
	}

	getUsername(): string {
		return this.user.username;
	}

	getEmail(): string {
		return this.user.email;
	}

	getImage(): string {
		return this.user.image;
	}

	getRole(): string {
		return this.user.role;
	}

	getOrganisation(): string {
		return this.user.organisation;
	}

	updateOrganisation(organisation: string): void {
		this.user.organisation = organisation;
	}
}

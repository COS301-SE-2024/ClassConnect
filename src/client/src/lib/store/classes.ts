import type { Org, UserData } from '$lib/store/types';

export class User {
	protected user: UserData;

	constructor(initial: UserData) {
		this.user = initial;
	}

	clearWorkspaces(): void {
		this.user.workspaces = [];
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

	getOrgDetails(): Org {
		return this.user.org;
	}

	getUserID(): string {
		return this.user.id;
	}

	updateOrganisation(organisation: Org): void {
		this.user.organisation = organisation.id;
		this.user.org = organisation;
	}
}

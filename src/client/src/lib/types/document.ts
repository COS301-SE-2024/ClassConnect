export interface UserDoc {
	_id: string;
}

export interface SessionDoc {
	_id: string;
	expires_at: Date;
	user_id: string;
}

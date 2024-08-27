import { Lucia, TimeSpan } from 'lucia';
import mongoose from '$db/db';
import { dev } from '$app/environment';
import type { ObjectId } from 'mongoose';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';

const users = mongoose.connection.collection<UserDoc>('users');
const sessions = mongoose.connection.collection<SessionDoc>('sessions');

const adapter = new MongodbAdapter(sessions as any, users as any);

export const lucia = new Lucia(adapter, {
	sessionExpiresIn: new TimeSpan(1, 'w'),
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			role: attributes.role,
			organisation: attributes.organisation,
			custom_password: attributes.custom_password
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		UserId: ObjectId;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface UserDoc {
	_id: ObjectId;
}

interface SessionDoc {
	_id: string;
	expires_at: Date;
	user_id: ObjectId;
}

interface DatabaseUserAttributes {
	role: string;
	organisation: ObjectId;
	custom_password: boolean;
}

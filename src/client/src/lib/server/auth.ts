import { Lucia } from 'lucia';
import mongoose from '$db/db';
import { dev } from '$app/environment';
import type { UserDoc, SessionDoc } from '../types/document';
import { MongodbAdapter } from '@lucia-auth/adapter-mongodb';

const sessions = mongoose.connection.collection<SessionDoc>('sessions');
const users = mongoose.connection.collection<UserDoc>('users');

const adapter = new MongodbAdapter(sessions as any, users as any);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
}

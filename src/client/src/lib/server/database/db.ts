import mongoose from 'mongoose';
import { MONGODB_URI } from '$env/static/private';

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log('Connected to the database');
	})
	.catch((error) => {
		console.error('Error connecting to the database: ', error);
	});

export async function retry_connection() {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log('Connected to the database');
	} catch (error) {
		if(!MONGODB_URI) {
			throw new Error('MONGODB_URI is not defined');
		}
		console.error('Error connecting to the database: ', error);
	}
}

export default mongoose;

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

export default mongoose;

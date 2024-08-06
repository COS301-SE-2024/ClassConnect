import AWS from 'aws-sdk';
import { REGION, ACCESS_KEY_ID, SECRET_ACCESS_KEY } from '$env/static/private';

AWS.config.update({
	region: REGION,
	accessKeyId: ACCESS_KEY_ID,
	secretAccessKey: SECRET_ACCESS_KEY
});

export async function updateConfig() {
	await AWS.config.update({
		region: REGION,
		accessKeyId: ACCESS_KEY_ID,
		secretAccessKey: SECRET_ACCESS_KEY
	});
}

export default AWS;

import { goto } from '$app/navigation';

export function navigateToParentRoute(url: string) {
	const segments = url.split('/').filter(Boolean);

	if (segments.length > 1) {
		segments.pop();

		const newPath = '/' + segments.join('/');
		goto(newPath);
	}
}

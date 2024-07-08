export function formatDate(date: Date): string {
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const dayName = days[date.getDay()];
	const dayNumber = date.getDate();
	const monthName = months[date.getMonth()];

	return `${dayName} - ${dayNumber} ${monthName}`;
}

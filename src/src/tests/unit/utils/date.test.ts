import { describe, it, expect } from 'vitest';
import { formatDate } from '$utils/date'; // Update this with the correct path

describe('formatDate', () => {
	it('should format the date correctly for a known date', () => {
		const date = new Date(2024, 8, 2); // September 2, 2024
		expect(formatDate(date)).toBe('Monday, 2 September');
	});

	it('should format the date correctly for a leap year date', () => {
		const date = new Date(2024, 1, 29); // February 29, 2024 (Leap Year)
		expect(formatDate(date)).toBe('Thursday, 29 February');
	});

	it('should format the date correctly for a date at the end of the year', () => {
		const date = new Date(2024, 11, 31); // December 31, 2024
		expect(formatDate(date)).toBe('Tuesday, 31 December');
	});

	it('should format the date correctly for a date at the beginning of the year', () => {
		const date = new Date(2024, 0, 1); // January 1, 2024
		expect(formatDate(date)).toBe('Monday, 1 January');
	});

	it('should format the date correctly for a random date', () => {
		const date = new Date(2024, 6, 15); // July 15, 2024
		expect(formatDate(date)).toBe('Monday, 15 July');
	});
});

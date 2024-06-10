import { render } from '@testing-library/svelte';
import Degree from '../lib/components/admin/+Degrees.svelte';
import { expect, test } from 'vitest';
import { degrees } from '../routes/degrees';

degrees.forEach((degree) => {
	test(`displays the degree: ${degree.program}`, () => {
		const { getByText } = render(Degree, { degrees });
		expect(getByText(degree.program)).toBeVisible();
	});
});

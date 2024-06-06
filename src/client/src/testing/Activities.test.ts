import { render } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import ActivityTimeline from '../lib/components/admin/+Activities.svelte';

test('renders activities correctly', () => {
    const { getByText } = render(ActivityTimeline);

    // Check that each activity title and description is rendered
    const activities = [
        { title: 'Budget Planning Meeting', date: '15 Oct', activity: 'Attend and contribute to the annual budget planning meeting to allocate resources for the upcoming academic year.' },
        { title: 'Faculty Evaluation', date: '18 Oct', activity: 'Conduct evaluations for tenured and non-tenured faculty members, reviewing their performance and providing feedback.' },
        { title: 'Student Affairs Committee', date: '20 Oct', activity: 'Participate in the Student Affairs Committee meeting to discuss and address student concerns and initiatives.' },
        { title: 'Campus Safety Review', date: '22 Oct', activity: 'Review campus safety protocols and emergency procedures with the safety department to ensure the well-being of students and staff.' },
        { title: 'Strategic Planning Workshop', date: '25 Oct', activity: 'Engage in a strategic planning workshop to set long-term goals and objectives for the university’s growth and development.' },
        { title: 'Alumni Networking Event', date: '30 Oct', activity: 'Host an alumni networking event to strengthen relationships with former students and encourage their involvement in university activities.' }
    ];

    activities.forEach(activity => {
        expect(getByText(activity.title)).toBeInTheDocument();
        expect(getByText(activity.activity)).toBeInTheDocument();
    });
});

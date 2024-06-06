// sum.test.js
import { render } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import Workspaces from '../lib/components/admin/+Workspaces.svelte';


test('it renders the correct number of workspace cards', () => {
    const workspaces = [
        { title: 'COS 333', description: 'Programming languages', image: 'COS333.png' },
        { title: 'COS 314', description: 'Artificial Intelligence', image: 'COS314.png' },
        { title: 'COS 344', description: 'Computer Graphics', image: 'COS344.png' }
    ];
    
    const { getByText } = render(Workspaces, { props: { workspaces } });

    expect(getByText('COS 333')).toBeInTheDocument();
    expect(getByText('Programming languages')).toBeInTheDocument();
    expect(getByText('COS 314')).toBeInTheDocument();
    expect(getByText('Artificial Intelligence')).toBeInTheDocument();
    expect(getByText('COS 344')).toBeInTheDocument();
    expect(getByText('Computer Graphics')).toBeInTheDocument();
});

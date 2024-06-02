import { mount } from 'cypress-svelte-unit-test';
import Organisation from '../../src/lib/components/admin/+Organisation.svelte';

describe('Test For Heading', () => {
  it('Has correct heading', () => {
    mount(Organisation);
    // Check if the heading "Organisation" appears on the page
    cy.contains('h2', 'Organisation').should('be.visible');
  });
});
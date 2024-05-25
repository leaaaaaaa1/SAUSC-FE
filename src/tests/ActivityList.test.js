import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ActivityList from '../pages/ActivityList/ActivityList';

test('renders ActivityList component', () => {
  render(
    <MemoryRouter>
      <ActivityList />
    </MemoryRouter>
  );
  expect(screen.getByText('Popis aktivnosti')).toBeInTheDocument();
});

test('search input updates searchTerm state', () => {
  render(
    <MemoryRouter>
      <ActivityList />
    </MemoryRouter>
  );

  const searchInput = screen.getByPlaceholderText('Pretraži aktivnosti');
  fireEvent.change(searchInput, { target: { value: 'Test Aktivnost' } });
  expect(searchInput.value).toBe('Test Aktivnost');
});

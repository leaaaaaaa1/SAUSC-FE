import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../pages/Header/Header';

test('renders Header component with navigation links', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
  expect(screen.getByText('Sportski centar')).toBeInTheDocument();
  expect(screen.getByText('Naslovna')).toBeInTheDocument();
  expect(screen.getByText('Aktivnosti')).toBeInTheDocument();
  expect(screen.getByText('Moje rezervacije')).toBeInTheDocument();
  expect(screen.getByText('Statusi Rezervacija')).toBeInTheDocument();
});

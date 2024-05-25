/* eslint-env node */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ActivityDetails from '../pages/ActivityDetails/ActivityDetails';

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('/api/v1/activity/1')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ name: 'Test Activity', description: 'Description', pricePerHour: '10.0' }),
      });
    } else if (url.includes('/api/v1/activity/1/equipment/list')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ equipmentList: [] }),
      });
    }
    return Promise.resolve({ ok: true });
  });

  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  global.fetch.mockClear();
  delete global.fetch;

  console.log.mockClear();
  console.error.mockClear();
});

describe('ActivityDetails Component', () => {
  test('renders ActivityDetails component for new activity', () => {
    render(
      <MemoryRouter initialEntries={['/activities/new']}>
        <Routes>
          <Route path="/activities/new" element={<ActivityDetails />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Nova aktivnost')).toBeInTheDocument();
  });

  test('renders ActivityDetails component for existing activity', async () => {
    render(
      <MemoryRouter initialEntries={['/activities/1']}>
        <Routes>
          <Route path="/activities/:id" element={<ActivityDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByDisplayValue('Test Activity')).toBeInTheDocument());
    expect(screen.getByDisplayValue('Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10.0')).toBeInTheDocument();
  });

  test('allows input in activity fields', () => {
    render(
      <MemoryRouter initialEntries={['/activities/new']}>
        <Routes>
          <Route path="/activities/new" element={<ActivityDetails />} />
        </Routes>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText('Naziv:');
    const descriptionInput = screen.getByLabelText('Opis:');
    const priceInput = screen.getByLabelText('Cijena po satu:');

    fireEvent.change(nameInput, { target: { value: 'Nova Aktivnost' } });
    fireEvent.change(descriptionInput, { target: { value: 'Novi opis' } });
    fireEvent.change(priceInput, { target: { value: '20.0' } });

    expect(nameInput.value).toBe('Nova Aktivnost');
    expect(descriptionInput.value).toBe('Novi opis');
    expect(priceInput.value).toBe('20.0');
  });

  test('submits the form and shows success message', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1 }),
      })
    );

    render(
      <MemoryRouter initialEntries={['/activities/new']}>
        <Routes>
          <Route path="/activities/new" element={<ActivityDetails />} />
        </Routes>
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText('Naziv:');
    const descriptionInput = screen.getByLabelText('Opis:');
    const priceInput = screen.getByLabelText('Cijena po satu:');
    const saveButton = screen.getByText('Spremi');

    fireEvent.change(nameInput, { target: { value: 'Nova Aktivnost' } });
    fireEvent.change(descriptionInput, { target: { value: 'Novi opis' } });
    fireEvent.change(priceInput, { target: { value: '20.0' } });

    await act(async () => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/activity', expect.anything());

    expect(console.log).toHaveBeenCalledWith(
      'Nova aktivnost spremljena',
      expect.objectContaining({
        name: 'Nova Aktivnost',
        description: 'Novi opis',
        pricePerHour: 20,
        idUser: 1,
      })
    );
  });

  test('handles API errors gracefully', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
      })
    );

    render(
      <MemoryRouter initialEntries={['/activities/new']}>
        <Routes>
          <Route path="/activities/new" element={<ActivityDetails />} />
        </Routes>
      </MemoryRouter>
    );

    const saveButton = screen.getByText('Spremi');

    await act(async () => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(console.error).toHaveBeenCalledWith('Greška pri spremanju aktivnosti');
  });
});

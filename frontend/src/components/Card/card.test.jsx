import React from 'react';
import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './card';

test('renders children', () => {
  render(
    <ContextProviders>
      <Card>Text</Card>
    </ContextProviders>
  );
  const card = screen.getByText(/Text/i);
  expect(card).toBeInTheDocument();
});

test('is clickable', () => {
  const mockFn = jest.fn();
  render(
    <ContextProviders>
      <Card onClick={mockFn}>Text</Card>
    </ContextProviders>
  );
  const button = screen.getByText(/Text/i);
  fireEvent.click(button);
  expect(mockFn).toHaveBeenCalled();
});

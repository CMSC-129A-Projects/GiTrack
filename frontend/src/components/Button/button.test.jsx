import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './button';

test('renders text', () => {
  render(<Button>Text</Button>);
  const button = screen.getByText(/Text/i);
  expect(button).toBeInTheDocument();
});

test('is clickable', () => {
  const mockFn = jest.fn();
  render(<Button onClick={mockFn}>Text</Button>);
  const button = screen.getByText(/Text/i);
  fireEvent.click(button);
  expect(mockFn).toHaveBeenCalled();
});

/** @jsxImportSource @emotion/react */

import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen, fireEvent } from '@testing-library/react';
import Add from './add';

test('is clickable', () => {
  const mockFn = jest.fn();
  render(
    <ContextProviders>
      <Add onClick={mockFn} />
    </ContextProviders>
  );
  const button = screen.getByText(/add/i);
  fireEvent.click(button);
  expect(mockFn).toHaveBeenCalled();
});

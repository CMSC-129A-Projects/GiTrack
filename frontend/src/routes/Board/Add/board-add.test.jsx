/** @jsxImportSource @emotion/react */

import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen, fireEvent } from '@testing-library/react';
import AddBoard from './board-add';

const setup = () => {
  render(
    <ContextProviders>
      <AddBoard />
    </ContextProviders>
  );
};

test('can input board name', () => {
  setup();
  const nameInput = screen.getByPlaceholderText('Type board name here...');
  fireEvent.change(nameInput, { target: { value: 'test' } });
  expect(nameInput).toHaveValue('test');
});

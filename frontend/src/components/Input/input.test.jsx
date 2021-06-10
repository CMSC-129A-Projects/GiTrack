/** @jsxImportSource @emotion/react */

import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './input';

const setup = (props) => {
  const utils = render(
    <ContextProviders>
      <Input label="Username" name="username" onChange={() => {}} {...props} />
    </ContextProviders>
  );
  const input = screen.getByRole('textbox');

  return {
    input,
    ...utils,
  };
};

test('renders label', () => {
  setup();
  const label = screen.getByText(/Name/i);
  expect(label).toBeInTheDocument();
});

test('renders error message', () => {
  setup({ error: 'This field is required' });
  const error = screen.getByText(/This field is required/i);
  expect(error).toBeInTheDocument();
});

test('can input text', () => {
  const { input } = setup();
  fireEvent.change(input, { target: { value: 'ohhskar' } });
  expect(input.value).toBe('ohhskar');
});

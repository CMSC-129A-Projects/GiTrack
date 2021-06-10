import React from 'react';
import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen, fireEvent } from '@testing-library/react';
import Search from './search';

const setup = (props) => {
  const utils = render(
    <ContextProviders>
      <Search label="Username" name="username" onChange={() => {}} {...props} />
    </ContextProviders>
  );
  const input = screen.getByRole('textbox');

  return {
    input,
    ...utils,
  };
};

test('can input text', () => {
  const { input } = setup();
  fireEvent.change(input, { target: { value: 'ohhskar' } });
  expect(input.value).toBe('ohhskar');
});

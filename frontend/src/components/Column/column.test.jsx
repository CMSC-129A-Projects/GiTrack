/** @jsxImportSource @emotion/react */

import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen } from '@testing-library/react';
import Column from './column';

test('renders title', () => {
  render(
    <ContextProviders>
      <Column title="Not Started" count={1}>
        <p>Text</p>
      </Column>
    </ContextProviders>
  );
  const title = screen.getByText(/Not Started 1/i);
  expect(title).toBeInTheDocument();
});

test('renders children', () => {
  render(
    <ContextProviders>
      <Column>
        <p>Text</p>
      </Column>
    </ContextProviders>
  );
  const children = screen.getByText(/Text/i);
  expect(children).toBeInTheDocument();
});

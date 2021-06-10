/** @jsxImportSource @emotion/react */

import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen } from '@testing-library/react';
import Icon from './icon';

test('renders icon', () => {
  render(
    <ContextProviders>
      <Icon icon="delete" />
    </ContextProviders>
  );
  const icon = screen.getByText(/delete/i);
  expect(icon).toBeInTheDocument();
});

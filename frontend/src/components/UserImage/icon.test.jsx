/** @jsxImportSource @emotion/react */

import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen } from '@testing-library/react';
import UserImage from './user-image';

const PROPS = {
  id: 1,
  name: 'ohhskar',
};

test('renders name', () => {
  render(
    <ContextProviders>
      <UserImage {...PROPS} />
    </ContextProviders>
  );
  const userImage = screen.getByText(/O/i);
  expect(userImage).toBeInTheDocument();
});

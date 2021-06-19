/** @jsxImportSource @emotion/react */

import { BrowserRouter } from 'react-router-dom';
import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './navbar';

const setup = () => {
  const utils = render(
    <BrowserRouter>
      <ContextProviders>
        <Navbar
          user={{ id: 1, username: 'ohhskar' }}
          boards={[{ id: 1, title: 'Test' }]}
        />
      </ContextProviders>
    </BrowserRouter>
  );
  const navbar = screen.getByRole('navigation');

  return {
    navbar,
    ...utils,
  };
};

test('renders navbar', () => {
  const { navbar } = setup();
  expect(navbar).toBeInTheDocument();
});

test('boards button is clickable', () => {
  setup();
  const boardsButton = screen.getByTestId('boardsButton');
  expect(boardsButton).toBeInTheDocument();
  fireEvent.click(boardsButton);
  const boardsDropdown = screen.getByTestId('boardsDropdown');
  expect(boardsDropdown).toBeInTheDocument();
});

test('user button is clickable', () => {
  setup();
  const userButton = screen.getByTestId('userButton');
  expect(userButton).toBeInTheDocument();
  fireEvent.click(userButton);
  const userDropdown = screen.getByTestId('userDropdown');
  expect(userDropdown).toBeInTheDocument();
});

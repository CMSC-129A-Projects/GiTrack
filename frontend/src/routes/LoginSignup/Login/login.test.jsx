/** @jsxImportSource @emotion/react */

import { Provider } from 'react-redux';
import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from 'configureStore';
import Login from './login';

const setup = () => {
  const store = configureStore();
  render(
    <Provider store={store}>
      <ContextProviders>
        <Login />
      </ContextProviders>
    </Provider>
  );
};

test('can input username', () => {
  setup();
  const usernameInput = screen.getByPlaceholderText('Username');
  fireEvent.change(usernameInput, { target: { value: 'test' } });
  expect(usernameInput).toHaveValue('test');
});

test('can input password', () => {
  setup();
  const passwordInput = screen.getByPlaceholderText('Password');
  fireEvent.change(passwordInput, { target: { value: 'password' } });
  expect(passwordInput).toHaveValue('password');
});

test('renders footer', () => {
  setup();
  const footer = screen.getByText('Project management with Git');
  expect(footer).toBeInTheDocument();
});

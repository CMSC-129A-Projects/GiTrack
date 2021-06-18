/** @jsxImportSource @emotion/react */

import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen } from '@testing-library/react';
import buttonVariants from 'components/Button/constants';
import LoginSignupCard from './login-signup-card';

const mockFn = jest.fn();

const setup = () => {
  const utils = render(
    <ContextProviders>
      <LoginSignupCard
        title="Hello 👋"
        subtext="Don't have an account yet?"
        linkText="Sign Up"
        link="./signup"
        action={{
          name: 'Sign In',
          onClick: mockFn,
          variant: buttonVariants.SMALL.PRIMARY,
        }}
        onSubmit={mockFn}
      >
        <p>children</p>
      </LoginSignupCard>
    </ContextProviders>
  );
  const loginSignupCard = screen.getByTestId('loginSignupCard');

  return {
    loginSignupCard,
    ...utils,
  };
};

test('renders card', () => {
  const { loginSignupCard } = setup();
  expect(loginSignupCard).toBeInTheDocument();
});

test('renders title', () => {
  setup();
  const title = screen.getByText(/Hello 👋/i);
  expect(title).toBeInTheDocument();
});

test('renders subtext', () => {
  setup();
  const subtext = screen.getByText(/Don't have an account yet?/i);
  expect(subtext).toBeInTheDocument();
});

test('renders button', () => {
  setup();
  const button = screen.getByRole('button');
  expect(button).toBeInTheDocument();
});

test('renders children', () => {
  setup();
  const button = screen.getByText('children');
  expect(button).toBeInTheDocument();
});

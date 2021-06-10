import React from 'react';
import ContextProviders from 'components/App/components/ContextProviders';
import buttonVariants from 'components/Button/constants';
import { render, screen } from '@testing-library/react';
import Modal from './modal';

const setup = () => {
  render(
    <ContextProviders>
      <Modal
        isOpen
        title="Confirm Removal"
        actions={[
          {
            name: 'Yes',
            onClick: () => {},
            variant: buttonVariants.SMALL.PRIMARY,
          },
        ]}
      >
        <p>something</p>
      </Modal>
    </ContextProviders>
  );
};

test('renders title', () => {
  setup();
  const title = screen.getByText(/Confirm Removal/i);
  expect(title).toBeInTheDocument();
});

test('renders button', () => {
  setup();
  const button = screen.getByText(/Yes/i);
  expect(button).toBeInTheDocument();
});

test('renders children', () => {
  setup();
  const children = screen.getByText(/something/i);
  expect(children).toBeInTheDocument();
});

/** @jsxImportSource @emotion/react */

import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen, fireEvent } from '@testing-library/react';
import RemoveConfirmationModal from './remove-confirmation-modal';

const successFn = jest.fn();
const closeFn = jest.fn();

const setup = () => {
  const utils = render(
    <ContextProviders>
      <RemoveConfirmationModal
        isOpen
        handleClose={closeFn}
        handleSuccess={successFn}
        message="Are you sure you want to remove this member"
      />
    </ContextProviders>
  );
  const removeConfirmationModal = screen.getByText(/Confirm Removal/i);

  return {
    removeConfirmationModal,
    ...utils,
  };
};

test('renders modal', () => {
  const { removeConfirmationModal } = setup();
  expect(removeConfirmationModal).toBeInTheDocument();
});

test('renders message', () => {
  setup();
  const message = screen.getByText(/Are you sure you want to remove this member/i);
  expect(message).toBeInTheDocument();
});

test('confirm button is clickable', () => {
  setup();
  const button = screen.getByText(/Yes/i);
  expect(button).toBeInTheDocument();
  fireEvent.click(button);
  expect(successFn).toHaveBeenCalled();
});

test('close button is clickable', () => {
  setup();
  const button = screen.getByText(/No/i);
  expect(button).toBeInTheDocument();
  fireEvent.click(button);
  expect(closeFn).toHaveBeenCalled();
});

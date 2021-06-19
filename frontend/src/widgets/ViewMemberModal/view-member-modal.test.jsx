/** @jsxImportSource @emotion/react */

import { Provider } from 'react-redux';
import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from 'configureStore';
import ViewMemberModal from './view-member-modal';

const mockFn = jest.fn();

const setup = () => {
  const store = configureStore();
  render(
    <Provider store={store}>
      <ContextProviders>
        <ViewMemberModal
          isOpen
          handleClose={mockFn}
          boardId={1}
          member={{ id: 1, username: 'ohhskar' }}
          refreshBoardMembers={() => {}}
        />
      </ContextProviders>
    </Provider>
  );
};

test('renders username', () => {
  setup();
  const username = screen.getByText(/ohhskar/i);
  expect(username).toBeInTheDocument();
});

test('close button is clickable', () => {
  setup();
  const button = screen.getByText(/Close/i);
  expect(button).toBeInTheDocument();
  fireEvent.click(button);
  expect(mockFn).toHaveBeenCalled();
});

/** @jsxImportSource @emotion/react */

import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen, fireEvent } from '@testing-library/react';
import BoardMembers from './board-members';

const openFn = jest.fn();
const viewFn = jest.fn();

const setup = () => {
  const utils = render(
    <ContextProviders>
      <BoardMembers
        members={[
          { id: 1, username: 'ohhskar' },
          { id: 2, username: 'rymnjs' },
        ]}
        setIsAddDeveloperModalOpened={openFn}
        setMemberToView={viewFn}
      />
    </ContextProviders>
  );
  const boardMembers = screen.getByTestId('boardMembers');

  return {
    boardMembers,
    ...utils,
  };
};

test('renders wrapper', () => {
  const { boardMembers } = setup();
  expect(boardMembers).toBeInTheDocument();
});

test('renders add member button', () => {
  setup();
  const button = screen.getByText(/add/i);
  expect(button).toBeInTheDocument();
});

test('renders member button', () => {
  setup();
  const memberButton = screen.getByTestId('member-1');
  expect(memberButton).toBeInTheDocument();
});

test('is add member button clickable', () => {
  setup();
  const button = screen.getByText(/add/i);
  fireEvent.click(button);
  expect(openFn).toHaveBeenCalled();
});

test('is member button clickable', () => {
  setup();
  const memberButton = screen.getByTestId('member-1');
  fireEvent.click(memberButton);
  expect(viewFn).toHaveBeenCalled();
});

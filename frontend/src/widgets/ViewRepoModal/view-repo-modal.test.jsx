/** @jsxImportSource @emotion/react */

import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen, fireEvent } from '@testing-library/react';
import ViewRepoModal from './view-repo-modal';

const mockFn = jest.fn();

const setup = () => {
  render(
    <ContextProviders>
      <ViewRepoModal
        isOpen
        handleClose={mockFn}
        boardId={1}
        repo={{ id: 1, full_name: 'ohhskar/gitrack', url: 'repos/ohhskar/gitrack' }}
        refreshBoardRepos={() => {}}
      />
    </ContextProviders>
  );
};

test('renders repo name', () => {
  setup();
  const repoName = screen.getByText('gitrack');
  expect(repoName).toBeInTheDocument();
});

test('renders link', () => {
  setup();
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', 'https://github.com/ohhskar/gitrack');
});

test('close button is clickable', () => {
  setup();
  const button = screen.getByText('Close');
  expect(button).toBeInTheDocument();
  fireEvent.click(button);
  expect(mockFn).toHaveBeenCalled();
});

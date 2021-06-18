/** @jsxImportSource @emotion/react */

import ContextProviders from 'components/App/components/ContextProviders';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './task-card';

const mockFn = jest.fn();

const setup = () => {
  const utils = render(
    <ContextProviders>
      <TaskCard
        title="Test Task"
        members={[
          { id: 1, username: 'ohhskar' },
          { id: 2, username: 'rymnjs' },
        ]}
        assignees={[{ id: 1, username: 'ohhskar' }]}
        tag="master"
        targetDate="2021-10-05"
        onClick={mockFn}
      />
    </ContextProviders>
  );
  const taskCard = screen.getByTestId('taskCard');

  return {
    taskCard,
    ...utils,
  };
};

test('renders card', () => {
  const { taskCard } = setup();
  expect(taskCard).toBeInTheDocument();
});

test('renders title', () => {
  setup();
  const title = screen.getByText(/Test Task/i);
  expect(title).toBeInTheDocument();
});

test('renders tag', () => {
  setup();
  const tag = screen.getByText(/master/i);
  expect(tag).toBeInTheDocument();
});

test('is clickable', () => {
  const { taskCard } = setup();
  fireEvent.click(taskCard);
  expect(mockFn).toHaveBeenCalled();
});

/** @jsxImportSource @emotion/react */

import { useState } from 'react';
import { useParams } from 'react-router-dom';

import useBoard from 'hooks/useBoard';
import useBoardTasks from 'hooks/useBoardTasks';

import Spinner from 'components/Spinner';
import Column from 'components/Column';
import Button from 'components/Button';
import buttonVariants from 'components/Button/constants';
import TaskCard from 'widgets/TaskCard';

import AddTaskModal from 'widgets/AddTaskModal';
import ViewTaskModal from 'widgets/ViewTaskModal';

// Style
import * as style from './board-index-styles';

export default function BoardIndex() {
  const { boardId } = useParams();

  const [isAddTaskModalOpened, setIsAddTaskModalOpened] = useState(false);
  const [taskToView, setTaskToView] = useState(null);

  const { isLoading: isBoardLoading, board } = useBoard({ boardId });
  const {
    isLoading: isBoardTasksLoading,
    boardTasks,
    refresh: refreshBoardTasks,
  } = useBoardTasks({ boardId });

  if (isBoardLoading || isBoardTasksLoading) {
    return <Spinner />;
  }

  const notStartedTasks = boardTasks.tasks.filter((task) => task.column_id === 0);
  const inProgressTasks = boardTasks.tasks.filter((task) => task.column_id === 1);
  const mergedTasks = boardTasks.tasks.filter((task) => task.column_id === 2);

  return (
    <>
      <AddTaskModal
        boardId={boardId}
        isOpen={isAddTaskModalOpened}
        handleClose={() => setIsAddTaskModalOpened(false)}
        refreshBoardTasks={refreshBoardTasks}
      />
      {taskToView && (
        <ViewTaskModal
          task={taskToView}
          isOpen={taskToView !== null}
          handleClose={() => setTaskToView(null)}
        />
      )}
      <div css={style.boardIndex}>
        <div css={style.boardIndex_header}>
          <p css={style.boardIndex_header_boardName}>Board Name</p>
          <h2 css={style.boardIndex_header_name}>{board.title}</h2>
        </div>
        <div css={style.boardIndex_columns}>
          <Column title="Not Started" count={notStartedTasks?.length}>
            {notStartedTasks.map((task) => (
              <TaskCard title={task.title} onClick={() => setTaskToView(task)} />
            ))}
          </Column>
          <Column title="In Progress" count={inProgressTasks?.length}>
            {inProgressTasks.map((task) => (
              <TaskCard title={task.title} onClick={() => setTaskToView(task)} />
            ))}
          </Column>
          <Column title="Merged" count={mergedTasks?.length}>
            {mergedTasks.map((task) => (
              <TaskCard title={task.title} onClick={() => setTaskToView(task)} />
            ))}
          </Column>
        </div>
        <Button
          onClick={() => setIsAddTaskModalOpened(true)}
          variant={buttonVariants.XLARGE.PRIMARY}
          icon="add"
          css={style.boardIndex_button}
        >
          Create Task
        </Button>
      </div>
    </>
  );
}

/** @jsxImportSource @emotion/react */

import { useState } from 'react';

import Column from 'components/Column';
import Button from 'components/Button';
import buttonVariants from 'components/Button/constants';
import TaskCard from 'widgets/TaskCard';

import AddTaskModal from 'widgets/AddTaskModal';
import ViewTaskModal from 'widgets/ViewTaskModal';

// Style
import * as style from './board-index-styles';

export default function BoardIndex() {
  const [isAddTaskModalOpened, setIsAddTaskModalOpened] = useState(false);
  const [isViewTaskModalOpened, setIsViewTaskModalOpened] = useState(false);

  return (
    <>
      <AddTaskModal
        isOpen={isAddTaskModalOpened}
        handleClose={() => setIsAddTaskModalOpened(false)}
      />
      <ViewTaskModal
        isOpen={isViewTaskModalOpened}
        handleClose={() => setIsViewTaskModalOpened(false)}
      />
      <div css={style.boardIndex}>
        <div css={style.boardIndex_header}>
          <p css={style.boardIndex_header_boardName}>Board Name</p>
          <h2 css={style.boardIndex_header_name}>CovCheck</h2>
        </div>
        <div css={style.boardIndex_columns}>
          <Column title="Not Started" count={2}>
            <TaskCard
              title="[Frontend] Add Section Component"
              body="Add Section component"
            />
          </Column>
          <Column title="In Progress" count={2}>
            <TaskCard
              title="[Frontend] Add Card Component"
              body="Create a Card component"
              tag="feature/add-card"
              onClick={() => setIsViewTaskModalOpened(true)}
            />
          </Column>
          <Column title="Merged" count={2}>
            <TaskCard
              title="[Frontend] Add Text Component"
              body="Create a Text component"
              tag="feature/add-text"
            />
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

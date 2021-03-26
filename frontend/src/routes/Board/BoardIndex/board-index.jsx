/** @jsxImportSource @emotion/react */

import { useState } from 'react';

import Column from 'components/Column';
import Button from 'components/Button';
import buttonVariants from 'components/Button/constants';

import AddTaskModal from 'widgets/AddTaskModal';

// Style
import * as style from './board-index-styles';

export default function BoardIndex() {
  const [isAddTaskModalOpened, setIsAddTaskModalOpened] = useState(false);

  return (
    <>
      <AddTaskModal
        isOpen={isAddTaskModalOpened}
        handleClose={() => setIsAddTaskModalOpened(false)}
      />
      <div css={style.boardIndex}>
        <div css={style.boardIndex_header}>
          <p css={style.boardIndex_header_boardName}>Board Name</p>
          <h2 css={style.boardIndex_header_name}>CovCheck</h2>
        </div>
        <div css={style.boardIndex_columns}>
          <Column title="Not Started" count={2} />
          <Column title="In Progress" count={2} />
          <Column title="Merged" count={2} />
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

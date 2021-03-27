/** @jsxImportSource @emotion/react */

import Column from 'components/Column';
import Button from 'components/Button';
import buttonVariants from 'components/Button/constants';
import TaskCard from 'widgets/TaskCard';
import Assignee from 'assets/images/user-image.svg'

// Style
import * as style from './board-index-styles'

export default function BoardIndex() {
  return (
    <div css={style.boardIndex}>
      <div css={style.boardIndex_header}>
        <p css={style.boardIndex_header_boardName}>Board Name</p>
        <h2 css={style.boardIndex_header_name}>CovCheck</h2>
      </div>
      <div css={style.boardIndex_columns}>
        <Column title="Not Started" count={2} >
          <TaskCard title="[Frontend] Add Section Component" 
          body="Add Section component"
          assignee={Assignee} />
        </Column>
        <Column title="In Progress" count={2}>
          <TaskCard title = "[Frontend] Add Card Component" 
          body = "Create a Card component" 
          tag="feature/add-card"
          assignee={Assignee} />
        </Column>
        <Column title="Merged" count={2}>
          <TaskCard title = "[Frontend] Add Text Component" 
            body = "Create a Text component" 
            tag="feature/add-text"
            assignee={Assignee} />
        </Column>
      </div>
      <Button variant={buttonVariants.XLARGE.PRIMARY} icon="add" css={style.boardIndex_button}>
        Create Task
      </Button>
    </div>
  );
}

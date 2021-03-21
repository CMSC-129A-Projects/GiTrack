/** @jsxImportSource @emotion/react */

import Column from 'components/Column';
import Button from 'components/Button';
import buttonVariants from 'components/Button/constants';

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
        <Column title="Not Started" count={2} />
        <Column title="In Progress" count={2} />
        <Column title="Merged" count={2} />
      </div>
      <Button variant={buttonVariants.XLARGE.PRIMARY} icon="add" css={style.boardIndex_button}>
        Create Task
      </Button>
    </div>
  );
}

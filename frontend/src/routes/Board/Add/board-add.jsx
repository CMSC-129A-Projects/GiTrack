/** @jsxImportSource @emotion/react */

// Style
import * as style from './board-add-styles';

import Button from 'components/Button';
import buttonVariants from 'components/Button/constants';

export default function AddBoard() {
  return (
    <div css={style.addBoard}>
      <input
        css={style.addBoard_input}
        type="text"
        placeholder="Type board name here..."
        name="name"
      />
      <Button variant={buttonVariants.LARGE.PRIMARY}>
        Create Board
      </Button>
    </div>
  );
}

/** @jsxImportSource @emotion/react */

import Button from 'components/Button';
import buttonVariants from 'components/Button/constants';

// Style
import * as style from './board-add-styles';

export default function AddBoard() {
  return (
    <div css={style.addBoard}>
      <input
        css={style.addBoard_input}
        type="text"
        placeholder="Type board name here..."
        name="name"
      />
      <Button variant={buttonVariants.LARGE.PRIMARY}>Create Board</Button>
    </div>
  );
}

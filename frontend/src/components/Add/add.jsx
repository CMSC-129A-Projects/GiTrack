/** @jsxImportSource @emotion/react */

import Icon from 'components/Icon';

import * as style from './add-styles';

export default function Add({ onClick, ...passedProps }) {
  return (
    <button css={style.add} onClick={onClick} {...passedProps}>
      <Icon icon="add" css={style.add_icon} />
    </button>
  );
}

/** @jsxImportSource @emotion/react */

// Style
import * as style from './user-image-styles';

const COLORS = ['red', 'blue', 'purple', 'green', 'orange'];

export default function UserImage({ id, name, ...passedProps }) {
  return (
    <div
      css={[style.userImage, style[`userImage___${COLORS[id % COLORS.length]}`]]}
      {...passedProps}
    >
      <p css={style.userImage_text}>{name[0].toUpperCase()}</p>
    </div>
  );
}

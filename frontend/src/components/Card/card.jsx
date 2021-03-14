/** @jsxImportSource @emotion/react */

// Style
import * as style from './card-styles';

export default function Card({ children, ...passedProps }) {
  return (
    <div css={style.card} {...passedProps}>
      {children}
    </div>
  );
}

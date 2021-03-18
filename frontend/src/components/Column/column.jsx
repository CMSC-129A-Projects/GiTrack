/** @jsxImportSource @emotion/react */

// Style
import * as style from './column-styles';

export default function Column({ children, title, count, ...passedProps }) {
  return (
    <div css={style.column} {...passedProps}>
      <p>
        {title} {count}
      </p>
      {children}
    </div>
  );
}

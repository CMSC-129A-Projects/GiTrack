/** @jsxImportSource @emotion/react */

// Style
import * as style from './spinner-styles';

export default function Spinner({ ...passedProps }) {
  return (
    <div css={style.spinner_container} {...passedProps}>
      <svg css={style.spinner} viewBox="25 25 50 50">
        <circle css={style.spinner_circle} cx="50" cy="50" r="20" />
      </svg>
    </div>
  );
}

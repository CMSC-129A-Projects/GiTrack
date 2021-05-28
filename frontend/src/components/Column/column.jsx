/** @jsxImportSource @emotion/react */

// Style
import Spinner from 'components/Spinner';
import * as style from './column-styles';

export default function Column({ isLoading, children, title, count, ...passedProps }) {
  return (
    <div css={style.column} {...passedProps}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <p css={style.column_title}>
            {title} {count}
          </p>
          {children}
        </>
      )}
    </div>
  );
}

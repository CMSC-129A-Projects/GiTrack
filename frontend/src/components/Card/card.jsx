/** @jsxImportSource @emotion/react */

// Style
import * as style from './card-styles';

export default function Card({
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...passedProps
}) {
  const keyPressHandler = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  };
  return (
    <div
      role={onClick ? 'button' : null}
      onClick={onClick}
      onKeyPress={onClick ? keyPressHandler : null}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      css={onClick ? style.card___clickable : style.card}
      {...passedProps}
    >
      {children}
    </div>
  );
}

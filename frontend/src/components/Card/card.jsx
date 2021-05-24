/** @jsxImportSource @emotion/react */
import { forwardRef } from 'react';

// Style
import * as style from './card-styles';

const Card = forwardRef(
  ({ children, onClick, onMouseEnter, onMouseLeave, ...passedProps }, ref) => {
    const keyPressHandler = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick();
      }
    };

    return (
      <div
        ref={ref}
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
);

export default Card;

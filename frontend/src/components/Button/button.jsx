/** @jsxImportSource @emotion/react */

// Style
import * as style from './button-styles';

import Icon from '../Icon';

export default function Button({
  children,
  icon,
  variant,
  onClick,
  type,
  disabled,
  element,
  ...passedProps
}) {
  const T = element;
  return (
    <T
      type={type}
      css={style[`button___${variant}`]}
      onClick={onClick}
      disabled={disabled}
      {...passedProps}
    >
      {icon && <Icon icon={icon} css={icon && children && style.button_icon} />}
      {children}
    </T>
  );
}

Button.defaultProps = {
  type: 'button',
  element: 'button',
};

/** @jsxImportSource @emotion/react */

// Style
import * as style from './button-styles'

import Icon from '../Icon'

export default function Button({
  children,
  icon,
  variant,
  onClick,
  type,
  disabled,
  ...passedProps
}) {
  return (
    <button
      type={type}
      css={style[`button___${variant}`]}
      onClick={onClick}
      disabled={disabled}
      {...passedProps}
    >
      {icon && <Icon icon={icon} css={icon && children && style.button_icon} />}
      {children}
    </button>
  )
}

Button.defaultProps = {
  type: 'button',
}

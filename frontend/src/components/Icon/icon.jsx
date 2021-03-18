/** @jsxImportSource @emotion/react */

import * as style from './icon-styles'

export default function Icon({ icon, ...passedProps }) {
  return (
    <i css={style.icon} alt={icon} {...passedProps}>
      {icon}
    </i>
  )
}

/** @jsxImportSource @emotion/react */

// Style
import * as style from './search-styles'

import Icon from '../Icon'

export default function Search({ name, disabled, onChange, ...passedProps }) {
  return (
    <div css={style.search} {...passedProps}>
      <Icon icon="search" css={style.search_icon} />
      <input
        type="text"
        css={style.search_input}
        placeholder="Search"
        name={name}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  )
}

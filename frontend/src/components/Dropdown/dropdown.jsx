/** @jsxImportSource @emotion/react */

import Select from 'react-select'

// Style
import * as style from './dropdown-styles'

export default function Dropdown({
  options,
  name,
  value,
  error,
  onChange,
  placeholder,
  label,
  disabled,
  ...passedProps
}) {
  return (
    <div {...passedProps}>
      {label && <p css={style.dropdown_label}>{label}</p>}
      <Select
        options={options}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        styles={style.dropdown}
        isDisabled={disabled}
      />
      {error && <p css={style.dropdown_errorMessage}>{error}</p>}
    </div>
  )
}

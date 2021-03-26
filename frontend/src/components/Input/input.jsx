/** @jsxImportSource @emotion/react */

// Style
import * as style from './input-styles'

export default function Input({
  placeholder,
  name,
  type,
  label,
  value,
  disabled,
  min,
  max,
  error,
  onChange,
  step,
  ...passedProps
}) {
  return (
    <div {...passedProps}>
      {label && <p css={style.input_label}>{label}</p>}
      <input
        css={[style.input, error ? style.input___error : null]}
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
      />
      {error && <p css={style.input_errorMessage}>{error}</p>}
    </div>
  )
}

Input.defaultProps = {
  type: 'text',
}

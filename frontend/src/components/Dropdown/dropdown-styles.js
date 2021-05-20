import { css } from '@emotion/react';
import theme from 'utils/theme';

export const dropdown = {
  control: (base, state) => ({
    ...base,
    backgroundColor: theme.color.neutral[0],
    borderRadius: '8px',
    borderWidth: '1px',
    borderColor: state.isFocused ? theme.color.primary[3] : theme.color.neutral[3],
    boxShadow: state.isFocused ? '0 0 3px rgb(123, 117, 235);' : null,
    padding: '8px 12px',

    '&:hover': {
      borderColor: theme.color.primary[3],
    },
  }),
  placeholder: (base, state) => ({
    ...base,
    display:
      state.isFocused || state.isSelected || state.selectProps.inputValue
        ? 'none'
        : 'block',
    margin: '0',
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    overflow: 'initial',
    color: theme.color.neutral[7],
  }),
  indicatorSeparator: (base) => ({
    ...base,
    display: 'none',
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: theme.color.neutral[5],
    padding: '0',
    svg: {
      height: '16px',
      width: '16px',
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: '0 8px',
    svg: {
      height: '16px',
      width: '16px',
    },
  }),
  multiValue: (base) => ({
    ...base,
    borderRadius: '16px',
    margin: '0 2px',
    padding: '0 4px',
    backgroundColor: theme.color.neutral[2],
    fontWeight: '600',
  }),
  multiValueRemove: (base) => ({
    ...base,
    borderRadius: '0 12px 12px 0',
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.color.red[3],
    },
  }),
  noOptionsMessage: (base) => ({
    ...base,
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    color: theme.color.neutral[7],
  }),
  groupHeading: (base) => ({
    ...base,
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.75rem',
    lineHeight: '1.5',
    color: theme.color.neutral[3],
  }),
  input: (base) => ({
    ...base,
    margin: '0',
    padding: '0',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor:
      state.isFocused || state.isSelected ? theme.color.neutral[1] : null,
    color: theme.color.neutral[7],
    opacity: '1',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    overflow: 'initial',
  }),
};

export const dropdown_errorMessage = css`
  color: ${theme.color.red[3]};
  ${theme.text.bodySM};
  margin: 4px 0 0 0;
`;

export const dropdown_label = css`
  color: ${theme.color.neutral[7]};
  ${theme.text.titleMD};
  margin: 0 0 4px 0;
`;

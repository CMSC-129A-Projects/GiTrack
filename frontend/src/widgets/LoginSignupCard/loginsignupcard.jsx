/** @jsxImportSource @emotion/react */

import Card from 'components/Card';
import Button from 'components/Button';

// Style
import * as style from './loginsignupcard-styles';

export default function LoginSignupCard({
  title,
  children,
  action,
  subtext,
  linkText,
  link,
  ...passedProps
}) {
  return (
    <Card css={style.loginSignupCard} {...passedProps}>
      <p css={style.loginSignupCard_title}>{title}</p>
      {children}
      {action.map(({ name, variant, onClick, disabled }) => (
        <Button
          css={style.loginSignupCard_button}
          variant={variant}
          disabled={disabled}
          onClick={onClick}
        >
          {name}
        </Button>
      ))}
      <p css={style.loginSignupCard_subtext}>
        {subtext}
        <a href={link} css={style.loginSignupCard_link}>
          {linkText}
        </a>
      </p>
    </Card>
  );
}

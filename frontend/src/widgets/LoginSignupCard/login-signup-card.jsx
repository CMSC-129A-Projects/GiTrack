/** @jsxImportSource @emotion/react */

import Card from 'components/Card';
import Button from 'components/Button';

// Style
import * as style from './login-signup-card-styles';

export default function LoginSignupCard({
  title,
  children,
  action: { variant, disabled, onClick, name },
  subtext,
  linkText,
  link,
  onSubmit,
  ...passedProps
}) {
  return (
    <Card css={style.loginSignupCard} data-testid="loginSignupCard" {...passedProps}>
      <p css={style.loginSignupCard_title}>{title}</p>
      <form onSubmit={onSubmit}>
        {children}
        <Button
          css={style.loginSignupCard_button}
          variant={variant}
          disabled={disabled}
          onClick={onClick}
          type="submit"
        >
          {name}
        </Button>
      </form>
      <p css={style.loginSignupCard_subtext}>
        {subtext}
        <a href={link} css={style.loginSignupCard_link}>
          {linkText}
        </a>
      </p>
    </Card>
  );
}

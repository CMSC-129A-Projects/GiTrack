/** @jsxImportSource @emotion/react */

import Card from 'components/Card';
import Button from 'components/Button';

// Style
import * as style from './loginsignupcard-styles';

export default function TaskCard({
  title,
  children,
  action,
  subtext,
  linktext,
  link,
  ...passedProps
}) {
  return (
    <Card css={style.loginSignupCard} {...passedProps}>
      <p css={style.loginSignupCard_title}>{title}</p>
      <div css={style.loginSignupCard_children}>{children}</div>
      {action.map(({ name, variant, onClick, disabled, isLoading }) => (
        <Button
          css={style.loginSignupCard_button}
          variant={variant}
          disabled={disabled || isLoading}
          onClick={onClick}
        >
          {name}
        </Button>
      ))}
      <p css={style.loginSignupCard_subtext}>
        {subtext}
        <a href={link} css={style.loginSignupCard_link}>
          {linktext}
        </a>
      </p>
    </Card>
  );
}

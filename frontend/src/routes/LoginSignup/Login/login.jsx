/** @jsxImportSource @emotion/react */

import Logo from 'assets/images/logowhite.svg';

import Input from 'components/Input';
import buttonVariants from 'components/Button/constants';
import LoginSignupCard from 'widgets/LoginSignupCard';

// Style
import * as style from './login-styles';

export default function LoginPage() {
  return (
    <div css={style.loginPage}>
      <div css={style.loginPage_imageContainer}>
        <img src={Logo} alt="gitrack logo" css={style.loginPage_image} />
      </div>
      <LoginSignupCard
        css={style.loginCard}
        title="Hello 👋"
        subtext="Don't have an account yet? "
        linkText="Sign Up"
        link="./signup"
        action={[
          {
            name: 'Sign In',
            onClick: () => {},
            variant: buttonVariants.SMALL.PRIMARY,
          },
        ]}
      >
        <Input css={style.loginPage_inputs} placeholder="Username" />
        <Input placeholder="Password" type="password" />
      </LoginSignupCard>
      <p css={style.loginPage_footer}>Project management with Git</p>
    </div>
  );
}

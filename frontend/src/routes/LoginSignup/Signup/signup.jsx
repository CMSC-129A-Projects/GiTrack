/** @jsxImportSource @emotion/react */

import Logo from 'assets/images/logowhite.svg';

import Input from 'components/Input';
import buttonVariants from 'components/Button/constants';
import LoginSignupCard from 'widgets/LoginSignupCard';

// Style
import * as style from './signup-styles';

export default function SignupPage() {
  return (
    <div css={style.signupPage}>
      <div css={style.signupPage_image}>
        <img src={Logo} alt="gitrack logo" css={style.signupPage_imageContainer} />
      </div>
      <LoginSignupCard
        css={style.signupCard}
        title="Sign Up 🎉"
        subtext="Already have an account? "
        linkText="Sign In"
        link="./login"
        action={[
          {
            name: 'Sign Up',
            onClick: () => {},
            variant: buttonVariants.SMALL.PRIMARY,
          },
        ]}
      >
        <Input css={style.signupPage_inputs} placeholder="Email" />
        <Input css={style.signupPage_inputs} placeholder="Username" />
        <Input css={style.signupPage_inputs} placeholder="Password" type="password" />
        <Input placeholder="Confirm Password" type="password" />
      </LoginSignupCard>
    </div>
  );
}

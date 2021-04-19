/** @jsxImportSource @emotion/react */
import { useForm } from 'react-hook-form';

import Logo from 'assets/images/logowhite.svg';

// components
import Input from 'components/Input';
import buttonVariants from 'components/Button/constants';

// widgets
import LoginSignupCard from 'widgets/LoginSignupCard';

// services
import AuthService from 'services/AuthService';

// Style
import * as style from './signup-styles';

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    AuthService.register({ body: data }).then((registerResponse) => {
      console.log(registerResponse);
    });
  };

  return (
    <div css={style.signupPage}>
      <div css={style.signupPage_imageContainer}>
        <img src={Logo} alt="gitrack logo" css={style.signupPage_image} />
      </div>
      <LoginSignupCard
        title="Sign Up 🎉"
        subtext="Already have an account? "
        linkText="Sign In"
        link="./login"
        action={{
          name: 'Sign Up',
          onClick: () => {},
          variant: buttonVariants.SMALL.PRIMARY,
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          css={style.signupPage_inputs}
          placeholder="Email"
          type="email"
          {...register('email', { required: true })}
        />
        <Input
          css={style.signupPage_inputs}
          placeholder="Username"
          {...register('username', { required: true })}
        />
        <Input
          css={style.signupPage_inputs}
          placeholder="Password"
          type="password"
          {...register('password', { required: true })}
        />
        <Input placeholder="Confirm Password" type="password" />
      </LoginSignupCard>
    </div>
  );
}

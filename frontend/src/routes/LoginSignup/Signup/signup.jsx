/** @jsxImportSource @emotion/react */
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

import Logo from 'assets/images/logowhite.svg';

// components
import Input from 'components/Input';
import buttonVariants from 'components/Button/constants';

// widgets
import LoginSignupCard from 'widgets/LoginSignupCard';

// services
import AuthService from 'services/AuthService';

// actions
import { actions as usersActions } from 'ducks/reducers/users';

// Style
import * as style from './signup-styles';

export default function SignupPage() {
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  const onSubmit = (formData) => {
    AuthService.register({ body: formData }).then(() => {
      AuthService.login({
        body: {
          username: formData.username,
          password: formData.password,
        },
      }).then((loginResponse) => {
        const { data } = loginResponse;

        dispatch(
          usersActions.loginActions.loginUpdate({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            user: {
              id: data.id,
              username: data.username,
            },
          })
        );
      });
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

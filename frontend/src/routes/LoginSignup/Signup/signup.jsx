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

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    if (formData.password !== formData.confirm_password) {
      setError('confirm_password', {
        type: 'manual',
        message: 'Passwords must match',
      });

      return;
    }

    AuthService.register({
      body: {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      },
    }).then(() => {
      AuthService.login({
        body: {
          username: formData.username,
          password: formData.password,
        },
      })
        .then((loginResponse) => {
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
        })
        .catch(() => {
          setError('email', {
            type: 'manual',
            message: 'A user with this email address already exists',
          });
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
          error={errors.email ? errors.email.message : null}
          placeholder="Email"
          type="email"
          {...register('email', { required: 'This field is required' })}
        />
        <Input
          css={style.signupPage_inputs}
          error={errors.username ? errors.username.message : null}
          placeholder="Username"
          {...register('username', { required: 'This field is required' })}
        />
        <Input
          css={style.signupPage_inputs}
          error={errors.password ? errors.password.message : null}
          placeholder="Password"
          type="password"
          {...register('password', { required: 'This field is required' })}
        />
        <Input
          error={errors.confirm_password ? errors.confirm_password.message : null}
          placeholder="Confirm Password"
          type="password"
          {...register('confirm_password', { required: 'This field is required' })}
        />
      </LoginSignupCard>
    </div>
  );
}

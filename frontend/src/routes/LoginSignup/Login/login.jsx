/** @jsxImportSource @emotion/react */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

import Logo from 'assets/images/logowhite.svg';

import Input from 'components/Input';
import buttonVariants from 'components/Button/constants';
import LoginSignupCard from 'widgets/LoginSignupCard';

import { actions as usersActions } from 'ducks/reducers/users';
import AuthService from 'services/AuthService';

// Style
import * as style from './login-styles';

export default function LoginPage() {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const watchUsername = watch("username", false);
  const watchPassword = watch("password", false);

  const onSubmit = (formData) => {
    AuthService.login({ body: formData })
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
        setError('overall', {
          type: 'manual',
          message: 'Incorrect username or password',
        });
      });
  };

  useEffect(() => {
    clearErrors();
  }, [watchUsername, watchPassword])

  return (
    <div css={style.loginPage}>
      <div css={style.loginPage_imageContainer}>
        <img src={Logo} alt="gitrack logo" css={style.loginPage_image} />
      </div>
      <LoginSignupCard
        title="Hello 👋"
        subtext="Don't have an account yet? "
        linkText="Sign Up"
        link="./signup"
        action={{
          name: 'Sign In',
          onClick: () => {},
          variant: buttonVariants.SMALL.PRIMARY,
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          css={style.loginPage_input}
          error={errors.username ? errors.username.message : null}
          placeholder="Username"
          {...register('username', { required: 'Please input your username' })}
        />
        <Input
          css={style.loginPage_input}
          error={errors.password ? errors.password.message : null}
          placeholder="Password"
          type="password"
          {...register('password', { required: 'Please input your password' })}
        />
        {errors.overall && (
          <p css={style.loginPage_errorMessage}>{errors.overall.message}</p>
        )}
      </LoginSignupCard>
      <p css={style.loginPage_footer}>Project management with Git</p>
    </div>
  );
}

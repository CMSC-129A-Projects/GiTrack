/** @jsxImportSource @emotion/react */
import { lazy, Suspense } from 'react';
import { BrowserRouter as Switch, Redirect } from 'react-router-dom';

import NoAuthRoute from 'hocs/NoAuthRoute';
import Background from 'assets/images/Vector.svg';

// Style
import * as style from './loginsignup-styles';

const Login = lazy(() => import('./Login'));
const Signup = lazy(() => import('./Signup'));

export default function LoginSignup() {
  return (
    <div css={style.login}>
      <div
        css={{
          backgroundImage: `url(${Background})`,
          width: '100vw',
          height: '100vh',
          backgroundSize: 'cover',
        }}
      >
        <Suspense fallback={<div>loading</div>}>
          <Switch>
            <NoAuthRoute path="/login">
              <Login />
            </NoAuthRoute>
            <NoAuthRoute path="/signup">
              <Signup />
            </NoAuthRoute>
            <Redirect from="/" to="login" />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
}

/** @jsxImportSource @emotion/react */
import { lazy, Suspense } from 'react';
import { BrowserRouter as Switch, Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Style
import * as style from './loginsignup-styles';

const Login = lazy(() => import('./Login'));
const Signup = lazy(() => import('./Signup'));

export default function LoginSignup() {
  const user = useSelector((state) => state.USERS.loginReducer.user);

  if (user?.id) {
    return <Redirect to="/board" />;
  }

  return (
    <div css={style.login}>
      <div css={style.login_background}>
        <Suspense fallback={<div>loading</div>}>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </div>
  );
}

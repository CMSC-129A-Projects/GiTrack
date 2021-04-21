/** @jsxImportSource @emotion/react */

import { lazy, Suspense } from 'react';
import { BrowserRouter as Switch, Route } from 'react-router-dom';

// Style
import * as style from './loginsignup-styles';

const Login = lazy(() => import('./Login'));
const Signup = lazy(() => import('./Signup'));

export default function Board() {
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

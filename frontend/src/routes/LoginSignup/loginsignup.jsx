/** @jsxImportSource @emotion/react */

import Background from 'assets/images/Vector.svg';

import { lazy, Suspense } from 'react';
import { BrowserRouter as Switch, Route } from 'react-router-dom';

// Style
import * as style from './loginsignup-styles';

const Login = lazy(() => import('./Login'));
// const Signup = lazy(() => import('./Signup'));

export default function Board() {
  return (
    <div css={style.login}>
      <div
        css={{
          backgroundImage: `url(${Background})`,
          width: '100vw',
          height: '100vh',
        }}
      >
        <Suspense fallback={<div>loading</div>}>
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            {/* <Route path="/signup">
            <Signup />
          </Route> */}
          </Switch>
        </Suspense>
      </div>
    </div>
  );
}

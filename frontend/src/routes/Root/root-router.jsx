/** @jsxImportSource @emotion/react */

import { lazy, Suspense } from 'react';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

// Routes
const Board = lazy(() => import('../Board'));
const LoginSignup = lazy(() => import('../LoginSignup'));
const Logout = lazy(() => import('../Public/Logout'));

export default function RootRouter() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/board">
            <Board />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/login">
            <LoginSignup />
          </Route>
          <Route path="/signup">
            <LoginSignup />
          </Route>
          <Redirect to="/login" />
        </Switch>
      </Suspense>
    </Router>
  );
}

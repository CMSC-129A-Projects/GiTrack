/** @jsxImportSource @emotion/react */

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import PrivateRoute from 'hocs/PrivateRoute';

// Routes
import Board from '../Board';
import LoginSignup from '../LoginSignup';
import Logout from '../Public/Logout';

export default function RootRouter() {
  return (
    <Router>
      <Switch>
        <PrivateRoute
          path="/logout"
          name="Logout"
          render={(props) => <Logout {...props} />}
        />
        <PrivateRoute exact path="/board">
          <Board />
        </PrivateRoute>
        <Route path="/">
          <LoginSignup />
        </Route>
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
}

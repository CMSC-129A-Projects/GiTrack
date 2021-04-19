/** @jsxImportSource @emotion/react */

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

// Routes
import Board from '../Board';
import LoginSignup from '../LoginSignup';
import Logout from '../Public/Logout';

export default function RootRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/logout">
          <Logout />
        </Route>
        <Route path="/board">
          <Board />
        </Route>
        <Route path="/">
          <LoginSignup />
        </Route>
        <Redirect from="/" to="/login" />
      </Switch>
    </Router>
  );
}

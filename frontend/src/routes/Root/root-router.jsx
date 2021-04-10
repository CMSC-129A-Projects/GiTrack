/** @jsxImportSource @emotion/react */

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

// Routes
import Board from '../Board';
import LoginSignup from '../LoginSignup';

export default function RootRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/board">
          <Board />
        </Route>
        <Route path="/add">
          <Board />
        </Route>
        <Route path="/login">
          <LoginSignup />
        </Route>
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
}

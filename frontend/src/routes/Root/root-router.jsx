/** @jsxImportSource @emotion/react */

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

// Routes
import Board from '../Board';

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
        <Redirect to="/board" />
      </Switch>
    </Router>
  );
}

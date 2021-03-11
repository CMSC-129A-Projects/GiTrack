/** @jsxImportSource @emotion/react */

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// Routes
import Board from '../Board'

export default function RootRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Board />
        </Route>
      </Switch>
    </Router>
  )
}

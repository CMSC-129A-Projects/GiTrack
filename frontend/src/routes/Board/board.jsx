/** @jsxImportSource @emotion/react */

import { lazy, Suspense } from 'react'
import { BrowserRouter as Switch, Route } from 'react-router-dom';

import Navbar from 'widgets/Navbar';

// Style
import * as style from './board-styles';

const BoardIndex = lazy(() => import('./BoardIndex'))
const Add = lazy(() => import('./Add'))

export default function Board() {
  return (
    <div css={style.board}>
      <Navbar />
      <Suspense fallback={<div>loading</div>}>
        <Switch>
          <Route path="/add">
            <Add />
          </Route>
          <Route path="/board">
            <BoardIndex />
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
}

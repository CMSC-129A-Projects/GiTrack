/** @jsxImportSource @emotion/react */

import { lazy, Suspense } from 'react';
import { BrowserRouter as Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navbar from 'widgets/Navbar';

// Style
import * as style from './board-styles';

const BoardIndex = lazy(() => import('./BoardIndex'));
const Add = lazy(() => import('./Add'));

export default function Board() {
  const user = useSelector((state) => state.USERS.loginReducer.user);

  if (!user?.id) {
    return <Redirect to="/login" />;
  }

  return (
    <div css={style.board}>
      <Navbar />
      <Suspense fallback={<div>loading</div>}>
        <Switch>
          <Route exact path="/board/add">
            <Add />
          </Route>
          <Route exact path="/board">
            <BoardIndex />
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
}

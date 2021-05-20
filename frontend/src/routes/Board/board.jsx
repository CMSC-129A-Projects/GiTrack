/** @jsxImportSource @emotion/react */

import { lazy, Suspense } from 'react';
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import useBoards from 'hooks/useBoards';

import Navbar from 'widgets/Navbar';

// Style
import * as style from './board-styles';

const BoardIndex = lazy(() => import('./BoardIndex'));
const Add = lazy(() => import('./Add'));

export default function Board() {
  const user = useSelector((state) => state.USERS.loginReducer.user);
  const { path } = useRouteMatch();
  const { isLoading, boards, refresh: refreshBoards } = useBoards();

  if (!user?.id) {
    return <Redirect to="/login" />;
  }

  if (isLoading) {
    return <div />;
  }

  if (boards.length === 0) {
    return <Redirect to={`${path}/add`} />;
  }

  return (
    <div css={style.board}>
      <Navbar boards={boards} />
      <Suspense fallback={<div>loading</div>}>
        <Switch>
          <Route exact path={`${path}/add`}>
            <Add refreshBoards={refreshBoards} />
          </Route>
          <Route exact path={`${path}/:boardId`}>
            <BoardIndex />
          </Route>
          <Redirect to={`${path}/${boards[0].id}`} />;
        </Switch>
      </Suspense>
    </div>
  );
}

/** @jsxImportSource @emotion/react */

import { lazy, Suspense, useEffect } from 'react';
import { Switch, Route, Redirect, useRouteMatch, useHistory } from 'react-router-dom';
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
  const history = useHistory();
  const { isLoading, boards, refresh: refreshBoards } = useBoards();

  useEffect(() => {
    if (!isLoading) {
      if (boards?.length === 0) {
        history.push(`${path}/add`);
      } else {
        history.push(`${path}/${boards[0]?.id}`);
      }
    }
  }, [isLoading]);

  if (!user?.id) {
    return <Redirect to="/login" />;
  }

  if (isLoading) {
    return <div />;
  }

  return (
    <div css={style.board}>
      <Navbar user={user} boards={boards} />
      <Suspense fallback={<div>loading</div>}>
        <Switch>
          <Route exact path={`${path}/add`}>
            <Add refreshBoards={refreshBoards} />
          </Route>
          <Route exact path={`${path}/:boardId`}>
            <BoardIndex refreshBoards={refreshBoards} />
          </Route>
          <Redirect to={`${path}/add`} />;
        </Switch>
      </Suspense>
    </div>
  );
}

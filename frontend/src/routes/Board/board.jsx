/** @jsxImportSource @emotion/react */

import { lazy, Suspense } from 'react'
import { BrowserRouter as Switch, Route } from 'react-router-dom';

import Navbar from 'widgets/Navbar';

const Index = lazy(() => import('./Index'))
const Add = lazy(() => import('./Add'))

export default function Board() {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<div>loading</div>}>
        <Switch>
          <Route path="/add">
            <Add />
          </Route>
          <Route path="/board">
            <Index />
          </Route>
        </Switch>
      </Suspense>
    </div>
  );
}

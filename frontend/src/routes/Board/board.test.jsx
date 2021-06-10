import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from 'configureStore';

import Board from './board';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => ({
    path: '/boards',
  }),
}));

const server = setupServer(
  rest.get('/board', (req, res, ctx) =>
    res(
      ctx.json({
        boards: [
          {
            id: 1,
            title: 'Ayo',
          },
        ],
        error_message: null,
      })
    )
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('retrieves boards', async () => {
  const store = configureStore();

  render(
    <Provider store={store}>
      <BrowserRouter basename="/">
        <Board />
      </BrowserRouter>
    </Provider>
  );
});

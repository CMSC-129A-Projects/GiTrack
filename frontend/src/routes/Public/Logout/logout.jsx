/** @jsxImportSource @emotion/react */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { actions as usersActions } from 'ducks/reducers/users';

import AuthService from 'services/AuthService';

export default function Logout() {
  const dispatch = useDispatch();
  const refreshToken = useSelector((state) => state.USERS.loginReducer.refreshToken);

  useEffect(() => {
    AuthService.logout({ body: { refresh_token: refreshToken } }).then(() => {
      dispatch(usersActions.loginActions.loginRestart());
    });
  });

  return <Redirect path="/login" />;
}

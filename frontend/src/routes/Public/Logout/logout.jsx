/** @jsxImportSource @emotion/react */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { actions as usersActions } from 'ducks/reducers/users';

import AuthService from 'services/AuthService';

export default function Logout() {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.USERS.loginReducer.accessToken);

  useEffect(() => {
    AuthService.logout({ body: { refresh_token: accessToken } }).then(() => {
      dispatch(usersActions.loginActions.loginRestart());
    });
  });

  return <Redirect to="/login" />;
}

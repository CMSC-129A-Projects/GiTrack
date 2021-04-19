/** @jsxImportSource @emotion/react */
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { actions as usersActions } from 'ducks/reducers/users';

// import AuthService from 'services/AuthService';

export default function Logout() {
  const dispatch = useDispatch();
  // const refreshToken = useSelector((state) => state.USERS.loginReducer.refresh_token);

  useEffect(() => {
    dispatch(usersActions.loginActions.loginRestart());

    // await AuthService.logout({ body: { refresh_token: refreshToken } });
  });

  return null;
}

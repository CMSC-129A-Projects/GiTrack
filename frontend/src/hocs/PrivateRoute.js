import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ ...rest }) => {
  const user = useSelector((state) => state.USERS.loginReducer.user);

  if (user !== null) {
    return <Route {...rest} />;
  }

  return <Route name="Login" render={() => <Redirect to="/login" />} />;
};

PrivateRoute.defaultProps = {
  user: null,
};

PrivateRoute.propTypes = {
  user: PropTypes.object,
};

export default withRouter(PrivateRoute);

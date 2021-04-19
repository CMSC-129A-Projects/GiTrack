import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router-dom';

function NoAuthRoute({ ...rest }) {
  const user = useSelector((state) => state.USERS.loginReducer.user);

  if (user?.id) {
    return <Redirect to="/board" />;
  }

  return <Route {...rest} />;
}

NoAuthRoute.defaultProps = {
  user: null,
};

NoAuthRoute.propTypes = {
  user: PropTypes.object,
};

export default withRouter(NoAuthRoute);

const jwt = require('jsonwebtoken');
const debug = require('debug')('backend:middlewares-auth');

const { ACCESS_TOKEN_SECRET } = require('../constants/keys');

function authJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    req.user = jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        debug(err);
        if (err.name === 'TokenExpiredError') {
          return 'TOKEN_ERROR';
        }
        return false;
      }

      return user;
    });

    if (req.user === 'TOKEN_ERROR') {
      return res.status(401).json({ error_message: req.user });
    }

    if (req.user) {
      return next();
    }

    return res.status(403).json({ error_message: 'TOKEN_INVALID' });
  }

  return res.status(403).json({ error_message: 'AUTH_NOT_FOUND' });
}

module.exports = {
  authJWT,
};

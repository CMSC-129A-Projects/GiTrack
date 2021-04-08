const jwt = require('jsonwebtoken');
const debug = require('debug')('backend:middlewares-auth');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

function authJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        debug(err);
        return res.status(403).json({ message: 'TOKEN_INVALID' });
      }

      req.user = user;
      return next();
    });
  }

  return res.status(403).json({ message: 'AUTH_NOT_FOUND' });
}

module.exports = {
  authJWT,
};

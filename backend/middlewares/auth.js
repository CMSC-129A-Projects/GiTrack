const jwt = require('jsonwebtoken');
const debug = require('debug')('backend:middlewares-auth');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

function authJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    req.user = jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        debug(err);
        return res.status(403).json({ message: 'TOKEN_INVALID' });
      }

      return user;
    });
  } else {
    return res.status(403).json({ message: 'AUTH_NOT_FOUND' });
  }

  return next();
}

module.exports = {
  authJWT,
};

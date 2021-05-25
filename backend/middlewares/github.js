const debug = require('debug')('backend:middlewares-github');
const crypto = require('crypto');

const { GH_SHA_SECRET } = require('../constants/keys');

function verifyPostData(req, res, next) {
  if (!req.rawBody) {
    debug('Request Body Empty');
    return res.status(400).json({ error_message: 'REQ_BODY_EMPTY' });
  }

  const sigHeaderName = 'X-Hub-Signature-256';
  const sigHashAlg = 'sha256';

  const sig = Buffer.from(req.get(sigHeaderName) || '', 'utf8');
  const hmac = crypto.createHmac(sigHashAlg, GH_SHA_SECRET);
  const digest = Buffer.from(
    `${sigHashAlg}=${hmac.update(req.rawBody).digest('hex')}`,
    'utf8'
  );

  if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
    debug('SHA Mismatch');
    return res.status(403).json({
      error_message: 'SHA_MISMATCH',
    });
  }

  return next();
}

module.exports = {
  verifyPostData,
};

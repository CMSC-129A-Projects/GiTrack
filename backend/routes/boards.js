const express = require('express');
const router = express.Router();

const { authJWT } = require('../middlewares/auth');

router.get('/', authJWT, function (req, res) {
  res.json({ message: req.user });
});

module.exports = router;

const jwt = require('jsonwebtoken');
const { JWT_SECRET} = require('../config');

const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if(!token) {
    res.status(401).json({
      message: 'token required' });
  } else {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if(err) {
        res.status(401).json({
          message: 'token invalid' });
      } else {
        req.decodedJwt = decodedToken;
        next();
      }
    })
  }
};

module.exports = restricted;
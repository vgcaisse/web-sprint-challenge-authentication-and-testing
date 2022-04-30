const { JWT_SECRET } = require("../secrets");
const jwt = require('jsonwebtoken')

const User = require('../model')

module.exports = {
  checkUsernameFree,
  checkUsernameExist,
  restricted
};

async function checkUsernameFree(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username });
    if (!users.length) {
      next();
    } else if (!req.body.username) {
      res.status(401).json({
        message: 'Missing Credentials'
      })
    } else {
      res.status(422).json({
        message: 'Username Taken'
      })
    }
  } catch (err) {
    next(err)
  }
}

async function checkUsernameExist(req, res, next) {
  try {
    const [user] = await User.findBy({ username: req.body.username })
    if (!user) {
      next({ status: 401, message: 'Invalid credentials' })
    } else if (!req.body.username || !req.body.password) {
      res.status(401).json({
        message: 'username and password required'
      })
    } else {
      req.user = user
      next()
    }
  } catch (error) {
    next(error)
  }
}

function restricted(req, res, next) {
  const token = req.headers.authorization
  if (!token) {
    next({ status: 401, message: 'Token required' })
  }
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      next({ status: 401, message: 'Token invalid' })
    } else {
      req.decodedToken = decodedToken
      next()
    }
  })
}


/*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */




const { JWT_SECRET } = require("../secrets");
const jwt = require('jsonwebtoken')

const User = require('../model')

module.exports = {
  checkUsernameFree,
  checkUsernameExist,
  restricted
};

function checkUsernameFree(req, res, next) {
  res.json({ message: `checkUsernameFree middlesware` })
  
}

async function checkUsernameExist(req, res, next) {
  res.json({ message: `checkUsernameExist middlesware` })

  try {
    const [user] = await User.findBy({ username: req.body.username })
    if (!user) {
      next({ status: 401, message: 'Invalid credentials' })
    } else {
      req.user = user
      next()
    }
  } catch (error) {
    next(error)
  }
}

function restricted(req, res, next) {
  res.json({ message: `restricted middlesware` })
}


/*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */




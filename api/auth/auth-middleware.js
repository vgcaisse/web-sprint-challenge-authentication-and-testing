const User = require('../model')

const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/index')

module.exports = {
  checkUsernameFree,
  checkUsernameExist,
  genToken
};

async function checkUsernameFree(req, res, next) {
  try {
    const { username, password } = req.body
    const users = await User.findBy({ username: username });
    if (!username || !password) {
      res.status(401).json({
        message: 'username and password required'
      })
    } else if (username == null || password == null) {
      res.status(401).json({
        message: 'username and password required'
      })
    } else if (users.length) {
      res.status(422).json({
        message: 'Username Taken'
      })
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

async function checkUsernameExist(req, res, next) {
  try {
    const { username, password } = req.body
    const users = await User.findBy({ username: username });
    if (users.length) {
      req.user = users[0]
      next();
    } else if (!username || !password) {
      res.status(401).json({
        message: 'username and password required'
      })
    } else {
      res.status(401).json({
        message: 'Invalid credentials'
      })
    }
  } catch (err) {
    res.status(401).json({
      message: 'username and password required'
    })
  }
}

function genToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options = {
    expiresIn: '1d'
  }
  return jwt.sign(payload, JWT_SECRET, options)
}

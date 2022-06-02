const router = require('express').Router();

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

const { JWT_SECRET } = require('../config/index')

const {
  checkUsernameFree,
  checkUsernameExist,
} = require('./auth-middleware')

const User = require('../model')

router.post('/register', checkUsernameFree, checkUsernameExist, (req, res, next) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 8)

  User.add({ username, password: hash })
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(err => {
      next(err)
    })
});

router.post('/login', checkUsernameExist, (req, res, next) => {
  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    const token = genToken(req.user)
    res.json({
      message: `${req.user.username} is back!`,
      token
    })
  } else {
    res.status(401).json({ message: `invalid creds` })
    next
  }

});

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

module.exports = router;

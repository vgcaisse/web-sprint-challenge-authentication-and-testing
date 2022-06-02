const router = require('express').Router();
const bcrypt = require('bcryptjs');

const {
  checkUsernameFree,
  checkUsernameExist,
  genToken
} = require('./auth-middleware')

const User = require('../model')

router.post('/register', checkUsernameFree, (req, res, next) => {
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
    res.status(200).json({
      message: `${req.user.username} is back!`,
      token
    })
  } else if (!req.user.password || !req.user.password) {
    res.status(401).json({
      message: 'username and password required'
    })
  } else {
    res.status(401).json({ message: `Invalid credentials` })
    next
  }
});



module.exports = router;

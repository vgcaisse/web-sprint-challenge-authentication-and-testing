const User = require('../model')

module.exports = {
  checkUsernameFree,
  checkUsernameExist,
};

async function checkUsernameFree(req, res, next) {
  try {
    const users = await User.findBy({ username: req.body.username });
    if (!req.body.username || !req.body.password) {
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
    const users = await User.findBy({ username: req.body.username });
    if (users.length) {
      req.user = users[0]
      next();
    } else if (!req.body.username || !req.body.password) {
      res.status(401).json({
        message: 'username and password required'
      })
    } else {
      res.status(401).json({
        message: 'Invalid credentials'
      })
    }
  } catch (err) {
    next(err)
  }
}

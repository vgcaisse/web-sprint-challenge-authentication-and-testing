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
        message: 'Missing Credentials'
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






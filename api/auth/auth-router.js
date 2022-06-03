const bcrypt = require("bcryptjs/dist/bcrypt");
const router = require("express").Router();
const User = require("../users/users-model.js");
const {
  checkUserData,
  checkUsernameExists,
  checkUsernameNotTaken,
  checkPassword,
} = require("../middleware/auth");

router.post(
  "/register",
  checkUserData,
  checkUsernameNotTaken,
  (req, res, next) => {
    const { username, password } = req.userData;
    const hash = bcrypt.hashSync(password, 8);
    User.add({ username, password: hash })
      .then((newUser) => {
        res.status(201).json(newUser);
      })
      .catch(next);
  }
);

router.post(
  "/login",
  checkUserData,
  checkUsernameExists,
  checkPassword,
  (req, res, next) => {
    if (req.user && req.token) {
      res
        .status(200)
        .send({ message: `welcome, ${req.user.username}`, token: req.token });
    } else {
      next({ status: 500 });
    }
  }
);

module.exports = router;

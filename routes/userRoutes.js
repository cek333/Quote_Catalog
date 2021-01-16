const UsersDAO = require('../dao/usersDao');
const passport = require('../middleware/passport');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Using the passport.authenticate middleware with our local strategy.
router.post('/login', passport.authenticate('local'), function(req, res) {
  res.json({ status: true, email: req.user.email, message: "You're now logged in!" });
});

// Route for signing up a user.
router.post('/signup', function(req, res) {
  const hashedPswd = bcrypt.hashSync(req.body.password, 10);
  const result = UsersDAO.addUser(req.body.email, hashedPswd);
  if (result.status) {
    res.json({ ...result, email: req.body.email });
  } else {
    // Set status to 400: Bad Request
    res.status(400).json(result);
  }
});

// Route for logging user out
router.post('/logout', function(req, res) {
  req.logout();
  res.json({ status: true, message: "You've been logged out!" });
});

module.exports = router;

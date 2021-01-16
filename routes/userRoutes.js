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
router.post('/signup', async function(req, res) {
  const hashedPswd = bcrypt.hashSync(req.body.password, 10);
  try {
    await UsersDAO.addUser(req.body.email, hashedPswd);
    res.json({ status: true, email: req.body.email, message: 'User successfully added! Please login.' });
  } catch (e) {
    console.error(`Error occurred while adding new user, ${e}`);
    res.status(400).json({ status: false, message: 'Email already exists! Login instead.' });
  }
});

// Route for logging user out
router.post('/logout', function(req, res) {
  req.logout();
  res.json({ status: true, message: "You've been logged out!" });
});

module.exports = router;

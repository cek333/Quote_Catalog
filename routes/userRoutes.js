const UsersDAO = require('../dao/usersDAO');
const customAuth = require('../middleware/customPassportAuthenticate');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Using the passport.authenticate middleware with our local strategy.
router.post('/login', customAuth, function(req, res) {
  res.json({ status: true, email: req.user.email, message: "You're now logged in!" });
});

// Route for signing up a user.
router.post('/signup', async function(req, res, next) {
  const hashedPswd = bcrypt.hashSync(req.body.password, 10);
  const email = req.body.email;
  try {
    await UsersDAO.addUser(req.body.email, hashedPswd);
    // Construct a new user object (FOR PASSPORT ONLY) containing just the email.
    req.logIn({ email }, function(err) {
      if (err) {
        next(err);
      } else {
        res.json({ status: true, email, message: "You're now logged in!" });
      }
    });
  } catch (e) {
    console.error(`Error occurred while adding new user, ${e}`);
    res.status(400).json({ status: false, message: 'Email already exists! Login instead.' });
  }
});

// Route for logging user out
router.post('/logout', function(req, res) {
  req.logout();
  req.session.save(function(err) {
    if (err) {
      console.error(`Error occurred while logging out user, ${err}`);
      res.json({ status: false, message: 'Error logging out. Please try again.' });
    } else {
      res.json({ status: true, message: "You've been logged out!" });
    }
  });
});

// Get current logged in user
router.get('/fetch', function(req, res) {
  if (req.user) {
    res.json({ status: true, email: req.user.email });
  } else {
    res.json({ status: false, email: '' });
  }
});

module.exports = router;

import UsersDAO from '../dao/usersDao';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Use a Local Strategy. In other words, we want login with a username/email and password
passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: 'email'
  },
  function(email, password, done) {
    // When a user tries to sign in this code runs
    const dbUser = UsersDAO.getUser(email);
    // If there's no user with the given email
    if (!dbUser) {
      return done(null, false, { message: 'Email not found!' });
    } else {
      // Note: dbUser.password is the hashed password
      if (bcrypt.compareSync(password, dbUser.password)) {
        return done(null, dbUser);
      } else {
        // password check failed
        return done(null, false, { message: 'Incorrect password!' });
      }
    }
  }
));

// Sequelize/Deserialize logic
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(email, done) {
  // Don't need user's password, so don't need to fetch user from database.
  // Send back object containing the email.
  done(null, { email });
});

// Exporting our configured passport
module.exports = passport;

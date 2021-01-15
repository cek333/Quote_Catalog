// Requiring necessary npm packages
require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// Requiring passport as we've configured it
const passport = require('./middleware/passport');

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 3001;
const db = require("./models");

// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// Setup MongoDB collection for session storage
const sessionStore = new MongoDBStore({
  uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
  collection: 'sessions',
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
});
// Catch errors
sessionStore.on('error', function (error) {
  console.log(error);
});

// We need to use sessions to keep track of our user's login status
app.use(session(
  {
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
    store: sessionStore
  }
));
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
const apiRoutes = require('./routes/api-routes.js');
app.use(apiRoutes);
require('./routes/html-routes.js')(app);
require('./routes/api-routes.js')(app);

// If no API routes are hit, send the React app
app.use(function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log('==> Listening on http://localhost:%s', PORT);
  });
});

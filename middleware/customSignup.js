const UsersDAO = require('../dao/usersDAO');
const bcrypt = require('bcryptjs');

module.exports = async function(req, res, next) {
  const hashedPswd = bcrypt.hashSync(req.body.password, 10);
  try {
    await UsersDAO.addUser(req.body.email, hashedPswd);
    next();
  } catch (e) {
    console.error(`Error occurred while adding new user, ${e}`);
    res.status(400).json({ status: false, message: 'Email already exists! Login instead.' });
  }
};

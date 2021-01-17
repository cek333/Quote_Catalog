let users;

class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db(process.env.MONGODB_DB).collection('users');
    } catch (e) {
      console.error(`Unable to connect to collection: ${e}`);
    }
  }

  static getUser(email) {
    return users.findOne({ _id: email });
  }

  static addUser(email, password) {
    return users.insertOne({ _id: email, password });
  }

  static deleteUser(email) {
    return users.deleteOne({ _id: email });
  }
}

module.exports = UsersDAO;

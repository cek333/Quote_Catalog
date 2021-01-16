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

  static async getUser(email) {
    return await users.findOne({ _id: email });
  }

  static async addUser(email, password) {
    try {
      await users.insertOne({ _id: email, password }, { w: 'majority' });
      return { status: true, message: 'User successfully added!' };
    } catch (e) {
      if (String(e).startsWith('MongoError: E11000 duplicate key error')) {
        return { status: false, message: 'Email already exists! Login instead.' };
      } else {
        console.error(`Error occurred while adding new user, ${e}`);
        return { status: false, message: 'Error occurred while adding new user!' };
      }
    }
  }

  static async deleteUser(email) {
    try {
      await users.deleteOne({ _id: email });
      return { status: true, message: 'User successfully deleted!' };
    } catch (e) {
      console.error(`Error occurred while deleting user, ${e}`);
      return { status: false, message: 'Error occurred while deleting user!' };
    }
  }
}

module.exports = UsersDAO;

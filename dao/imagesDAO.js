const { ObjectId } = require('bson');

let images;

class ImagesDAO {
  static async injectDB(conn) {
    if (images) {
      return;
    }
    try {
      images = await conn.db(process.env.MONGODB_DB).collection('images');
    } catch (e) {
      console.error(`Unable to connect to collection: ${e}`);
    }
  }

  static async getAllImages() {
    // Add limit?
    return await images.find({ });
  }

  static async getImage(id) {
    return await images.findOne({ _id: ObjectId(id) });
  }

  static async getUserImages(email) {
    return await images.find({ email });
  }

  static async addImage(email, src) {
    try {
      await images.insertOne({ email, src }, { w: 'majority' });
      return { status: true, message: 'Image successfully added!' };
    } catch (e) {
      console.error(`Error occurred while adding image, ${e}`);
      return { status: false, message: 'Error occurred while adding image!' };
    }
  }

  static async deleteImage(id) {
    try {
      await images.deleteOne({ _id: ObjectId(id) });
      return { status: true, message: 'Image successfully deleted!' };
    } catch (e) {
      console.error(`Error occurred while deleting image, ${e}`);
      return { status: false, message: 'Error occurred while deleting image!' };
    }
  }
}

module.exports = ImagesDAO;

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

  static getAllImages() {
    // Add limit?
    return await images.find({ });
  }

  static getImage(id) {
    return await images.findOne({ _id: ObjectId(id) });
  }

  static getUserImages(email) {
    return await images.find({ email });
  }

  static addImage(email, src, quote) {
    return images.insertOne({ email, src, quote }, { w: 'majority' });
  }

  static deleteImage(id) {
    return images.deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = ImagesDAO;

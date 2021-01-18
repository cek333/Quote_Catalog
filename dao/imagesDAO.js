const { ObjectId } = require('bson');

let images;

class ImagesDAO {
  static async injectDB(conn) {
    if (images) {
      return;
    }
    try {
      images = await conn.db(process.env.MONGODB_DB).collection('images');
      // const indexes = await images.listIndexes().toArray();
      // if (indexes.length <=1 ) {
      //   // Only id index. Create index for searching quotes
      //   await images.createIndex({ quote: 'text' });
      //   console.log('Created text index on quote field!');
      // }
    } catch (e) {
      console.error(`Unable to connect to collection: ${e}`);
    }
  }

  static async createIndex() {
    try {
      const indexes = await images.listIndexes().toArray();
      if (indexes.length <= 1) {
        // Only id index. Create index for searching quotes
        await images.createIndex({ quote: 'text' });
        console.log('Created text index on quote field!');
      }
    } catch (e) {
      console.error(`Unable to create index: ${e}`);
    }
  }

  static getAllImages() {
    // Add limit?
    return images.find({ }).limit(50).toArray();
  }

  static getImage(id) {
    return images.findOne({ _id: ObjectId(id) });
  }

  static getUserImages(email) {
    return images.find({ email }).toArray();
  }

  static searchImages(query) {
    return images.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } }).limit(50).toArray();
  }

  static addImage(email, src, quote) {
    return images.insertOne({ email, src, quote });
  }

  static deleteImage(id) {
    return images.deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = ImagesDAO;

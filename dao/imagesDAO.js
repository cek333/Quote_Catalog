const { ObjectId } = require('bson');

let images;
const PAGE_LIMIT = 25;

class ImagesDAO {
  static async injectDB(conn) {
    if (images) {
      return;
    }
    conn.db(process.env.MONGODB_DB).collection('images', { strict: true }, async(err, col) => {
      if (err) {
        // Collection does not exist. Create collection.
        try {
          images = await conn.db(process.env.MONGODB_DB).createCollection('images');
        } catch (e) {
          console.err(`Unable to create collection: ${e}`);
        }
        try {
          await images.createIndex({ quote: 'text' });
        } catch (e) {
          console.err(`Unable to create index for colletion (images): ${e}`);
        }
      } else {
        images = col;
      }
    });
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
    return images.find({ }).limit(PAGE_LIMIT).toArray();
  }

  static getImage(id) {
    return images.findOne({ _id: ObjectId(id) });
  }

  static getUserImages(email) {
    return images.find({ email }).limit(PAGE_LIMIT).toArray();
  }

  static searchImages(query) {
    return images.find({ $text: { $search: query } })
      .project({ score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } }).limit(PAGE_LIMIT).toArray();
  }

  static addImage(email, src, quote) {
    return images.insertOne({ email, src, quote });
  }

  static deleteImage(id) {
    return images.deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = ImagesDAO;

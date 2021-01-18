// Requiring necessary npm packages
const ImagesDAO = require('../dao/imagesDAO');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// Syncing our database and logging a message to the user upon success
MongoClient.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async client => {
    await ImagesDAO.injectDB(client);
    await ImagesDAO.createIndex();
    process.exit(1);
  });

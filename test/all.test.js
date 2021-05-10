/*
* @jest-environment node
*/
require('dotenv').config();
const ImagesDAO = require('../dao/imagesDAO');
const UsersDAO = require('../dao/usersDAO');
const MongoClient = require('mongodb').MongoClient;

const UNIQUE_STR = 'a4e20bcfb43edcb5359f330a416d5d24';
const TEST_EMAIL = 'test@email.com';
const TEST_PSWD = 'testpswd';
const DUMMY_IMG_URL = 'dummy_url';
const IMG_QUOTE1 = `hello ${UNIQUE_STR} world`;
const IMG_QUOTE2 = `hello ${UNIQUE_STR} sunshine`;

let imageId1;
let imageId2;
let testClient;

describe('Backend tests', () => {
  beforeAll(async () => {
    try {
      testClient = await MongoClient.connect(
        process.env.MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true }
      );
      await ImagesDAO.injectDB(testClient);
      await UsersDAO.injectDB(testClient);
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });

  afterAll(async () => {
    await testClient.close();
  });

  describe('Database tests, Users collection', () => {
    test('Add user', async () => {
      const result = await UsersDAO.addUser(TEST_EMAIL, TEST_PSWD);
      expect(result.insertedCount).toEqual(1);
    });

    test('Get user', async () => {
      const result = await UsersDAO.getUser(TEST_EMAIL);
      expect(result.password).toEqual(TEST_PSWD);
    });

    test('Delete user', async () => {
      const result = await UsersDAO.deleteUser(TEST_EMAIL);
      expect(result.deletedCount).toEqual(1);
    });

    test('Get (deleted) user', async () => {
      const result = await UsersDAO.getUser(TEST_EMAIL);
      expect(result).toBeNull();
    });
  });

  describe('Database tests, Images collection', () => {
    test('Add 1st Image', async () => {
      const result = await ImagesDAO.addImage(TEST_EMAIL, DUMMY_IMG_URL, IMG_QUOTE1);
      imageId1 = result.insertedId;
      expect(result.insertedCount).toEqual(1);
    });

    test('Add 2nd Image', async () => {
      const result = await ImagesDAO.addImage(TEST_EMAIL, DUMMY_IMG_URL, IMG_QUOTE2);
      imageId2 = result.insertedId;
      expect(result.insertedCount).toEqual(1);
    });

    test('Get All Images', async () => {
      const result = await ImagesDAO.getAllImages();
      expect(result.length).toBeGreaterThanOrEqual(2);
    });

    test('Search for Test Images', async () => {
      const result = await ImagesDAO.searchImages(UNIQUE_STR);
      expect(result.length).toEqual(2);
    });

    test('Delete Images', async () => {
      let result = await ImagesDAO.deleteImage(imageId1);
      expect(result.deletedCount).toEqual(1);
      result = await ImagesDAO.deleteImage(imageId2);
      expect(result.deletedCount).toEqual(1);
    });

    test('Search for (deleted) Test Images', async () => {
      const result = await ImagesDAO.searchImages(UNIQUE_STR);
      expect(result.length).toEqual(0);
    });
  });
});

/*
* @jest-environment node
*/
require('dotenv').config();
const ImagesDAO = require('../dao/imagesDAO');
const UsersDAO = require('../dao/usersDAO');
const MongoClient = require('mongodb').MongoClient;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const testSession = require('supertest-session');
const passport = require('../middleware/passport');
const express = require('express');
const session = require('express-session');

const SEARCH_STR = 'sunshine';
const TEST_EMAIL = 'test@email.com';
const TEST_PSWD = 'testpswd';
const DUMMY_IMG_URL = 'dummy_url';
const IMG_QUOTE1 = 'hello world';
const IMG_QUOTE2 = 'hello sunshine';

let mongoServer;
let imageId1;
let imageId2;
let testClient;
let app;
let request;

describe('Backend tests', () => {
  beforeAll(async () => {
    try {
      // Setup Database
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getUri();
      testClient = await MongoClient.connect(
        mongoUri,
        { useNewUrlParser: true, useUnifiedTopology: true }
      );
      await ImagesDAO.injectDB(testClient);
      await UsersDAO.injectDB(testClient);

      // API setup
      app = express();
      app.use(express.urlencoded({ extended: true }));
      app.use(express.json());

      // We need to use sessions to keep track of our user's login status
      app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 week
      }));
      app.use(passport.initialize());
      app.use(passport.session());

      // Requiring our routes
      const imageRoutes = require('../routes/imageRoutes');
      const userRoutes = require('../routes/userRoutes');
      app.use('/api/image', imageRoutes);
      app.use('/api/user', userRoutes);
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });

  afterAll(async () => {
    await testClient.close();
    await mongoServer.stop();
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
      expect(result.length).toEqual(2);
    });

    test('Search for Image', async () => {
      const result = await ImagesDAO.searchImages(SEARCH_STR);
      expect(result.length).toEqual(1);
      expect(result[0].quote).toEqual(IMG_QUOTE2);
    });

    test('Delete Images', async () => {
      let result = await ImagesDAO.deleteImage(imageId1);
      expect(result.deletedCount).toEqual(1);
      result = await ImagesDAO.deleteImage(imageId2);
      expect(result.deletedCount).toEqual(1);
    });

    test('Get All (deleted) Images', async () => {
      const result = await ImagesDAO.getAllImages();
      expect(result.length).toEqual(0);
    });
  });

  describe('API tests, user endpoints', () => {
    beforeEach(() => {
      request = testSession(app);
    });

    test('Signup and Logout', async () => {
      try {
        let result = await
          request
          .post('/api/user/signup')
          .send({ email: TEST_EMAIL, password: TEST_PSWD });
        expect(result.body.status).toEqual(true);
        expect(result.body.email).toEqual(TEST_EMAIL);
        expect(result.body.message).toEqual("You're now logged in!");

        // Check user is logged in
        result = await request.get('/api/user/fetch');
        expect(result.body.status).toEqual(true);
        expect(result.body.email).toEqual(TEST_EMAIL);

        // Logout
        result = await request.post('/api/user/logout');
        expect(result.body.status).toEqual(true);
        expect(result.body.message).toEqual("You've been logged out!");

        // Check user is logged out
        result = await request.get('/api/user/fetch');
        expect(result.body.status).toEqual(false);
        expect(result.body.email).toBeFalsy();
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    test('Signup existing user', async () => {
      try {
        const result = await
          request
          .post('/api/user/signup')
          .send({ email: TEST_EMAIL, password: TEST_PSWD });
        expect(result.body.status).toEqual(false);
        expect(result.body.message).toEqual('Email already exists! Login instead.');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    test('Login with invalid email address', async () => {
      try {
        const result = await
          request
          .post('/api/user/login')
          .send({ email: 'incorrect@email.com', password: TEST_PSWD });
        expect(result.body.status).toEqual(false);
        expect(result.body.message).toEqual('Email not found!');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    test('Login with incorrect password', async () => {
      try {
        const result = await
          request
          .post('/api/user/login')
          .send({ email: TEST_EMAIL, password: 'incorrect' });
        expect(result.body.status).toEqual(false);
        expect(result.body.message).toEqual('Incorrect password!');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    test('Login and Logout', async () => {
      try {
        let result = await
          request
          .post('/api/user/login')
          .send({ email: TEST_EMAIL, password: TEST_PSWD });
        expect(result.body.status).toEqual(true);
        expect(result.body.email).toEqual(TEST_EMAIL);
        expect(result.body.message).toEqual("You're now logged in!");

        // Check user is logged in
        result = await request.get('/api/user/fetch');
        expect(result.body.status).toEqual(true);
        expect(result.body.email).toEqual(TEST_EMAIL);

        // Logout
        result = await request.post('/api/user/logout');
        expect(result.body.status).toEqual(true);
        expect(result.body.message).toEqual("You've been logged out!");

        // Check user is logged out
        result = await request.get('/api/user/fetch');
        expect(result.body.status).toEqual(false);
        expect(result.body.email).toBeFalsy();
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });
  });

  describe('API tests, image endpoints', () => {
    beforeEach(async () => {
      request = testSession(app);
      // Login user for image tests
      await
        request
        .post('/api/user/login')
        .send({ email: TEST_EMAIL, password: TEST_PSWD });
    });

    afterEach(async () => {
      await request.post('/api/user/logout');
    });

    test('Add 1st Image', async () => {
      try {
        const result = await
          request
          .post('/api/image')
          .send({ src: DUMMY_IMG_URL, quote: IMG_QUOTE1 });
          expect(result.body.status).toEqual(true);
          expect(result.body.message).toEqual('Image successfully added!');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    test('Add 2nd Image', async () => {
      try {
        const result = await
        request
        .post('/api/image')
        .send({ src: DUMMY_IMG_URL, quote: IMG_QUOTE2 });
        expect(result.body.status).toEqual(true);
        expect(result.body.message).toEqual('Image successfully added!');
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    test('Get All Images', async () => {
      try {
        const result = await request.get('/api/image');
        expect(result.body.length).toEqual(2);
        imageId1 = result.body[0]._id;
        imageId2 = result.body[1]._id;
        expect(result.body[0].enDel).toEqual(true);
        expect(result.body[1].enDel).toEqual(true);
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    test('Search for Image', async () => {
      try {
        const result = await request.get(`/api/image?search=${SEARCH_STR}`);
        expect(result.body.length).toEqual(1);
        expect(result.body[0].quote).toEqual(IMG_QUOTE2);
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    test('Delete Image', async () => {
      try {
        let result = await request.delete(`/api/image/${imageId1}`);
        expect(result.body.status).toEqual(true);
        expect(result.body.message).toEqual('Image successfully deleted!');
        result = await request.get('/api/image');
        expect(result.body.length).toEqual(1);
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });

    test('View images as guest', async () => {
      try {
        let result = await request.post('/api/user/logout');
        expect(result.body.status).toEqual(true);
        expect(result.body.message).toEqual("You've been logged out!");
        // Check that delete flag is not set for guest viewers
        result = await request.get('/api/image');
        expect(result.body.length).toEqual(1);
        expect(result.body[0].enDel).toEqual(false);
      } catch (err) {
        expect(err).toBeFalsy();
      }
    });
  });
});

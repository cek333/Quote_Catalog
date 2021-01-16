const ImagesDAO = require('../dao/imagesDao');
const express = require('express');
const router = express.Router();

router.route('/:id?')
  .get(async function(req, res) {
    console.log(`image: get /: Valid user: ${req.user ? req.user.email : 'none'}`);
    const userEmail = req.user ? req.user.email : 'empty';
    try {
      const result = await ImagesDAO.getAllImages();
      // Remove email addresses from results. Also add delete indicator.
      const sanitized = result.map(doc => ({
        _id: doc._id,
        quote: doc.quote,
        src: doc.src,
        enDel: doc.email === userEmail
      }));
      res.json(sanitized);
    } catch (e) {
      console.error(`Error occurred while getting images, ${e}`);
      // Return empty array
      res.json([]);
    }
  })
  .post(async function(req, res) {
    console.log(`image: post /: Valid user: ${req.user ? req.user.email : 'none'}`);
    try {
      await ImagesDAO.addImage(req.user.email, req.body.src, req.body.quote);
      res.json({ status: true, message: 'Image successfully added!' });
    } catch (e) {
      // Unexpected error
      console.error(`Error occurred while adding image, ${e}`);
      res.status(500).json({ status: false, message: 'Error occurred while adding image!' });
    }
  })
  .delete(async function(req, res) {
    if (req.params.id) {
      try {
        const result = await ImagesDAO.deleteImage(req.params.id);
        if (result.deletedCount === 1) {
          res.json({ status: true, message: 'Image successfully deleted!' });
        } else {
          // Set status to 400: Bad Request
          res.status(400).json({ status: false, message: 'Image ID not found!' });
        }
      } catch (e) {
        // Unexpected error
        res.status(500).json({ status: false, message: 'Error occurred while deleting image!' });
      }
    } else {
      // Valid id not specified
      res.status(400).json({ status: false, message: 'Invalid image ID!' });
    }
  });

module.exports = router;

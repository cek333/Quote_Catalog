const ImagesDAO = require('../dao/imagesDao');
const express = require('express');
const router = express.Router();

router.route('/:id?')
  .get(function(req, res) {
    console.log(`image: get /: Valid user: ${req.user ? req.user.email : 'none'}`);
    const result = ImagesDAO.getAllImages();
    res.json(result);
  })
  .post(function(req, res) {
    console.log(`image: get /: Valid user: ${req.user ? req.user.email : 'none'}`);
    const result = ImagesDAO.addImage(req.body.email, req.body.src);
    if (result.status) {
      res.json(result);
    } else {
      // Set status to 400: Bad Request
      res.status(400).json(result);
    }
  })
  .delete(function(req, res) {
    if (req.params.id) {
      const result = ImagesDAO.deleteImage(req.params.id);
      if (result.status) {
        res.json(result);
      } else {
        // Set status to 400: Bad Request
        res.status(400).json(result);
      }
    } else {
      // Valid id not specified
      res.status(400).json({ status: false, message: 'Invalid image ID!' });
    }
  });

module.exports = router;

const express = require('express');
const router = express.Router();
const listingsController = require('../controllers/listingsController');
const verifyToken  = require('../middlewares/auth');
const uploadImage = require('../middlewares/s3');

router.get('/', listingsController.getAllListings);
router.get('/:id', verifyToken,  listingsController.getListing);
router.post('/', verifyToken, uploadImage.array('imageUrl', 10), listingsController.createListing);
router.put('/:id', verifyToken, uploadImage.array('image', 10), listingsController.updateListing);
router.delete('/:id', verifyToken, listingsController.deleteListing);

module.exports = router;
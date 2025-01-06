const express = require('express');
const router = express.Router();
const verifyToken  = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { createSalonRating, getSalonRating, updateRating, deleteRating } = require('../controllers/salon/salon_rating_controller');

// Create a new rating (Only customers can rate)
router.post('/create-rating/:salonId/:customerId', verifyToken, authorizeRoles('customer'), createSalonRating);

// Get all ratings for a salon (Any authenticated user can view ratings)
router.get('/get-salon-rating/:salonId', getSalonRating);

// Update a rating (Only verified customers can update)
router.put('/update-rating/:ratingId/:salonId/:customerId', verifyToken, authorizeRoles('customer'), updateRating);

// Delete a rating (Only salon owners can delete ratings)
router.delete('/delete-rating/:ratingId/:salonId/:customerId', verifyToken, authorizeRoles('customer'), deleteRating);

module.exports = router;

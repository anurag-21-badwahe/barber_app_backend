const SalonRating = require('../../models/salon_ratings');
const mongoose = require('mongoose');

// Create a new rating
const createSalonRating = async (req, res) => {

    console.log("inside createSalonRating",req.body);
    
    const { rating, review } = req.body;
    const { salonId, userId } = req.params;  // Fetching from URL params

    try {
        const newRating = new SalonRating({
            rating,
            review,
            salonId: salonId,
            customerId : userId
        });

        await newRating.save();
        res.status(201).json({ message: 'Rating submitted successfully', rating: newRating });
    } catch (error) {
        console.log("inside error",error);
        
        res.status(500).json({ error: error.message });
    }
};

// Get all ratings for a salon
const getSalonRating = async (req, res) => {
    const { salonId } = req.params;

    // Validate salonId
    if (!salonId || !mongoose.Types.ObjectId.isValid(salonId)) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid salon ID format'
        });
    }

    try {
        // Check if any ratings exist
        const ratings = await SalonRating.find({ salonId : salonId })
            .populate('customerId', 'customerName')
            .lean();

        // If no ratings found, return appropriate response
        if (!ratings || ratings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No ratings found for this salon'
            });
        }

        // Success response
        return res.status(200).json({
            success: true,
            data: ratings
        });

    } catch (error) {
        console.error('Error in getSalonRating:', error);
        
        // Specific error handling
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid data format'
            });
        }

        // Generic error response
        return res.status(500).json({
            success: false,
            message: 'Error retrieving salon ratings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};


// Update a rating
const updateRating = async (req, res) => {
    const { ratingId, salonId, userId } = req.params;  // Fetching from URL params

    try {
        // Fetch the rating by the ratingId
        const rating = await SalonRating.findById(ratingId);
        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Log the userId values for debugging
        console.log("rating.userId:", rating.userId);
        console.log("rating:", rating);
           console.log("userId from params:", userId);

        // Ensure the rating belongs to the user making the request
        if (!rating.customerId || rating.customerId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to update this rating' });
        }

        // Update the rating fields if provided
        if (req.body.rating) rating.rating = req.body.rating;
        if (req.body.review) rating.review = req.body.review;

        // Save the updated rating
        await rating.save();
        return res.status(200).json({
            message: 'Rating updated successfully',
            rating,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};


// Delete a rating
const deleteRating = async (req, res) => {
    const { ratingId, salonId, customerId } = req.params;  // Fetching from URL params

    try {
        // Fetch the rating by the ratingId
        const rating = await SalonRating.findById(ratingId);
        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Log the customerId values for debugging
        console.log("rating.userId:", rating);
        console.log("customerId from params:", customerId);

        // Ensure the rating belongs to the customer making the request
        if (rating.customerId.toString() !== customerId) {
            return res.status(403).json({ message: 'Unauthorized to delete this rating' });
        }

        // Delete the rating
        await rating.deleteOne();
        res.status(200).json({ message: 'Rating deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};










module.exports = {
    createSalonRating,
    getSalonRating,
    updateRating,
    deleteRating
};

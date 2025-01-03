const express = require("express");
const router = express.Router();
const {
  registerOwner,
  loginOwner,
  verifyOwner,
} = require("../controllers/owner/auth");
const{
  deleteOwner,
  getSalonsByOwnerId,
} = require("../controllers/owner/management");
const {
  requestPasswordReset,
  resetPassword,  
} = require("../controllers/owner/password");



// Owner registration
router.post('/auth/register', registerOwner);

// Owner Login
router.post("/auth/login", loginOwner);

// Owner Verify
router.post("/auth/verify", verifyOwner);

// Get all salons by owner id
router.get("/fetch/:id/salons", getSalonsByOwnerId);

//Update owner details
// router.put("/owners/:id", updateOwner);

//Request reset password code
router.post("/request-reset", requestPasswordReset);

//reset password
router.put("/reset-password", resetPassword);

//Delete owner details
router.delete("/delete-owner/:id", deleteOwner);

module.exports = router;

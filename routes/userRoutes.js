const express = require("express");
const verifyToken = require('../middleware/authMiddleware')
const authorizeRoles = require("../middleware/roleMiddleware")

const router  = express.Router();

// Only admin can access this route
router.get("/admin",verifyToken,authorizeRoles("admin"),(req,res)=>{
    res.json({message : "Welcome Admin"})
})

// Only Customer can access this route
router.get("/customer",verifyToken,authorizeRoles("customer"),(req,res)=>{
    res.json({message : "Welcome Customer"})
})

// Only Salon can access this route
router.get("/salon",verifyToken,authorizeRoles("salon"),(req,res)=>{
    res.json({message : "Welcome Salon"})
})

module.exports = router;
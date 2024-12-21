const express = require("express");
const verifyToken = require('../middleware/authMiddleware')

const router  = express.Router();

// Only admin can access this route
router.get("/admin",verifyToken,(req,res)=>{
    res.json({message : "Welcome Admin"})
})

// Only Customer can access this route
router.get("/customer",verifyToken,(req,res)=>{
    res.json({message : "Welcome Customer"})
})

// Only Salon can access this route
router.get("/salon",verifyToken,(req,res)=>{
    res.json({message : "Welcome Salon"})
})

module.exports = router;
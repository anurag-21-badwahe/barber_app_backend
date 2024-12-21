const express = require("express");

const router  = express.Router();

// Only admin can access this route
router.get("/admin",(req,res)=>{
    res.json({message : "Welcome Admin"})
})

// Only Customer can access this route
router.get("/customer",(req,res)=>{
    res.json({message : "Welcome Customer"})
})

// Only Salon can access this route
router.get("/salon",(req,res)=>{
    res.json({message : "Welcome Salon"})
})

module.exports = router;
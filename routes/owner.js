const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const cors = require("cors"); // You imported `cors` but didn't use it
const ownerModel = require('../models/ownermodel'); // Use a consistent variable name

// Add CORS middleware (example, in case needed)
router.use(cors());

// Root route
router.get("/", (req, res) => {
    res.send("Hello from the server route");
});

// Route to create a new owner
router.post("/create", async (req, res) => {
    try {
        // Check if an owner already exists
        let ownerExists = await ownerModel.findOne();
        if (ownerExists) {
            return res.status(503).send("You don't have permission to create a new owner");
        }

        // Extract data from request body
        const { fullname, email, password } = req.body;

        // Validate required fields
        if (!fullname || !email || !password) {
            return res.status(400).send("All fields are required: fullname, email, and password");
        }

        // Create a new owner
        let owner = await ownerModel.create({ fullname, email, password });
        res.status(201).send(owner);
    } catch (err) {
        console.error("Error creating owner:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Admin panel route (You had a syntax error here)
router.get("/adminpanel", (req, res) => {
    const successMessage = req.flash("success");
    const errorMessage = req.flash("error");
   
  });

module.exports = router;

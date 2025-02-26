const express = require('express');
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin"); // Ensure this middleware exists and works

// Define the root route (optional)
router.get("/", (req, res) => {
    res.send("User route root");
});

// Define the shop route with middleware

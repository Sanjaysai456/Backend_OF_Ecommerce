const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const productModel = require("../models/productmodel");

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create Product Route
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, piece, textcolor, bgcolor, panelcolor, price, discount } = req.body;

    // Validate required fields
    

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    // Create the product in the database
    const product = await productModel.create({
      image: req.file.buffer,
      name,
      piece,
      textcolor,
      bgcolor,
      panelcolor,
      price,
      discount,
    });

    // Set a flash message and redirect
    res.status(201).json({
      success: true,
      message: "Product created successfully!",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Error creating product. Please try again.",
    });
  }
});
router.get("/all", async (req, res) => {
  try {
    const products = await productModel.find();
    const modifiedProducts = products.map((product) => ({
      ...product._doc,
      image: product.image.toString("base64"), // Convert image buffer to base64
    }));

    res.status(200).json({
      success: true,
      products: modifiedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
    });
  }
});



module.exports = router;
 
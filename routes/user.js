const express = require('express');
const router = express.Router();
const userModel = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const isLoggedin = require("../middlewares/isLoggedin"); 
const mongoose = require('mongoose');

router.use(cookieParser());

// Test route
router.get("/", (req, res) => {
    res.send("Hello from the user route!");
});


router.get("/shop", isLoggedin, (req, res) => {
    res.redirect("http://localhost:3000/shop"); // Redirect to frontend shop page
  });
  
// User registration
router.post("/register", async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        let userexist = await userModel.findOne({ email });

        if (userexist) {
            return res.status(401).send("Account already exists, please login.");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            fullname,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ email: user.email, id: user._id }, "hackcheskunavaendukumowa", );
        res.cookie("token", token, { httpOnly: true });

        res.status(201).send("User created successfully.");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// User login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const emailexist = await userModel.findOne({ email });

    if (!emailexist) {
        return res.status(404).send("No account exists with this email.");
    }

    bcrypt.compare(password, emailexist.password, (err, result) => {
        if (result) {
            const token = jwt.sign({ email: emailexist.email, id: emailexist._id }, "hackcheskunavaendukumowa", );
            res.cookie("token", token);
            res.send("Login successful.");
        } else {
            res.status(401).send("Invalid credentials.");
        }
    });
});
// Add to Cart API
router.post("/cart/add", isLoggedin, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from middleware
        const { productId } = req.body;
       

        

        // Validate product existence
        const product = await mongoose.model("product").findById(productId);
        
        if (!product) {
            return res.status(404).send("Product not found.");
        }

        // Find the user and update the cart
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Check if product already in cart
        if (user.cart.includes(productId)) {
            return res.status(400).send("Product is already in the cart.");
        }

        user.cart.push(productId); // Add product to the cart
        await user.save(); // Save the updated user document

        res.status(200).send("Product added to the cart successfully.");
    } catch (err) {
        console.error("Error adding product to cart:", err.message);
        res.status(500).send("Internal server error.");
    }
});
router.get("/cart", isLoggedin, async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the user and populate the cart with product details
        const user = await userModel.findById(userId).populate("cart");
        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Convert Buffer image to Base64 for all products in the cart
        const cartItems = user.cart.map((product) => {
            const productData = product.toObject(); // Convert Mongoose document to plain object
            if (product.image) {
                productData.image = product.image.toString("base64"); // Convert buffer to Base64
            }
            return productData;
        });

        res.status(200).json({ success: true, cartItems });
    } catch (err) {
        console.error("Error fetching cart items:", err.message);
        res.status(500).send("Internal server error.");
    }
});
router.post("/cart/remove", isLoggedin, async (req, res) => {
    try{
        const userId=req.user.id;
        const {productId}=req.body;
        const user = await userModel.findById(userId);
        if(!user){
            return res.status(404).send("User not found");

        }
        const index=user.cart.indexOf(productId);
        if(index===-1){
            return res.status(404).send("Product not found in cart");
        }
        user.cart.splice(index,1);
        await user.save();
        res.status(200).send("Product removed from cart successfully");
    }catch(err){
        console.error("Error removing product from cart:",err.message);
        res.status(500).send("Internal server error.");

        


    }

});




module.exports = router;

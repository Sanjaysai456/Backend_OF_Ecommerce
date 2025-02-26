const userModel = require('../models/usermodel');
const cookieParser = require('cookie-parser'); // Correct import
const jwt = require('jsonwebtoken'); // Import JWT for token verification




const isLoggedin = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Authentication required.");
  }

  try {
    const decoded = jwt.verify(token, "hackcheskunavaendukumowa");
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).send("User not found.");
    }
    req.user = user; // Attach the user to the request object
    next();
  } catch (err) {
    res.status(401).send("Invalid token.");
  }
};

module.exports = isLoggedin;

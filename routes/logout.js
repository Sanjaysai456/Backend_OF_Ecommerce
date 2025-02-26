const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0), // Expire the cookie
        httpOnly: true,      // Securely handle the cookie
    });
    res.status(200).json({ message: 'Logged out successfully', redirectUrl: '/' });
});

module.exports = router;

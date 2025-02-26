const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const mongoose = require('mongoose');
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const ownerRoute = require("./routes/owner");
const logoutRoute = require("./routes/logout");
const dotenv = require('dotenv'); // Import logout route
//express added

const session = require('express-session'); 
const flash = require('connect-flash'); 
const cors = require('cors'); 
require('dotenv').config();


const app = express();

mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

app.use(cors({
    origin: "http://localhost:3000/",
    credentials: true, 
}));

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "secreat",
    cookie: { maxAge: 60000 }, 
}));

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoute);
app.use("/product", productRoute);
app.use("/owner", ownerRoute);
app.use("/logout", logoutRoute); // Use logout route

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

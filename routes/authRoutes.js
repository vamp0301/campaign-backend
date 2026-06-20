const express = require("express");
const router = express.Router();

const {
    signup,
    login
} = require("../controllers/authController");

const { auth } = require("../middleware/authMiddleware");


// Public Routes
router.post("/signup", signup);
router.post("/login", login);


// Protected Route
router.get("/profile", auth, (req, res) => {

    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user: req.user
    });

});


module.exports = router;
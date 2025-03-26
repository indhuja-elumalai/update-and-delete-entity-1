const express = require("express");
const path = require("path");
const fs = require("fs");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// ✅ Create User (Signup)
router.post("/create-user", upload.single("file"), catchAsyncErrors(async (req, res, next) => {
    console.log("Creating user...");
    let { name, email, password } = req.body;
    email = email.toLowerCase(); // Convert email to lowercase for consistency

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, "../uploads", req.file.filename));
        }
        return next(new ErrorHandler("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("At Create:", "Password:", password, "Hash:", hashedPassword);

    const fileUrl = req.file ? path.join("uploads", req.file.filename) : "";
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        avatar: {
            public_id: req.file?.filename || "",
            url: fileUrl,
        },
    });

    console.log(user);
    res.status(201).json({ success: true, user });
}));

// ✅ User Login
router.post("/login", catchAsyncErrors(async (req, res, next) => {
    console.log("Logging in user...");
    let { email, password } = req.body;
    email = email.toLowerCase(); // Ensure email is in lowercase

    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    console.log("At Auth:", "Entered Password:", password, "Stored Hash:", user.password);
    console.log("Password Match:", isPasswordMatched);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    user.password = undefined;
    res.status(200).json({ success: true, user });
}));

// ✅ Get User Profile
router.get("/profile", catchAsyncErrors(async (req, res, next) => {
    let { email } = req.query;
    if (!email) {
        return next(new ErrorHandler("Please provide an email", 400));
    }

    email = email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user: {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            avatarUrl: user.avatar.url
        },
        addresses: user.addresses,
    });
}));

// ✅ Add Address
router.post("/add-address", catchAsyncErrors(async (req, res, next) => {
    let { country, city, address1, address2, zipCode, addressType, email } = req.body;
    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const newAddress = { country, city, address1, address2, zipCode, addressType };
    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json({ success: true, addresses: user.addresses });
}));

// ✅ Get User Addresses
router.get("/addresses", catchAsyncErrors(async (req, res, next) => {
    let { email } = req.query;
    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({ success: true, addresses: user.addresses });
}));

module.exports = router;

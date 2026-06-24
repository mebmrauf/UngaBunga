import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

//  Route for user login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.json({success: false, message: "User does not exists"});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        const token = createToken(user._id);
        res.json({success: true, token, role: user.role});
    } else {
        res.json({success: false, message: "Invalid Credentials"});
    }
});

// Route for user registration
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    // check if user already exists or not
    const exists = await userModel.findOne({email});
    if (exists) {
        return res.json({success: false, message: 'User already exists'})
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
        return res.json({success: false, message: 'Please enter a valid email'})
    }
    if (password.length < 8) {
        return res.json({success: false, message: 'Please enter a strong password'})
    }

    // Hashing Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({name, email, password:hashedPassword, role: 'user'})

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({success: true, token, role: user.role})
});

// Route for admin login
const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL) {
        let isMatch = false;
        // Check if the ADMIN_PASSWORD in .env is a bcrypt hash
        if (process.env.ADMIN_PASSWORD.startsWith('$2')) {
            isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);
        } else {
            // Fallback to plain text comparison
            isMatch = password === process.env.ADMIN_PASSWORD;
        }

        if (isMatch) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            return res.json({success: true, token})
        }
    }
    
    res.json({success: false, message: "Invalid Credentials"})
});

import notificationModel from "../models/notificationModel.js";

// Route for getting user profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id).select('-password');
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
});

// Route for updating user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const { preferences } = req.body;
    
    const user = await userModel.findByIdAndUpdate(
        req.user._id,
        { preferences },
        { new: true }
    ).select('-password');

    res.json({ success: true, message: "Profile updated successfully", user });
});

// Route for getting user notifications
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await notificationModel.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
});

// Route for marking notifications as read
const markNotificationsRead = asyncHandler(async (req, res) => {
    await notificationModel.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: "Notifications marked as read" });
});

export {loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, getNotifications, markNotificationsRead};
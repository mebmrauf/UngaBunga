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

export {loginUser, registerUser, adminLogin};
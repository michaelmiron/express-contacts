const asyncHandler = require("express-async-handler");
const user = require("../models/userModel");
const bcrypt = require("bcrypt");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("all fields are mandatory");
    }
    const userAvailable = await user.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed password:", hashedPassword);
    const createdUser = await user.create({
        username,
        email,
        password: hashedPassword,
    });
    console.log(`User created ${createdUser}`);
    if (createdUser) {
        res.status(201).json({ _id: createdUser.id, email: createdUser.email });
    } else {
        res.status(400);
        throw new Error("User data not valid");
    }
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    res.json({ message: "Login user" });
});

//@desc Get current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json({ message: "Current user info" });
});

module.exports = { registerUser, loginUser, currentUser };
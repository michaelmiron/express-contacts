const asyncHandler = require("express-async-handler");
const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
//@route POST /api/users/loginUser
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("all fields are mandatory");
    }
    const foundUser = await user.findOne({ email });
    if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: foundUser.username,
                    email: foundUser.email,
                    id: foundUser.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1m" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("email or password is not valid");
    }
});

//@desc Get current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
    res.json({ message: "Current user info" });
});

module.exports = { registerUser, loginUser, currentUser };
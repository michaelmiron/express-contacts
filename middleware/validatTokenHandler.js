const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
    
        token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401);
            throw new Error("User is not authorized - token missing");
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized - token invalid");
            }

            req.user = decoded.user;
            next();
        });
    } else {
        res.status(401);
        throw new Error("User is not authorized - no bearer header");
    }
});

module.exports = validateToken;

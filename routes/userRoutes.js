const express = require("express");
const {
    registerUser,
    loginUser,
    currentUser
} = require("../controllers/userController");
const validateToken = require("../middleware/validatTokenHandler");

const router = express.Router();

router.post("/register", registerUser);
router.post("/loginUser", loginUser);
router.get("/current", validateToken, currentUser);

module.exports = router;
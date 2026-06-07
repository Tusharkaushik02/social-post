const express = require("express");
const router = express.Router();

const {
    getUserByUsername,
    getUserPosts,
    updateProfile
} = require("../controller/user.controller");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/:username", getUserByUsername);

router.get("/:username/posts", getUserPosts);

router.put("/profile/update",
    authMiddleware,
    updateProfile
);

module.exports = router;
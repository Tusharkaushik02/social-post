const express = require("express");
const router = express.Router();

const {
    getUserByUsername,
    getUserPosts,
    updateProfile,
    getSuggestions
} = require("../controller/user.controller");

const {togglefollow,getfollowing, getFollowers} = require("../controller/follow.controller");

const authMiddleware = require("../middleware/authMiddleware");
const optionalAuthMiddleware = require("../middleware/optionalAuth");

router.put("/profile/update",
    authMiddleware,
    updateProfile
);

router.get("/suggestions", authMiddleware, getSuggestions);

router.get("/:username", optionalAuthMiddleware, getUserByUsername);

router.get("/:username/posts", getUserPosts);

router.post("/:userId/follow", authMiddleware, togglefollow);

router.get("/:userId/followers", getFollowers);

router.get("/:userId/following", getfollowing); 

module.exports = router;

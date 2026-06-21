const express = require('express');
const registerRoute = require('./register.route');
const loginRoute = require('./login.route');
const oauthRoute = require('./oauth.route');
const { getMe, logoutUser } = require('../controller/auth.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(registerRoute);
router.use(loginRoute);
router.use(oauthRoute);
router.get('/me', authMiddleware, getMe);
router.post('/logout', logoutUser);

module.exports = router;
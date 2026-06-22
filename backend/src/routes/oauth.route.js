const express = require('express');
const oauthController = require('../controller/oauth.controller');

const router = express.Router();

router.post('/google', oauthController.googleOAuth);

module.exports = router;

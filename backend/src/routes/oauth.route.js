const express = require('express');
const oauthController = require('../controller/oAuth.controller');

const router = express.Router();

router.post('/google', oauthController.googleOAuth);

module.exports = router;

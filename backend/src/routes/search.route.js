const express = require('express');
const router = express.Router();
const { search } = require('../controller/search.controller');

// GET /api/search?q=term&type=all|users|posts
router.get('/', search);

module.exports = router;

const express = require('express');
const dotenv = require('dotenv');
const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const cookieParser = require('./middleware/cookie-parser');

const applyMiddleware = (app) => {
    app.use(requestLogger);
    app.use(corsMiddleware);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser);
}
module.exports = { applyMiddleware };

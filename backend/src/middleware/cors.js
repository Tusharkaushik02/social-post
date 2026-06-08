const cors = require('cors');

const corsMiddleware = cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
});

module.exports = corsMiddleware;

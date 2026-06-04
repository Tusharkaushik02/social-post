module.exports = {
    // API
    API_VERSION: 'v1',
    
    // Validation
    VALIDATION: {
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp']
    },

    // HTTP Status Codes
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500
    },

    // Messages
    MESSAGES: {
        SUCCESS: 'Request successful',
        ERROR: 'Something went wrong',
        NOT_FOUND: 'Resource not found',
        UNAUTHORIZED: 'Unauthorized access'
    }
};

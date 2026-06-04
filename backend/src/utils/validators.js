// Input validation utilities
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // Minimum 6 characters
    return password && password.length >= 6;
};

const validateCaption = (caption) => {
    return caption && caption.trim().length > 0 && caption.trim().length <= 500;
};

module.exports = {
    validateEmail,
    validatePassword,
    validateCaption
};

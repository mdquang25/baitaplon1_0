const { body, validationResult } = require('express-validator');

// Middleware function to validate and sanitize user input
const validateUserInput = [
    body('username').trim().notEmpty().withMessage('Name is required'),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Handle validation errors
            return res.status(400).json({ errors: errors.array() });
        }

        // No validation errors, proceed to the next middleware
        next();
    }
];
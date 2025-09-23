import { body } from 'express-validator';

export const signupValidation = [
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email format'),
    
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),

    body('full_name')
        .trim()
        .notEmpty().withMessage('Full Name is required')
        .isLength({ min: 8 }).withMessage('Full Name must be at least 8 characters long'),

    body('phone')
            .trim()
            .notEmpty().withMessage('Phone number is required')
            .isMobilePhone('any').withMessage('Invalid phone number format'),
]

export const loginValidation = [
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email format'),
    
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
]
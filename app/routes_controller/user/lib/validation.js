const { body } = require('express-validator');
const { User } = require('../../../db/models');

const userRegisterValidation = () => {
    return [
        body('firstName').notEmpty().withMessage('First Name is required'),
        body('lastName').notEmpty().withMessage('Last Name is required'),
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format')
            .custom(async (value) => {
                const existingUser = await User.findOne({ where: { email: value.toLowerCase() } });
                if (existingUser) {
                    return Promise.reject('Email already exists.');
                }
                return true;
            }),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters'),
    ];
};

const loginValidation = () => {
    return [
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
        body('password').notEmpty().withMessage('Password is required'),
    ];
};

module.exports = {
    userRegisterValidation,
    loginValidation,
};

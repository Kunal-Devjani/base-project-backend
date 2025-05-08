const db = require('../../../db/models');
const User = db.User;
const Role = db.Role;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { status, common } = require('../../../../utils');
const sendEmailVerificationCode = require('../../../../utils/lib/EmailService');

// User Customer
exports.userRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Determine role based on URL
        const role = req.originalUrl.includes('admin') ? 'Admin' : 'Customer';

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(status.BadRequest).json({ message: 'Email already exists.' });
        }

        // Get Role based on the route (Customer or Admin)
        const userRole = await Role.findOne({ where: { name: role } });

        if (!userRole) {
            return res.status(status.BadRequest).json({ message: 'Role not found!' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            roleId: userRole.id,
        });

        // Send verification email
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        await sendEmailVerificationCode(newUser.email, verificationCode);

        // Store verification code
        newUser.verificationCode = verificationCode;
        await newUser.save();

        return res
            .status(status.OK)
            .json({ data: { message: 'Registration successful. Please check your email for verification.', email: newUser.email } });
    } catch (err) {
        return common.throwException(err, 'User Registration', req, res);
    }
};

// Verify User Email
exports.verifyEmail = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;

        const user = await User.findOne({ where: { email, verificationCode } });
        if (!user) {
            return res.status(status.NotFound).json({ message: 'Invalid verification code' });
        }

        user.isEmailVerified = true;
        user.verificationCode = null;
        await user.save();

        return res.status(status.OK).json({ message: 'Email verified successfully.' });
    } catch (err) {
        return common.throwException(err, 'Email Verification', req, res);
    }
};

// Login Admin or Customer
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { deletedAt: null, email, status: true },
            include: [{ model: Role, as: 'Role', attributes: ['id', 'name'] }],
        });

        if (!user) {
            return res.status(status.NotFound).json({ message: 'User not found.' });
        }

        if (user.status != '1') {
            return res.status(status.NotFound).json({
                message: 'You Account has been disabled. Please contact Admin',
            });
        }

        if (req.originalUrl.includes('/customer') && user.Role.name != 'Customer') {
            return res.status(status.Forbidden).json({ message: 'You are not allowed to login from here.' });
        }

        if (req.originalUrl.includes('/admin') && user.Role.name != 'Admin') {
            return res.status(status.Forbidden).json({ message: 'You are not allowed to login from here.' });
        }

        if (!user.isEmailVerified) {
            return res.status(status.Forbidden).json({ message: 'Please verify your email first.' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(status.Unauthorized).json({ message: 'Invalid credentials.' });
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.Role.name,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

        return res.status(status.OK).json({ message: 'Login successful', accessToken: token });
    } catch (err) {
        return common.throwException(err, 'Login User', req, res);
    }
};

// Resend Verification Code
exports.resendVerificationCode = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email, deletedAt: null } });
        if (!user) {
            return res.status(status.NotFound).json({ message: 'User not found.' });
        }

        if (user.isEmailVerified) {
            return res.status(status.BadRequest).json({ message: 'Email is already verified.' });
        }

        const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        await sendEmailVerificationCode(user.email, newVerificationCode);

        user.verificationCode = newVerificationCode;
        await user.save();

        return res.status(status.OK).json({ message: 'Verification code resent. Please check your email.' });
    } catch (err) {
        return common.throwException(err, 'Resend Verification Code', req, res);
    }
};

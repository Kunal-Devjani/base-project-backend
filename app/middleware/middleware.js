var jwt = require('jsonwebtoken');
const db = require('../db/models');
const { status, messages } = require('../../utils');

const authenticateUser = async (req, res, next) => {
    try {
        var token = req.headers.authorization || null;
        if (!token) {
            return res.status(status.Unauthorized).json({ message: messages.unauthorized });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(status.Unauthorized).json({ message: messages.unauthorized });
        }
        const user = await db.User.findOne({
            attributes: {
                exclude: ['createdAt', 'createdBy', 'updatedAt', 'updatedBy', 'deletedAt', 'deletedBy'],
            },
            where: { id: decoded.id, deletedAt: null, status: '1' },
            include: [
                {
                    model: db.Role,
                    as: 'Role',
                    attributes: ['id', 'name'],
                    where: {
                        status: '1',
                        deletedAt: null,
                    },
                },
            ],
        });
        if (!user) {
            return res.status(status.Unauthorized).json({
                message: messages.unauthorized,
            });
        }

        req.user = user;

        return next();
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Admin Middleware', err.message);
        return res.status(status.Unauthorized).json({ message: messages.unauthorized });
    }
};

module.exports = authenticateUser;

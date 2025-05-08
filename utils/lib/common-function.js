const { validationResult } = require('express-validator');
const { status, messages } = require('./messages/api.response');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const enums = require('./enums');
const sgMail = require('@sendgrid/mail');
const cryptoJs = require('crypto-js');
const crypto = require('crypto');
const secretKey = 'BASE_PROJECT_SECRET_KEY';
const moment = require('moment');

module.exports = {
    expressValidate(req, res, next) {
        const errors = validationResult(req);
        let errorSort = errors.array({
            onlyFirstError: true,
        });

        if (!errors.isEmpty()) {
            let error = errorSort[0];
            return res.status(status.BadRequest).json({ message: error?.msg, fields: errorSort });
        }
        next();
    },

    throwException(error, APIName, req = null, res = null, customMessage = null) {
        if (error instanceof Error && Object.prototype.hasOwnProperty.call(error, 'errors')) {
            error.message = error.errors[0].message || error.name;
        }

        if (error instanceof Error) {
            if (req) {
                // eslint-disable-next-line no-console
                console.error(`Error in ${APIName}, URL: ${req.method} - ${req.url}:`, error.message);
            } else {
                // eslint-disable-next-line no-console
                console.error(`Error in ${APIName},`, error.message);
            }
        }

        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('Error: ', error);
        }

        if (res) {
            var erMsg = 'Something went wrong, please try again!';
            if (customMessage) erMsg = customMessage;
            else if (error?.status && error?.message) erMsg = error.message;

            return res.status(error?.status ? error.status : status.InternalServerError).json({
                message: erMsg,
                error: error.message,
            });
        } else {
            return true;
        }
    },
};

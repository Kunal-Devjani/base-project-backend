/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const app = express();
const httpServer = require('http').Server(app);

const bodyParser = require('body-parser');
const db = require('./app/db/models');
const cors = require('cors');
const compression = require('compression');

const { common, status } = require('./utils');

//* App Route Versions
const V1Routes = '/api/v1';

app.set('trust proxy', true);

//* Response Compression
app.use(compression());

//* Body Parser Options
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// Sequelize Connection and Sync
db.sequelize
    .authenticate()
    .then(() => {
        console.log('DB connected!');
    })
    .catch((err) => {
        console.error('DB connection failed!', err.message);
    });

//* CORS Options
app.use(
    cors({
        origin: '*',
    })
);

// Function to check if a function is asynchronous
function isFunctionAsync(fn) {
    return fn.constructor.name === 'AsyncFunction';
}

// App Routes
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        res.status(status.InternalServerError).json({ error: `${err}` });
        common.throwException(err);
    });
};

const wrapRoutesWithAsyncHandler = (router) => {
    router.stack.forEach((layer) => {
        if (layer.handle && layer.handle.stack) {
            // Iterate over the nested layers
            layer.handle.stack.forEach((innerLayer) => {
                if (innerLayer.handle && innerLayer.handle.stack) {
                    innerLayer.handle.stack.forEach((subInnerLayer) => {
                        subInnerLayer.route.stack.forEach((deepLayer) => {
                            if (isFunctionAsync(deepLayer.handle)) {
                                // Pass only async functions to async handler
                                deepLayer.handle = asyncHandler(deepLayer.handle);
                            }
                        });
                    });
                }
            });
        }
    });
    return router;
};

app.use(V1Routes, wrapRoutesWithAsyncHandler(require('./app/routes_controller')));

// Define a simple route
app.get('/', (req, res) => {
    return res.json({ message: 'Server running.' });
});

//* End Point API Not Available
app.use((req, res, next) => {
    req.APINotFound = true;
    return res.status(status.NotFound).json({
        error: 'Not Found',
        message: `EndPoint not available: ${req.method} ${req.originalUrl?.split('?')[0]}`,
    });
});

//* Server
httpServer.listen(process.env.PORT || 5000, function () {
    console.log('Magic happens on localhost:' + process.env.PORT);
});

process.on('unhandledRejection', (error, p) => {
        // eslint-disable-next-line no-console
        console.error('Unhandled Rejection :', error.message);
    });
    
process.on('uncaughtException', (error, p) => {
        // eslint-disable-next-line no-console
        console.error('Uncaught Exception :', error.message);
    });
    
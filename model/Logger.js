"use strict";


const winston = require('winston');
require('winston-daily-rotate-file');

const transport = new (winston.transports.DailyRotateFile)({
    filename: 'log/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '1000d'
});

const logger = winston.createLogger({
    transports: [
        transport
    ]
});

module.exports = logger;
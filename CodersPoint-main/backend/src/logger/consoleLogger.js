import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, metadata } = format;

const logLevel = process.env.LOG_LEVEL || 'info';

const myFormat = printf(({ level, message, timestamp, stack, metadata }) => {
    return stack
        ? `${timestamp} ${level}: ${message}\n${stack}`
        : `${timestamp} ${level}: ${message}`;
});

export const consoleLogger = () => {
    return createLogger({
        level: logLevel,
        format: combine(
            colorize(),
            timestamp({ format: "HH:mm:ss" }),
            metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
            myFormat
        ),
        transports: [
            new transports.Console(),
        ],
    });
};

export const fileLogger = () => {
    return createLogger({
        level: logLevel,
        format: combine(
            timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            myFormat
        ),
        transports: [
            // stdout so PaaS platforms (Render/Railway/Fly/etc.) capture and
            // aggregate logs even though local disk is typically ephemeral
            new transports.Console(),
            new DailyRotateFile({
                filename: 'logs/application-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                maxSize: '20m',
                maxFiles: '14d', // Keep logs for 14 days
            }),
        ],
    });
};


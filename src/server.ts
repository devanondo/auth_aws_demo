import { PrismaClient } from '@prisma/client';
import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';
import { Server } from 'http';

process.on('uncaughtException', () => {
    console.log(`Uncaught Exception detected...`);
    process.exit(1);
});

declare global {
    var prisma: PrismaClient | undefined;
}

let server: Server;
async function ConnectDatabase() {
    try {
        const db = globalThis.prisma || new PrismaClient();

        if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;

        logger.info(`🥃 Database Connected!`);

        server = app.listen(config.port, () => {
            logger.info(`🛢️ Server is running on ${config.port}`);
        });
    } catch (error) {
        console.log(error);
        errorLogger.error('🤬 Faild to connect Database!');
    }

    process.on('unhandledRejection', (error) => {
        console.log(`UnhandledRejection is detected, closing the server... 🌂`);

        if (server) {
            server.close(() => {
                errorLogger.error(error);
                process.exit(1);
            });
        } else {
            process.exit(1);
        }
    });
}

ConnectDatabase();

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});

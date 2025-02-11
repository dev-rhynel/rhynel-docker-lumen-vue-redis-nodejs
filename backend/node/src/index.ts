import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database';
import { createLogger, format, transports } from 'winston';
import redisClient from './config/redis';
import postsRouter from './routes/posts';

const app = express();
const port = process.env.PORT || 3001;

// Create logger
const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    ]
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cache-test', postsRouter);

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Check Redis connection
        await redisClient.ping();

        res.json({ 
            status: 'ok',
            redis: 'connected'
        });
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Health check failed'
        });
    }
});

// Start server
app.listen(port, () => {
    logger.info(`Node.js Redis caching service listening at http://localhost:${port}`);
});

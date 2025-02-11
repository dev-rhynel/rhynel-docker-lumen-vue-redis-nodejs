import express from 'express';
import cors from 'cors';
import { createLogger, format, transports } from 'winston';
import RedisService from './config/redis';

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

// Redis endpoints
app.post('/api/cache/set', async (req, res) => {
    try {
        const { key, value, expireSeconds } = req.body;
        if (!key || value === undefined) {
            return res.status(400).json({ error: 'Key and value are required' });
        }
        
        const result = await RedisService.set(key, value, expireSeconds);
        res.json({ success: true, result });
    } catch (error) {
        logger.error('Error in /api/cache/set:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/cache/get/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const value = await RedisService.get(key);
        
        if (value === null) {
            return res.status(404).json({ error: 'Key not found' });
        }
        
        res.json({ value });
    } catch (error) {
        logger.error('Error in /api/cache/get:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/cache/delete/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const result = await RedisService.delete(key);
        res.json({ success: result > 0 });
    } catch (error) {
        logger.error('Error in /api/cache/delete:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', redis: RedisService.getInstance().status });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

// Handle process termination
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    RedisService.getInstance().quit();
    process.exit(0);
});

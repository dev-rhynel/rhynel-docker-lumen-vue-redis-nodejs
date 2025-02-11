import Redis from 'ioredis';
import { logger } from './logger';

const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'redis_cache',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    retryStrategy: (times: number) => {
        if (times > 3) {
            logger.error('Redis connection failed');
            return null;
        }
        return Math.min(times * 100, 3000);
    }
});

redisClient.on('connect', () => {
    logger.info('Redis client connected');
});

redisClient.on('error', (err: Error) => {
    logger.error('Redis client error:', err);
});

export default redisClient;

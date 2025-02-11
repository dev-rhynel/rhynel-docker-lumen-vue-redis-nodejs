import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';
import { logger } from '../config/logger';

interface CacheOptions {
    expire?: number; // Time in seconds
}

export const cache = (prefix: string, options: CacheOptions = {}) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const key = `${prefix}:${req.originalUrl}`;
            const cachedData = await redisClient.get(key);

            if (cachedData) {
                logger.info(`Cache hit for key: ${key}`);
                return res.json(JSON.parse(cachedData));
            }

            // Store the original res.json function
            const originalJson = res.json;

            // Override res.json to cache the response before sending
            res.json = function (body: any) {
                // Restore the original res.json function
                res.json = originalJson;

                // Cache the response
                const expire = options.expire || 3600; // Default 1 hour
                redisClient.setex(key, expire, JSON.stringify(body))
                    .catch(err => logger.error('Redis cache error:', err));

                logger.info(`Cache set for key: ${key}`);

                // Send the response
                return res.json(body);
            };

            next();
        } catch (error) {
            logger.error('Cache middleware error:', error);
            next();
        }
    };
};

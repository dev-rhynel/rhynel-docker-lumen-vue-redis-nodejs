import { Request, Response, NextFunction } from 'express';
import { redisService } from '../services/redis.service';
import { logger } from '../utils/logger';

interface CacheOptions {
    prefix: string;
    duration?: number;
    params?: string[];
}

export const cacheMiddleware = (options: CacheOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Generate cache key based on request parameters
            const params: Record<string, any> = {};
            if (options.params) {
                options.params.forEach(param => {
                    if (req.params[param]) params[param] = req.params[param];
                    if (req.query[param]) params[param] = req.query[param];
                });
            }

            const cacheKey = redisService.generateKey(options.prefix, params);
            const cachedData = await redisService.get(cacheKey);

            if (cachedData) {
                logger.info(`Cache hit for key: ${cacheKey}`);
                return res.json(cachedData);
            }

            // Store the original send function
            const originalSend = res.json;

            // Override the send function to cache the response
            res.json = function (body: any): Response {
                // Restore the original send function
                res.json = originalSend;

                // Cache the response
                redisService.set(cacheKey, body, options.duration);
                logger.info(`Cached data for key: ${cacheKey}`);

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

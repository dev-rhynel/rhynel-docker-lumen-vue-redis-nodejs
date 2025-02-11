import Redis from 'ioredis';
import { logger } from './logger';

class RedisService {
    private static instance: Redis | null = null;
    private static retryCount = 0;
    private static readonly MAX_RETRIES = 3;

    public static getInstance(): Redis {
        if (!this.instance) {
            this.instance = new Redis({
                host: process.env.REDIS_HOST || '127.0.0.1',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                retryStrategy: (times: number) => {
                    this.retryCount = times;
                    if (times > this.MAX_RETRIES) {
                        logger.error(`Redis connection failed after ${times} attempts`);
                        return null;
                    }
                    const delay = Math.min(times * 500, 2000);
                    logger.info(`Retrying Redis connection in ${delay}ms...`);
                    return delay;
                }
            });

            this.instance.on('connect', () => {
                logger.info('Redis client connected successfully');
                this.retryCount = 0;
            });

            this.instance.on('error', (err: Error) => {
                logger.error('Redis client error:', err);
            });

            this.instance.on('close', () => {
                logger.warn('Redis connection closed');
            });
        }

        return this.instance;
    }

    public static async set(key: string, value: any, expireSeconds?: number): Promise<'OK' | null> {
        try {
            const redis = this.getInstance();
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            
            if (expireSeconds) {
                return await redis.set(key, stringValue, 'EX', expireSeconds);
            }
            return await redis.set(key, stringValue);
        } catch (error) {
            logger.error('Error setting Redis key:', error);
            return null;
        }
    }

    public static async get(key: string): Promise<any> {
        try {
            const redis = this.getInstance();
            const value = await redis.get(key);
            if (!value) return null;
            
            try {
                return JSON.parse(value);
            } catch {
                return value;
            }
        } catch (error) {
            logger.error('Error getting Redis key:', error);
            return null;
        }
    }

    public static async delete(key: string): Promise<number> {
        try {
            const redis = this.getInstance();
            return await redis.del(key);
        } catch (error) {
            logger.error('Error deleting Redis key:', error);
            return 0;
        }
    }

    public static async exists(key: string): Promise<boolean> {
        try {
            const redis = this.getInstance();
            const result = await redis.exists(key);
            return result === 1;
        } catch (error) {
            logger.error('Error checking Redis key existence:', error);
            return false;
        }
    }
}

export default RedisService;

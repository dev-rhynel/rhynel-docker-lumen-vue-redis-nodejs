import Redis from 'ioredis';
import { logger } from '../utils/logger';

class RedisService {
    private redis: Redis;
    private readonly DEFAULT_EXPIRATION = 3600; // 1 hour in seconds

    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'redis',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
        });

        this.redis.on('error', (error) => {
            logger.error('Redis connection error:', error);
        });

        this.redis.on('connect', () => {
            logger.info('Connected to Redis');
        });
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            logger.error(`Error getting data from Redis for key ${key}:`, error);
            return null;
        }
    }

    async set(key: string, value: any, expiration: number = this.DEFAULT_EXPIRATION): Promise<void> {
        try {
            const stringValue = JSON.stringify(value);
            await this.redis.setex(key, expiration, stringValue);
        } catch (error) {
            logger.error(`Error setting data in Redis for key ${key}:`, error);
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.redis.del(key);
        } catch (error) {
            logger.error(`Error deleting data from Redis for key ${key}:`, error);
        }
    }

    async clearCache(): Promise<void> {
        try {
            await this.redis.flushall();
            logger.info('Redis cache cleared');
        } catch (error) {
            logger.error('Error clearing Redis cache:', error);
        }
    }

    generateKey(prefix: string, params: Record<string, any>): string {
        const sortedParams = Object.entries(params)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, value]) => `${key}:${value}`)
            .join(':');
        return `${prefix}:${sortedParams}`;
    }
}

export const redisService = new RedisService();

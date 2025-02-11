import { RedisService } from '../redis.service';
import Redis from 'ioredis';

jest.mock('ioredis');

describe('RedisService', () => {
    let redisService: RedisService;
    let mockRedis: jest.Mocked<Redis>;

    beforeEach(() => {
        mockRedis = new Redis() as jest.Mocked<Redis>;
        redisService = new RedisService();
        (redisService as any).redis = mockRedis;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('set', () => {
        it('should set a value with expiration', async () => {
            const key = 'test-key';
            const value = { data: 'test-data' };
            const expiration = 3600;

            await redisService.set(key, value, expiration);

            expect(mockRedis.setex).toHaveBeenCalledWith(
                key,
                expiration,
                JSON.stringify(value)
            );
        });

        it('should set a value without expiration', async () => {
            const key = 'test-key';
            const value = { data: 'test-data' };

            await redisService.set(key, value);

            expect(mockRedis.set).toHaveBeenCalledWith(
                key,
                JSON.stringify(value)
            );
        });
    });

    describe('get', () => {
        it('should get a value from redis', async () => {
            const key = 'test-key';
            const value = { data: 'test-data' };
            mockRedis.get.mockResolvedValue(JSON.stringify(value));

            const result = await redisService.get(key);

            expect(mockRedis.get).toHaveBeenCalledWith(key);
            expect(result).toEqual(value);
        });

        it('should return null for non-existent key', async () => {
            const key = 'non-existent-key';
            mockRedis.get.mockResolvedValue(null);

            const result = await redisService.get(key);

            expect(mockRedis.get).toHaveBeenCalledWith(key);
            expect(result).toBeNull();
        });
    });

    describe('delete', () => {
        it('should delete a key from redis', async () => {
            const key = 'test-key';
            mockRedis.del.mockResolvedValue(1);

            await redisService.delete(key);

            expect(mockRedis.del).toHaveBeenCalledWith(key);
        });
    });
});

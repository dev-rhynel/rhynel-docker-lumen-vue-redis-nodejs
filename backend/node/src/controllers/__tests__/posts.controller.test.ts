import { Request, Response } from 'express';
import { PostsController } from '../posts.controller';
import { RedisService } from '../../services/redis.service';

jest.mock('../../services/redis.service');

describe('PostsController', () => {
    let postsController: PostsController;
    let mockRedisService: jest.Mocked<RedisService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockRedisService = new RedisService() as jest.Mocked<RedisService>;
        postsController = new PostsController(mockRedisService);

        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockRequest = {};
        mockResponse = {
            status: mockStatus,
            json: mockJson
        };
    });

    describe('getCachedPosts', () => {
        it('should return cached posts if they exist', async () => {
            const cachedPosts = [
                { id: 1, title: 'Post 1' },
                { id: 2, title: 'Post 2' }
            ];
            mockRedisService.get.mockResolvedValue(cachedPosts);

            await postsController.getCachedPosts(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockRedisService.get).toHaveBeenCalledWith('posts');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ data: cachedPosts });
        });

        it('should return 404 if no cached posts exist', async () => {
            mockRedisService.get.mockResolvedValue(null);

            await postsController.getCachedPosts(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockRedisService.get).toHaveBeenCalledWith('posts');
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ 
                message: 'No cached posts found' 
            });
        });
    });

    describe('cachePosts', () => {
        it('should cache posts successfully', async () => {
            const posts = [
                { id: 1, title: 'Post 1' },
                { id: 2, title: 'Post 2' }
            ];
            mockRequest.body = { posts };

            await postsController.cachePosts(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockRedisService.set).toHaveBeenCalledWith(
                'posts',
                posts,
                3600
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith({ 
                message: 'Posts cached successfully' 
            });
        });

        it('should handle caching errors', async () => {
            mockRequest.body = { posts: [] };
            mockRedisService.set.mockRejectedValue(new Error('Redis error'));

            await postsController.cachePosts(
                mockRequest as Request,
                mockResponse as Response
            );

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ 
                error: 'Failed to cache posts' 
            });
        });
    });
});

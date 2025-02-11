import { Request, Response } from 'express';
import { Post } from '../models/Post';

export class PostController {
    static async getAllPosts(req: Request, res: Response) {
        try {
            const posts = await Post.findAll({
                include: ['user']
            });
            res.json(posts);
        } catch (error) {
            console.error('Error getting posts:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getPostById(req: Request, res: Response) {
        try {
            const post = await Post.findByPk(req.params.id, {
                include: ['user']
            });
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            res.json(post);
        } catch (error) {
            console.error('Error getting post:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async createPost(req: Request, res: Response) {
        try {
            const post = await Post.create({
                ...req.body,
                userId: req.user?.id
            });
            res.status(201).json(post);
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async updatePost(req: Request, res: Response) {
        try {
            const post = await Post.findByPk(req.params.id);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            if (post.userId !== req.user?.id) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            await post.update(req.body);
            res.json(post);
        } catch (error) {
            console.error('Error updating post:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deletePost(req: Request, res: Response) {
        try {
            const post = await Post.findByPk(req.params.id);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            if (post.userId !== req.user?.id) {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            await post.destroy();
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting post:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
import { Router } from 'express';
import { cache } from '../middleware/cache';

const router = Router();

// Example route that demonstrates Redis caching
router.get('/cached-data', cache('example', { expire: 3600 }), (req, res) => {
    // Simulated data that would normally come from a database
    const data = {
        message: 'This response is cached in Redis',
        timestamp: new Date().toISOString()
    };
    res.json(data);
});

export default router;

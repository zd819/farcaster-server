import { Router } from 'express';
const router = Router();

// login handling
router.post('/', (req, res) => {
    console.log('Health Attempt');
    res.status(200)
});

export default router;
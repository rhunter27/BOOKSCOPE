import express from 'express';
const router = express.Router();
import userRoutes from '../api/user-routes';

router.use('/users', userRoutes);

export default router;

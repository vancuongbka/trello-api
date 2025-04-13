import express from 'express';
import boardRoute from './boardRoute.js';
import columnRoute from './columnRoute.js';
import cardRoute from './cardRoute.js';
import userRoute from './userRoute.js';

const router = express.Router();

router.get('/status', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

router.use('/boards', boardRoute);
router.use('/columns', columnRoute);
router.use('/cards', cardRoute);
router.use('/users', userRoute);

export default router;
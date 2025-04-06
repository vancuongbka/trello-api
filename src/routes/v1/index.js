import express from 'express';
import boardRoute from './boardRoute.js';

const router = express.Router();

router.get('/status', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

router.use('/boards', boardRoute);

export default router;
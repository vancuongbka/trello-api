import express from 'express';
import boardController from '~/controllers/boardController';
import boardValidation from '~/validations/boardValidation';
import authMiddleware from '~/middlewares/authMiddleware';

const router = express.Router();

router.route('/')
  .get(authMiddleware.isAuthorized, (req, res) => {
    res.status(200).json({ status: 'Get List Board Controller' });
  })
  .post(authMiddleware.isAuthorized, boardValidation.createNew, boardController.createNew);

router.route('/:id')
  .get(authMiddleware.isAuthorized, (req, res) => {
    boardController.getDetail(req, res);
  })
  .put(authMiddleware.isAuthorized, (req, res) => {
    res.status(200).json({ status: 'Update Board Controller' });
  })
  .delete(authMiddleware.isAuthorized, (req, res) => {
    res.status(200).json({ status: 'Delete Board Controller' });
  })

export default router;
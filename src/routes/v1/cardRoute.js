import express from 'express';
import cardController from '~/controllers/cardController';
import cardValidation from '~/validations/cardValidation';
import authMiddleware from '~/middlewares/authMiddleware';

const router = express.Router();

router.route('/')
  .get(authMiddleware.isAuthorized, (req, res) => {
    res.status(200).json({ status: 'Get List Board Controller' });
  })
  .post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew);

router.route('/:id')
  .get(authMiddleware.isAuthorized, (req, res) => {
    cardController.getDetail(req, res);
  })
  .put((req, res) => {
    res.status(200).json({ status: 'Update Board Controller' });
  })
  .delete((req, res) => {
    res.status(200).json({ status: 'Delete Board Controller' });
  })

export default router;
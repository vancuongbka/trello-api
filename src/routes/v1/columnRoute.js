import express from 'express';
import columnController from '~/controllers/columnController';
import columnValidation from '~/validations/columnValidation';
import authMiddleware from '~/middlewares/authMiddleware';

const router = express.Router();

router.route('/')
  .get((req, res) => {
    res.status(200).json({ status: 'Get List Board Controller' });
  })
  .post(authMiddleware.isAuthorized, columnValidation.createNew, columnController.createNew);

router.route('/:id')
  .get((req, res) => {
    columnController.getDetail(req, res);
  })
  .put((req, res) => {
    res.status(200).json({ status: 'Update Board Controller' });
  })
  .delete((req, res) => {
    res.status(200).json({ status: 'Delete Board Controller' });
  })

export default router;
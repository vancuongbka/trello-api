import express from 'express';
import boardController from '~/controllers/boardController';
import boardValidation from '~/validations/boardValidation';

const router = express.Router();

router.route('/')
  .get((req, res) => {
    res.status(200).json({ status: 'Get List Board Controller' });
  })
  .post(boardValidation.createNew, boardController.createNew);

router.route('/:id')
  .get((req, res) => {
    boardController.getDetail(req, res);
  })
  .put((req, res) => {
    res.status(200).json({ status: 'Update Board Controller' });
  })
  .delete((req, res) => {
    res.status(200).json({ status: 'Delete Board Controller' });
  })

export default router;
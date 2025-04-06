import ApiError from '~/utils/ApiError';
import boardService from '~/services/boardService';

const createNew = async (req, res, next) => {
  try {
    //const newBoard = req.body
    const createdBoard = await boardService.createNew(req.body);
    res.status(201).json(createdBoard);
  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const board = await boardService.getDetail(req.params.id);
    res.status(200).json(board);
  } catch (error) {
    next(error)
  }
}

const boardController = {
  createNew,
  getDetail
};

export default boardController;
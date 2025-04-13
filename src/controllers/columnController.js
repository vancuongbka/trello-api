import ApiError from '~/utils/ApiError';
import columnService from '~/services/columnService';

const createNew = async (req, res, next) => {
  try {
    //const newColumn = req.body
    const createdColumn = await columnService.createNew(req.body);
    res.status(201).json(createdColumn);
  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const column = await columnService.getDetail(req.params.id);
    res.status(200).json(column);
  } catch (error) {
    next(error)
  }
}

const columnController = {
  createNew,
  getDetail
};

export default columnController;
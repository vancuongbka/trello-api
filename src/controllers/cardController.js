import ApiError from '~/utils/ApiError';
import cardService from '~/services/cardService';

const createNew = async (req, res, next) => {
  try {
    //const newCard = req.body
    const createdCard = await cardService.createNew(req.body);
    res.status(201).json(createdCard);
  } catch (error) {
    next(error)
  }
}

const getDetail = async (req, res, next) => {
  try {
    const card = await cardService.getDetail(req.params.id);
    res.status(200).json(card);
  } catch (error) {
    next(error)
  }
}

const cardController = {
  createNew,
  getDetail
};

export default cardController;
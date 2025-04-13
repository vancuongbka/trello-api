import { cardModel } from '~/models/cardModel.js';
import ApiError from '~/utils/ApiError.js';

const createNew = async (card) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newCard = {
      ...card
    }

    const result = await cardModel.createNew(newCard);
    const createdCard = await cardModel.findOneById(result.insertedId);
    return createdCard
  } catch (error) {
    throw error;
  }
}

const getDetail = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const card = await cardModel.getDetail(id);

    if (!card) {
      throw new ApiError(404, 'Card not found');
    }

    card.cards.forEach(card => {
      card.cards = card.cardOrderIds.map(cardId => card.cards.find(card => card._id.equals(cardId)));
    });

    return card;
  } catch (error) {
    throw error;
  }
}

const cardService = {
  createNew,
  getDetail
}

export default cardService
import { columnModel } from '~/models/columnModel.js';
import ApiError from '~/utils/ApiError.js';

const createNew = async (column) => {
  try {
    const newColumn = {
      ...column,
    }

    const result = await columnModel.createNew(newColumn);
    const createdColumn = await columnModel.findOneById(result.insertedId);
    return createdColumn
  } catch (error) {
    throw error;
  }
}

const getDetail = async (id) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const column = await columnModel.getDetail(id);

    if (!column) {
      throw new ApiError(404, 'Column not found');
    }

    column.columns.forEach(column => {
      column.cards = column.cardOrderIds.map(cardId => column.cards.find(card => card._id.equals(cardId)));
    });

    return column;
  } catch (error) {
    throw error;
  }
}

const columnService = {
  createNew,
  getDetail
}

export default columnService
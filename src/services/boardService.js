import { boardModel } from '~/models/boardModel.js';
import { slugify } from '../utils/formatters.js'
import ApiError from '~/utils/ApiError.js';

const createNew = async (board) => {
  try {
    const newBoard = {
      ...board,
      slug: slugify(board.title)
    }

    const result = await boardModel.createNew(newBoard);
    const createdBoard = await boardModel.findOneById(result.insertedId);
    return createdBoard
  } catch (error) {
    throw error;
  }
}

const getDetail = async (id) => {
  try {
    const board = await boardModel.getDetail(id);

    if (!board) {
      throw new ApiError(404, 'Board not found');
    }

    board.columns.forEach(column => {
      column.cards = column.cardOrderIds.map(cardId => board.cards.find(card => card._id.equals(cardId)));
    });

    return board;
  } catch (error) {
    throw error;
  }
}

const boardService = {
  createNew,
  getDetail
}

export default boardService
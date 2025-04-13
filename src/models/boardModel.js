import Joi from 'joi'
import { getDb } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { BOARD_TYPE } from '~/utils/constants'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'

// Define Collection (name & schema)
const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().required().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE),

  // Lưu ý các item trong mảng columnOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async (data) => {
  try {
    return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
  } catch (error) {
    throw new Error(error);
  }
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data);
    const createdBoard = await getDb().collection(BOARD_COLLECTION_NAME).insertOne(validatedData);
    return createdBoard;
  } catch (error) {
    throw new Error(error);
  }
}

const findOneById = async (id) => {
  try {
    const board = await getDb().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
    return board;
  } catch (error) {
    throw new Error(error);
  }
}

const getDetail = async (id) => {
  try {
    const result = await getDb()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false
          }
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns'
          }
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards'
          }
        }
      ]).toArray();

    return result[0] || {};
  } catch (error) {
    throw new Error(error);
  }
}

const pushColumnOrderIds = async (boardId, columnId) => {
  try {
    const board = await getDb().collection(BOARD_COLLECTION_NAME).findOne({ _id: new ObjectId(boardId) });
    const columnOrderIds = board.columnOrderIds;
    columnOrderIds.push(new ObjectId(columnId)); // Push columnId into columnOrderIds
    await getDb().collection(BOARD_COLLECTION_NAME).updateOne({ _id: new ObjectId(boardId) }, { $set: { columnOrderIds } });
    return columnOrderIds;
  } catch (error) {
    throw new Error(error);
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetail,
  pushColumnOrderIds,
}
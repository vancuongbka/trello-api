import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  cardOrderIds: Joi.array().items(
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

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA
}
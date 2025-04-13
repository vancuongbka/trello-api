import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { getDb } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { boardModel } from './boardModel'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
})

const validateBeforeCreate = async (data) => {
  try {
    const validatedData = await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
    validatedData.boardId = new ObjectId(validatedData.boardId);
    return validatedData;
  } catch (error) {
    throw new Error(error);
  }
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data);
    const createdColumn = await getDb().collection(COLUMN_COLLECTION_NAME).insertOne(validatedData);

    // Return created column
    await boardModel.pushColumnOrderIds(validatedData.boardId, createdColumn.insertedId);

    return createdColumn;
  } catch (error) {
    throw new Error(error);
  }
}

const findOneById = async (id) => {
  try {
    const column = await getDb().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
    return column;
  } catch (error) {
    throw new Error(error);
  }
}

const getDetail = async (id) => {
  try {
    const result = await getDb()
      .collection(COLUMN_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
          }
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'columnId',
            as: 'columns'
          }
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'columnId',
            as: 'cards'
          }
        }
      ]).toArray();

    return result[0] || {};
  } catch (error) {
    throw new Error(error);
  }
}

const pushCardOrderIds = async (columnId, cardId) => {
  try {
    const column = await getDb().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(columnId) });
    const cardOrderIds = column.cardOrderIds;
    cardOrderIds.push(new ObjectId(cardId)); // Push cardId into cardOrderIds
    await getDb().collection(COLUMN_COLLECTION_NAME).updateOne({ _id: new ObjectId(columnId) }, { $set: { cardOrderIds } });
    return cardOrderIds;
  } catch (error) {
    throw new Error(error);
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetail,
  pushCardOrderIds,
}
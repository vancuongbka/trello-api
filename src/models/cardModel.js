import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { getDb } from '~/config/mongodb'
import { columnModel } from './columnModel'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
})

const validateBeforeCreate = async (data) => {
  try {
    const validatedData = await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
    validatedData.boardId = new ObjectId(validatedData.boardId);
    validatedData.columnId = new ObjectId(validatedData.columnId);
    return validatedData;
  } catch (error) {
    throw new Error(error);
  }
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data);
    const createdCard = await getDb().collection(CARD_COLLECTION_NAME).insertOne(validatedData);

    await columnModel.pushCardOrderIds(validatedData.columnId, createdCard.insertedId);

    return createdCard;
  } catch (error) {
    throw new Error(error);
  }
}

const findOneById = async (id) => {
  try {
    const card = await getDb().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
    return card;
  } catch (error) {
    throw new Error(error);
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
}
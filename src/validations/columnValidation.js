import Joi from 'joi';
import ApiError from '../utils/ApiError.js';
import { BOARD_TYPE } from '../utils/constants.js';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators.js';

const createNew = async (req, res, next) => {
  const conditions = Joi.object({
    boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    title: Joi.string().required().min(3).max(50).trim().strict(),
  })

  try {
    await conditions.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(422, new Error(error).message));
  }
}

const boardValidation = {
  createNew
}

export default boardValidation;
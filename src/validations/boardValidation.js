import Joi from 'joi';
import ApiError from '../utils/ApiError.js';
import { BOARD_TYPE } from '../utils/constants.js';

const createNew = async (req, res, next) => {
  const conditions = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(500).trim().strict(),
    type: Joi.string().required().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE)
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
import Joi from "joi";
import ApiError from "../utils/ApiError.js";
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from "../utils/validators.js";

const register = async (req, res, next) => {
    const conditions = Joi.object({
        email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
        password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
    });

    try {
        await conditions.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(422, new Error(error).message));
    }
}
const verifyUser = async (req, res, next) => {
    const conditions = Joi.object({
        email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
        token: Joi.string().required(),
    });

    try {
        await conditions.validateAsync(req.body, { abortEarly: false });    
        next();
    } catch (error) {
        next(new ApiError(422, new Error(error).message));
    }
}

const login = async (req, res, next) => {
    const conditions = Joi.object({
        email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
        password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
   })

    try {
        await conditions.validateAsync(req.body, { abortEarly: false });    
        next();
    } catch (error) {
        next(new ApiError(422, new Error(error).message));
    }
}

const userValidation = {
    register,
    verifyUser,
    login,
};

export default userValidation;
import Joi from "joi";
import { getDb } from "../config/mongodb.js";
import { ObjectId } from "mongodb";
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from "../utils/validators.js";

const UserRoles = {
    CLIENT: "client",
    ADMIN: "admin",
}

const USER_COLLECTION_NAME = "users";
const USER_COLLECTION_SCHEMA = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
    userName: Joi.string().required().trim().strict(),
    displayName: Joi.string().required().trim().strict(),
    avatar: Joi.string().default(null),
    role: Joi.string().valid(UserRoles.CLIENT, UserRoles.ADMIN).default(UserRoles.CLIENT),

    isActive: Joi.boolean().default(false),
    verifyToken: Joi.string(),

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false),
});

const NOT_UPDATED_FIELDS = ["_id", "createdAt"];

const validateBeforeRegister = async (user) => {
    return await USER_COLLECTION_SCHEMA.validateAsync(user, { abortEarly: false });
}

const register = async (user) => {
    try {
        const validatedData = await validateBeforeRegister(user);
        const registeredUser = getDb().collection(USER_COLLECTION_NAME).insertOne(validatedData);
        return registeredUser;
    } catch (error) {
        throw new Error(error);
    }
};

const findOneById = async (id) => {
    try {
        const user = await getDb().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

const findOneByEmail = async (email) => {
    try {
        const user = await getDb().collection(USER_COLLECTION_NAME).findOne({ email: email?.toLowerCase() });
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

const update = async (id, data) => {
    try {
        const user = await findOneById(id);
        if (!user) {
            throw new Error("User not found");
        }

        const updatedData = { ...user, ...data, updatedAt: Date.now() };

        for (const key in updatedData) {
            if (NOT_UPDATED_FIELDS.includes(key)) {
                delete updatedData[key];
            }
        }

        const result = await getDb().collection(USER_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

const userModel = {
    register,
    findOneById,
    findOneByEmail,
    update,
};

export default userModel;
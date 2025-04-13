import userModel from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import brevoProvider from "~/providers/brevoProvider";
import jwtProvider from "~/providers/jwtProvider";
import { env } from "~/config/environment";

const register = async (user) => {
    try {
        const existingUser = await userModel.findOneByEmail(user.email);
        if (existingUser) {
            throw new ApiError(409, "Email already exists");
        }

        const nameFromEmail = user.email.split("@")[0];

        user.email = user.email.toLowerCase();
        user.userName = nameFromEmail;
        user.displayName = nameFromEmail;
        user.password = await bcrypt.hash(user.password, 10);
        user.verifyToken = uuidv4();

        const result = await userModel.register(user);
        const registeredUser = await userModel.findOneById(result.insertedId);

        // Send verification email
        const verificationUrl = `${process.env.CLIENT_URL}/account/verification?email=${registeredUser.email}&token=${registeredUser.verifyToken}`;
        const customSubject = `Verify your email address on ${process.env.CLIENT_URL}!`;
        const htmlContent = `<p>Click below link to verify your email address on ${process.env.CLIENT_URL}</p>
        <p>${verificationUrl}</p>`;

        brevoProvider.sendEmail({ to: registeredUser.email, subject: customSubject, htmlContent });

        delete registeredUser.password;
        delete registeredUser.verifyToken;
        delete registeredUser._destroy;

        return registeredUser;
    } catch (error) {
        throw new Error(error);
    }
}

const verifyUser = async (reqBody) => {
    try {
        const existingUser = await userModel.findOneByEmail(reqBody.email);

        if (!existingUser) {
            throw new ApiError(404, "User not found");
        }

        if (existingUser.isActive) {
            throw new ApiError(406, "Your account is already active");
        }

        if (existingUser.verifyToken !== reqBody.token) {
            throw new ApiError(400, "Invalid token");
        }

        const updateData = {
            isActive: true,
            verifyToken: null,
        };

        const updatedUser = await userModel.update(existingUser._id, updateData);

        delete updatedUser.password;
        delete updatedUser.verifyToken;
        delete updatedUser._destroy;

        return updatedUser;
    } catch (error) {
        throw new Error(error);
    }
}

const login = async (user) => {
    try {
        const existingUser = await userModel.findOneByEmail(user.email);

        if (!existingUser) {
            throw new ApiError(404, "User not found");
        }

        if (!existingUser.isActive) {
            throw new ApiError(401, "User is not active");
        }

        const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid password");
        }

        const userInfo = {
            _id: existingUser._id,
            email: existingUser.email,
            userName: existingUser.userName,
            displayName: existingUser.displayName,
            avatar: existingUser.avatar,
        };

        const accessToken = jwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, env.ACCESS_TOKEN_LIFE);
        const refreshToken = jwtProvider.generateToken(userInfo, env.REFRESH_TOKEN_SECRET_SIGNATURE, env.REFRESH_TOKEN_LIFE);

        userInfo.accessToken = accessToken;
        userInfo.refreshToken = refreshToken;
        return userInfo;
    } catch (error) {
        throw new Error(error);
    }
}

const refreshToken = async (refreshToken) => {
    try {
        const decoded = jwtProvider.verifyToken(refreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE);

        const existingUser = await userModel.findOneByEmail(decoded.email);

        if (!existingUser) {
            throw new Error("User not found");
        }

        const userInfo = {
            _id: existingUser._id,
            email: existingUser.email,
            userName: existingUser.userName,
            displayName: existingUser.displayName,
            avatar: existingUser.avatar,
            refreshToken,
        };

        const accessToken = jwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, env.ACCESS_TOKEN_LIFE);
        userInfo.accessToken = accessToken;

        return userInfo;
    } catch (error) {
        throw new Error(error);
    }
}

const userService = {
    register,
    verifyUser,
    login,
    refreshToken,
}

export default userService;
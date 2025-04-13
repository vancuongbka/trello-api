import ApiError from '~/utils/ApiError';
import userService from '../services/userService';
import ms from 'ms';

const register = async (req, res, next) => {
    try {
        const registeredUser = await userService.register(req.body);
        res.status(201).json({ registeredUser });
    } catch (error) {
        next(error)
    }
}

const verifyUser = async (req, res, next) => {
    try {
        const verifiedUser = await userService.verifyUser(req.body);
        res.status(200).json({ verifiedUser });
    } catch (error) {    
        next(error) 
    }
}

const login = async (req, res, next) => {
    try {
        const user = await userService.login(req.body);
        res.cookie('accessToken', user.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days'),
        });
        res.cookie('refreshToken', user.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days'),
        });

        res.status(200).json({ user });
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({ loggedOut: true });
    } catch (error) {
        next(error)
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const result = await userService.refreshToken(req.cookies?.refreshToken);
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days'),
        });

        res.status(200).json(result);
    } catch (error) {
        next(new ApiError(401, "Unauthorized (Invalid refresh token)"));
    }
}

const userController = {
    register,
    verifyUser,
    login,
    logout,
    refreshToken,
};

export default userController;
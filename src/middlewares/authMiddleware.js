import jwtProvider from "~/providers/jwtProvider";
import ApiError from "~/utils/ApiError";
import { env } from "~/config/environment";

const isAuthorized = (req, res, next) => {
    // Get access token in cookie
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        next(new ApiError(401, "Unauthorized (Token not found)"));
        return;
    }

    try {
        const userInfo = jwtProvider.verifyToken(accessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE);

        req.userInfo = userInfo;
        next();
    } catch (error) {
        if (error.message?.includes("jwt expired")) {
            next(new ApiError(410, "Access token is expired"));
            return;
        }
        next(new ApiError(401, "Unauthorized (Invalid token)"));
    }
}

const authMiddleware = {
    isAuthorized
};

export default authMiddleware;
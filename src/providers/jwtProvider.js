import jwt from 'jsonwebtoken';

const generateToken = (payload, secretSignature, tokenLife) => {
    try {
        return jwt.sign(payload, secretSignature, { expiresIn: tokenLife });
    } catch (error) {
        throw error;
    }
}

const verifyToken = (token, secretSignature) => {
    try {
        return jwt.verify(token, secretSignature);
    } catch (error) {
        throw error;
    }
}

const jwtProvider = {
    generateToken,
    verifyToken, 
};

export default jwtProvider;
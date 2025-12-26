import jwt from "jsonwebtoken";

const JWT_SECRET=process.env.JWT_SECRET||'your-super-secret-jwt-key';
const JWT_EXPIRES_IN=process.env.JWT_EXPIRES_IN||'7d';

/**
 * Generate JWT token for a user
 * @param {string} userId - MongoDB user ID
 * @returns {string} JWT token
 */

export const generateToken=(userId)=>{
    return jwt.sign(
        {userId},
        JWT_SECRET,
        {expiresIn:JWT_EXPIRES_IN}
    );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */

export const verifyToken=(token)=>{
    return jwt.verify(token,JWT_SECRET);
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null
 */

export const extractToken=(authHeader)=>{
    if(authHeader && authHeader.startsWith('Bearer')){
        return authHeader.split(' ')[1];
    }
    return null;
};
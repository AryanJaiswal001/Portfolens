import User from '../models/User.js';
import { verifyToken,extractToken } from '../utils/jwt.js';

export const protect =async (req,res,next)=>{
    try{
        //Token extraction
        const token=extractToken(req.headers.authorization)

        if(!token)
        {
            return res.status(401).json({
                success:false,
                message:'Not authorised,no token provided',
            });
        }
        //Step 2:Verify token 
        let decoded;
        try{
            decoded=verifyToken(token);
        }
        catch(error){
            if(error.name==='JsonWebTokenError'){
            return res.status(401).json({
                success:false,
                message:'Invalid token',
            });
        }
        if(error.name==='TokenExpiredError')
        {
            return res.status(401).json({
                success:false,
                message:'Token expired,please login again',
            });
        }
        throw error;
        }
        //Find user and attach to request
        const user=await User.findById(decoded.userId).select('-password');

        if(!user){
            return res.status(401).json({
                success:false,
                message:'User not found,not authorised',
            });
        }
        req.user=user;
        next();
    }
    catch(error){
        console.error('❌ Auth Middleware Error:',error);
        res.status(500).json({
            success:false,
            message:'Server error in authentication',
        });
    }
};


export const optionalAuth=async(req,res,next)=>{
    try{
        const token=extractToken(req.headers.authorization);

        if(token){
            const decoded=verifyToken(token);
            req.user=await User.findById(decoded.userId).select('-password');
        }
        next();
    }catch(error){
        next();
    }
};
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import { hashPassword,comparePassword } from "../utils/password.js";

export const register=async(req,res)=>{
    try{
        const {name,email,password}=req.body;

    //Validation
    if(!name||!email||!password)
    {
        return res.status(400).json({
            success:false,
            message:'Provide missing credentails (email,name or password)',
        });
    }

    if(password.length<8)
    {
        return res.status(400),json({
            success:false,
            message:'Password must be at least 8 characters',
        });
    }

    //Check for existing user
    const existingUser=await User.findOne({email:email.toLowerCase()});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User with this email already exists",
        });
    }

    //Hash password
    const hashedPassword=await hashPassword(password);

    //Create user 
    const user=await User.create({
        name,
        email:email.toLowerCase(),
        password:hashedPassword,
        provider:'local',
    });

    //Generate token
    const token =generateToken(user._id);

    //Return user without password
    res.status(201).json({
        success:true,
        message:'User registered successfully',
        data:{
            user:user.toJSON(),
            token,
        },
    });
}
catch(error){
    console.error('Register error',error.message);

    //Handle duplicate key error
    if(error.code===11000){
        return res.status(400).json({
            success:false,
            message:'Email already registered',
        });
    }
    res.status(500).json({
        success:false,
        message:'Error registering user',
    });
}
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/password
 * @access  Private
 */

export const changePassword=async(req,res)=>{
    try{
        const {currentPassword,newPassword}=req.body;

        if(!currentPassword||!newPassword){
            return res.status(400).json({
                success:false,
                message:'Please provide current and new password',
            });
        }

        if(newPassword.length<8)
        {
            return res.status(400).json({
                success:false,
                message:"New password must be at least 8 characters",
            });
        }

        //Get user with password
        const user=await User.findById(req.user._id).select('+password');

        if(!user.password){
            return res.status(400).json({
                success:false,
                message:"Cannot change password for OAuth account",
            });
        }

        //Verify current password
        const isValid=await comparePassword(currentPassword,user.password);
        if(!isValid){
            return res.status(401).json({
                success:false,
                message:"Current password is incorrect",
            });
        }

        //Hash and save new password
        user.password=await hashPassword(newPassword);
        await user.save();

        res.status(200).json({
            success:true,
            message:'Password changed successfully',
        });
    }
    catch(error){
        console.error("Change password error",error.message);
        res.status(500).json({
            success:false,
            message:"Error changing password",
        });
    }
};
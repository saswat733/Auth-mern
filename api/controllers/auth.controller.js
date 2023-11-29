import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'



export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    
    // Logging for debugging
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);

    try {
        var hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        next(err);
    }
}

export const singin=async (req,res,next)=>{
    const {email,password}=req.body;

    console.log('email:',email);
    console.log('password:',password);

    try {
        const validUser=await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404,'User not found'));

        }
        const validPassword=bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return next(errorHandler(401,'wrong credentials'))
        }
        const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET);
        const {password:hashedPassword,...rest} =validUser._doc;

        const expiryDate=new Date(Date.now()+3600000);//1 hour
        res.cookie('access_token',token,{httpOnly:true ,expires:expiryDate}).status(200).json(rest)

    } catch (error) {
        next(error);
    }

}
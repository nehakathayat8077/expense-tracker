const userModel= require('../models/user.model')
const jwt=require('jsonwebtoken')
const bcryptjs = require('bcryptjs');


const register=async(req,res)=>{
    try{
         const {name,email,password}=req.body
         const existingUser= await userModel.findOne({email})
         if(existingUser){
            return res.status(402).json({
                message:"user with the same username already exists"
            })
         }
         //if user alrady doesnt exists
         //hash the password
         const hashedPassword=await  bcryptjs.hash(password,10)
         const user= await userModel.create({
            name,email,
            password:hashedPassword
         })
         //create token
         const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
         //send to cookie
         res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // ← this line!
            sameSite: "strict"
            })
         //show message
         res.status(201).json({
            message:"user created",
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
         })
    }catch(err){
        return res.status(500).json({
            message:err.message
        })

    }
   

}
const login=async(req,res)=>{
    try{
        const {email,password}= req.body
        const user = await userModel.findOne({
            email
        })
        //if user is not found
        if(!user){
            return res.status(402).json({
                message:"user with this email no found"
            })
        }
        //if found 
        //compare the passwords
        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" })
        }
        //if password matched
        const token = jwt .sign(
            {id:user._id },
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        )
        //pass token to cookie
        res.cookie("token",token)
        res.status(200).json({
            user: { id: user._id, name: user.name }
            })

    }catch(err){
        return res.status(500).json({
            message:"some error occured"
        })
    }

}

const logOut=(req,res)=>{
    res.clearCookie("token")
    res.json({
        message:"you have been logged out.."
    })
}   


module.exports={register,login,logOut}
const express = require('express');
const jwt = require('jsonwebtoken')
const protect =async (req,res,next)=>{
     const token = req.cookies.token
        if(!token){
            return res.status(401).json({
                message:"unauthorised access"
            })
        }
    try{
        //if token present then verify 
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next()
    }
    catch(err){
        return res.status(401).json({
            message:"inavilid token"
        })
    }
}
module.exports= protect
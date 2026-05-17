
const transactionModel= require('../models/transaction.model')

const getTransaction=async (req,res)=>{
    try{
        //to show the latest fist 
        const transaction = await transactionModel.find({user:req.user.id}).sort({createdAt:-1})
        if(!transaction){
            return res.status(402).json({
                message:"no transaction found "
            })
        }
        res.status(200).json({
            message:"transaction found!",
            transaction
        })

    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}
const addTransaction=async (req,res)=>{
    try{
        const {title,amount , type, category}= req.body
        const transaction =await transactionModel.create({
            user:req.user.id,
            title,
            amount ,
            type,
            category
        })
        res.status(201).json({
            message:"transaction added!",
            transaction
        })
    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
    
}
const deleteTransaction=async (req,res)=>{
    try{
        const transaction = await transactionModel.findById(req.params.id)
        if(!transaction ){
            return res.status(402).json({
                message:"mo transaction found to delete "
            })
        }
           // Make sure user owns this transaction
        if (transaction.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "Not authorized" })
        }
        //transaction of the same user
        await transactionModel.findByIdAndDelete(req.params.id)
        res.status(200).json({
            message:"deleted"
        })

    }catch(err){
        return res.status(500).json({
            message:err.message
        })
    }
}

module.exports = {getTransaction,addTransaction,deleteTransaction}
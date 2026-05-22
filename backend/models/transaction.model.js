const mongoose = require('mongoose');
const transactionSceham = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true

    },
    title:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        enum:['income','expense'],
        required:true
    },
    category:{
        type:String,
        required:true
        
    }
},{timestamps:true})
const transactionModel= mongoose.model("transaction",transactionSceham)
module.exports= transactionModel
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/config');
const authRouter=require('./routes/auth')
const transactionRouter= require('./routes/transaction')
const cookieParser = require('cookie-parser')


const app= express()

dotenv.config()
// and in middlewares section
app.use(cookieParser())
app.use(express.json())
app.use(cors())
connectDB()

app.listen(3000,()=>{
    console.log("port 3000 server running")
})

app.get('/',(req,res)=>{
    res.send("api running")
})

app.use('/api/auth',authRouter)
app.use('/api/transaction',transactionRouter)
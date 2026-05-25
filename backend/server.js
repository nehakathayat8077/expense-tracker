const dotenv = require('dotenv')
dotenv.config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./db/config');
const authRouter=require('./routes/auth')
const transactionRouter= require('./routes/transaction')
const cookieParser = require('cookie-parser')


const app= express()


// and in middlewares section
app.use(cookieParser())
app.use(express.json())
app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:5174", "https://expense-tracker-noky.onrender.com"],
  credentials: true 
}))
connectDB()


app.get('/',(req,res)=>{
    res.send("api running")
})

app.use('/api/auth',authRouter)
app.use('/api/transaction',transactionRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
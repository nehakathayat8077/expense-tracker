const express = require('express');

const { getTransaction, addTransaction, deleteTransaction } = require('../controllers/transaction.controller');
const router= express.Router()

//middleware 
const protect = require('../middleware/auth.middleware')
router.get('/',protect,getTransaction)
router.post('/',protect,addTransaction)
router.delete('/:id',protect,deleteTransaction)


module.exports= router
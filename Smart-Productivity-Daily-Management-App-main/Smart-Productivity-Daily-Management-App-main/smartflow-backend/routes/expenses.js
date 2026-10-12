const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async(req,res)=>{
  const expenses = await Expense.find({user: req.user.id}).sort({date: -1});
  const total = expenses.reduce((sum,e)=> sum + e.amount, 0);
  res.json({expenses, total});
});
router.post('/', auth, async(req,res)=>{
  const expense = await Expense.create({...req.body, user: req.user.id});
  res.json(expense);
});
router.delete('/:id', auth, async(req,res)=>{
  await Expense.findOneAndDelete({_id: req.params.id, user: req.user.id});
  res.json({msg: 'Deleted'});
});
module.exports = router;
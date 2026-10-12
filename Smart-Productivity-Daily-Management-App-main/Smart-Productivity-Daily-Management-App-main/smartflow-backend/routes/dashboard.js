const express = require('express');
const Task = require('../models/Task');
const Note = require('../models/Note');
const Expense = require('../models/Expense');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/summary', auth, async(req,res)=>{
  const tasks = await Task.countDocuments({user: req.user.id, completed: false});
  const notes = await Note.countDocuments({user: req.user.id});
  const events = await Event.find({user: req.user.id, date: {$gte: new Date()}}).limit(5);
  const expenses = await Expense.find({user: req.user.id});
  const totalExpense = expenses.reduce((s,e)=> s+e.amount,0);
  res.json({pendingTasks: tasks, totalNotes: notes, upcomingEvents: events, totalExpense, recentExpenses: expenses.slice(0,5)});
});
module.exports = router;
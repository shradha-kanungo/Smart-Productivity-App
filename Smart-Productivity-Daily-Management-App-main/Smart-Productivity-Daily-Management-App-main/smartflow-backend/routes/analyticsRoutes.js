const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Expense = require('../models/Expense');

// GET /api/analytics/:userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  // 1. Weekly Tasks Data - Last 7 days
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const weeklyData = [];
  for (let i = 6; i >=0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const start = new Date(date.setHours(0,0,0,0));
    const end = new Date(date.setHours(23,59,59,999));

    const completed = await Task.countDocuments({ userId, status: 'completed', updatedAt: { $gte: start, $lte: end } });
    const pending = await Task.countDocuments({ userId, status: { $ne: 'completed' }, createdAt: { $lte: end } });

    weeklyData.push({
      label: days[date.getDay()],
      completed,
      pending,
      value: completed, // for chart
    });
  }

  // 2. Expense Category Breakdown
  const expenses = await Expense.aggregate([
    { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } }
  ]);

  const totalExpense = expenses.reduce((sum, e) => sum + e.total, 0);
  const pieData = expenses.map(e => ({
    value: e.total,
    label: e._id,
    text: `${Math.round((e.total/totalExpense)*100)}%`,
    color: getColorForCategory(e._id)
  }));

  // 3. Monthly Overview
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyStats = {
    tasksCompleted: await Task.countDocuments({ userId, status: 'completed', updatedAt: { $gte: firstDay } }),
    tasksPending: await Task.countDocuments({ userId, status: { $ne: 'completed' } }),
    totalExpenses: totalExpense,
    eventsCount: 0 // agar Events model hai toh count kar lo
  };

  res.json({ weeklyData, pieData, monthlyStats });
});

function getColorForCategory(cat){
  const colors = {
    Food: '#FF6B6B', Travel: '#4ECDC4', Shopping: '#45B7D1',
    Bills: '#FFA600', Health: '#96CEB4', Other: '#6366F1'
  };
  return colors[cat] || '#6366F1';
}
module.exports = router;
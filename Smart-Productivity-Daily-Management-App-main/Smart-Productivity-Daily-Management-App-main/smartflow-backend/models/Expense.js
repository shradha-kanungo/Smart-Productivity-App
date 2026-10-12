const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Other'], default: 'Other' },
  paymentMethod: { type: String, enum: ['Cash', 'UPI', 'Card', 'NetBanking'], default: 'UPI' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['Meeting', 'Birthday', 'Payment', 'Reminder', 'Other'], default: 'Reminder' },
  date: { type: Date, required: true },
  repeat: { type: String, enum: ['Once', 'Daily', 'Weekly', 'Monthly', 'Custom'], default: 'Once' },
  customRepeatDays: Number, // for Custom
  status: { type: String, enum: ['pending', 'completed', 'snoozed'], default: 'pending' },
  snoozedUntil: Date,
}, { timestamps: true });
module.exports = mongoose.model('Event', eventSchema);
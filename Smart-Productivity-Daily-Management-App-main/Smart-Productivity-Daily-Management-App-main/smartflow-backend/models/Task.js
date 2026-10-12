const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  dueDate: { type: Date },
  reminder: { type: Date }, // Reminder time
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
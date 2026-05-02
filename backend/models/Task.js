const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority:  { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate:   { type: Date },
  status:    { type: String, enum: ['new', 'inProgress', 'completed'], default: 'new' },
  scheduled: { type: Boolean, default: false },
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);

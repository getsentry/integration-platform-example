import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  complexity: Number,
  assignee: {
    type: 'ObjectId',
    ref: 'User',
  },
  column: {
    type: String,
    enum: ['TODO', 'DOING', 'DONE'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Item', itemSchema);

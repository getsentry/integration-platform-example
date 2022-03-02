import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  complexity: Number,
});

const Item = mongoose.model('Item', itemSchema);

export default Item;

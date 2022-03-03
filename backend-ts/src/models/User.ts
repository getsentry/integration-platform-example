import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  avatar: String,
});

export default mongoose.model('User', userSchema);

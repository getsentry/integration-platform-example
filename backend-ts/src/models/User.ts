import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  name: String,
  avatar: String,
});

export default mongoose.model('User', userSchema);

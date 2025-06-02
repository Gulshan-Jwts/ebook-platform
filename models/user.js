import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, },
  username: { type: String, required: true, unique: true },
  purchasedList: [{ type: String }],
  cartList: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  firstName: String,
  isAdmin: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Store user ID as ObjectId
    required: true, // Ensure every URL is tied to a user
    ref: 'User', // Reference to User collection (optional, if you have a User model)
  },
});

const Url = mongoose.model('Url', urlSchema);

export default Url;
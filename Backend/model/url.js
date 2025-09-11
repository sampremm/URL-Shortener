import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const urlSchema = new Schema(
  {
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
    },
    shortUrl: {
      type: String,
      required: [true, 'Short URL is required'],
      unique: true,
      index: true, // speeds up lookups
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // link to User collection
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

// Optional: add a compound index for faster analytics by user
// urlSchema.index({ userId: 1, shortUrl: 1 });

const Url = model('Url', urlSchema);

export default Url;
